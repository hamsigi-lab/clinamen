const EXAM_PROMPT = (text, schoolType, subject, totalScore) => `
당신은 ${schoolType || '학교'} ${subject || ''}시험지 검토 전문가입니다.
교육청 출제 지침에 따라 아래 시험지를 꼼꼼히 검토하고 오류를 찾아주세요.

검토 항목:
1. 문항 번호 순서 오류 (빠진 번호, 중복 번호)
2. 배점 합계가 총점(${totalScore || '미입력'})과 일치하는지
3. 객관식 선지 형식 불일치 (①②③ 혼용 등)
4. 정답이 없거나 복수 정답 가능성
5. 지문·보기의 맞춤법·문법 오류
6. 문항 내 모순 또는 불명확한 표현
7. 교육청 지침 위반 (시판 참고서 문항 복사, 전년도 문항 재출제 등 의심)
8. 기타 출제 오류

시험지 내용:
---
${text.slice(0, 80000)}
---

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{"issues": [{"level": "높음|중간|낮음|정보", "category": "카테고리", "title": "오류 제목", "desc": "상세 설명"}]}

오류가 없으면: {"issues": []}
`;

const RECORD_PROMPT = (text, schoolType, recordSection, checkMode) => `
당신은 ${schoolType || '학교'} 학교생활기록부 기재 전문가입니다.
2025 교육부 학교생활기록부 기재요령 기준으로 아래 내용을 검토해주세요.

검토 모드: ${checkMode === 'forbidden' ? '기재 금지 항목만' : checkMode === 'spelling' ? '맞춤법만' : '전체'}
항목: ${recordSection || '전체 항목'}

기재 불가 항목 (반드시 확인):
- 공인어학시험 성적 (TOEIC, TOEFL, TEPS, IELTS, HSK, JPT 등)
- 교외 대회 참여 및 수상 실적
- 모의고사·수능 성적, 인증시험 성적
- 특정 대학교명, 학원명, 사교육 기관명
- 부모 직업·직장·직위명
- 해외 어학연수·봉사활동 실적
- 논문 투고·도서출간·지식재산권
- 장학금·장학생 관련 내용
- 학생이 재학한 고교를 알 수 있는 내용 (일부 항목 제외)

추가 검토:
- 과장되거나 검증 불가한 표현
- 부정적·차별적 표현
- 맞춤법·문법 오류
- 항목과 관련 없는 내용 기재

검토할 생활기록부 내용:
---
${text.slice(0, 80000)}
---

반드시 아래 JSON 형식으로만 응답하세요:
{"issues": [{"level": "높음|중간|낮음|정보", "category": "카테고리", "title": "문제 제목", "desc": "상세 설명 및 수정 방향", "quote": "해당 원문 구절 (있는 경우)"}]}

오류가 없으면: {"issues": []}
`;

export async function onRequestPost(context) {
  const { request, env } = context;
  const { type, text, schoolType, subject, totalScore, recordSection, checkMode } = await request.json();

  if (!text?.trim()) return json({ error: '내용을 입력해주세요.' }, 400);
  if (text.length > 100000) return json({ error: '내용이 너무 깁니다. 10만 자 이내로 입력해주세요.' }, 400);

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: '서버 설정 오류입니다.' }, 500);

  const prompt = type === 'exam'
    ? EXAM_PROMPT(text, schoolType, subject, totalScore)
    : RECORD_PROMPT(text, schoolType, recordSection, checkMode);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4096, temperature: 0.2 },
      }),
    }
  );

  if (!response.ok) {
    console.error('Gemini error:', await response.text());
    return json({ error: 'AI 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, 502);
  }

  const result = await response.json();
  const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  let issues;
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] ?? '{}');
    issues = parsed.issues ?? [];
    if (!Array.isArray(issues)) throw new Error();
  } catch {
    return json({ error: 'AI 응답 처리 오류입니다. 다시 시도해주세요.' }, 500);
  }

  return json({ issues });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
