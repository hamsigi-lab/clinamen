const EXAM_IMAGE_PROMPT = (schoolType, subject, totalScore) => `
당신은 ${schoolType || '학교'} ${subject || ''} 시험지 검토 전문가입니다.
이 시험지 이미지를 꼼꼼히 분석하여 오류를 찾아주세요.

검토 항목:
1. 문항 번호 순서 오류 (빠진 번호, 중복 번호)
2. 배점 합계가 총점(${totalScore || '미기재'})과 일치하는지
3. 객관식 선지 형식 불일치
4. 정답이 없거나 복수 정답 가능성
5. 지문·보기의 맞춤법·문법 오류
6. 문항 내 모순 또는 불명확한 표현
7. 교육청 지침 위반 의심 사항
8. 기타 출제 오류

오류를 찾으면 이미지 내 해당 위치를 boundingBox로 표시해주세요.
boundingBox는 이미지 크기를 1000x1000으로 가정했을 때의 좌표입니다.

반드시 아래 JSON 형식으로만 응답하세요:
{"issues": [{"level": "높음|중간|낮음|정보", "category": "카테고리", "title": "오류 제목", "desc": "상세 설명", "boundingBox": {"y_min": 0, "x_min": 0, "y_max": 100, "x_max": 1000}}]}

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

추가 검토:
- 과장되거나 검증 불가한 표현
- 부정적·차별적 표현
- 맞춤법·문법 오류

검토할 내용:
---
${text.slice(0, 80000)}
---

반드시 아래 JSON 형식으로만 응답하세요:
{"issues": [{"level": "높음|중간|낮음|정보", "category": "카테고리", "title": "문제 제목", "desc": "상세 설명 및 수정 방향", "quote": "해당 원문 구절"}]}

오류가 없으면: {"issues": []}
`;

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { type, mode, imageData, text, schoolType, subject, totalScore, recordSection, checkMode } = body;

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: '서버 설정 오류입니다.' }, 500);

  let contents;

  if (type === 'exam' && mode === 'image') {
    if (!imageData) return json({ error: '이미지 데이터가 없습니다.' }, 400);
    contents = [{
      parts: [
        { text: EXAM_IMAGE_PROMPT(schoolType, subject, totalScore) },
        { inline_data: { mime_type: 'image/jpeg', data: imageData } },
      ],
    }];
  } else if (type === 'record') {
    if (!text?.trim()) return json({ error: '내용을 입력해주세요.' }, 400);
    if (text.length > 100000) return json({ error: '내용이 너무 깁니다.' }, 400);
    contents = [{ parts: [{ text: RECORD_PROMPT(text, schoolType, recordSection, checkMode) }] }];
  } else {
    return json({ error: '잘못된 요청입니다.' }, 400);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 4096, temperature: 0.2 },
      }),
    }
  );

  if (!response.ok) {
    console.error('Gemini error:', await response.text());
    return json({ error: 'AI 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, 502);
  }

  const result = await response.json();
  const parts = result.candidates?.[0]?.content?.parts ?? [];
  const raw = parts.map(p => p.text ?? '').join('');

  if (!raw) {
    console.error('Empty response:', JSON.stringify(result).slice(0, 300));
    return json({ error: 'AI 응답이 비어있습니다. 다시 시도해주세요.' }, 500);
  }

  let issues;
  try {
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('no json');
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    issues = parsed.issues ?? [];
    if (!Array.isArray(issues)) throw new Error('not array');
  } catch (e) {
    console.error('Parse error:', e.message, '| raw:', raw.slice(0, 300));
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
