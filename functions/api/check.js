const EXAM_PROMPT = (schoolType, subject, totalScore, itemTableText, scoringTableText, hasItemTableImg, hasScoringTableImg) => {
  const docs = ['• 이미지 1: 시험지 원안'];
  let imgIdx = 2;
  if (hasItemTableImg) docs.push(`• 이미지 ${imgIdx++}: 문항정보표(이원목적분류표)`);
  if (hasScoringTableImg) docs.push(`• 이미지 ${imgIdx++}: 서답형 채점기준표`);
  if (itemTableText) docs.push('• 문항정보표 텍스트: 아래 [문항정보표 내용] 참조');
  if (scoringTableText) docs.push('• 서답형 채점기준표 텍스트: 아래 [채점기준표 내용] 참조');

  return `당신은 낭주중학교 시험지 검토 전문가입니다. 2026학년도 낭주중학교 학업성적관리규정 기준으로 제공된 자료를 종합 검토해주세요.

과목: ${subject || '미기재'} | 학교급: ${schoolType || '중학교'} | 총점: ${totalScore || '100점'}

[검토 자료]
${docs.join('\n')}

[검토 기준 — 우선순위 순]

1순위 오탈자·표현 오류 (최우선)
- 맞춤법, 띄어쓰기, 문장부호 오류
- 문법적으로 어색하거나 의미 불분명한 표현
- 동일 문항 내 용어 불일치
- 사실 오류 (연도, 인명, 지명, 수치)

2순위 문항정보표 ↔ 시험지 대조 (문항정보표 제공 시 반드시 검토)
- 문항별 배점 일치 여부
- 내용영역·성취기준과 문항 내용 부합 여부
- 난이도(상/중/하) 비율 규정 일치
- 총 문항 수 일치
- 성취기준 코드 형식 확인 (예: 9수01-01)

3순위 서답형 배점·비율 (낭주중 학업성적관리규정)
- 서답형 총 배점 ≥ 총점의 30%
- 국어·사회(역사포함)·도덕·수학·과학·영어: 서술(논술)형 ≥ 총점의 20%
- 채점기준표 완비 여부: 기본답안 + 인정답안 + 부분점수 기준 (채점기준표 제공 시)
- 2점 이상 서답형 문항: 부분점수 기준 명시 여부

4순위 형식·서식 오류
- 부정형 발문(~아닌 것은, ~틀린 것은): bold + 밑줄 필수
- 선택형·서답형 문항 번호 체계 분리 여부
- 꼬리말 완비: 학년도·과목명·학년·학기·고사명·쪽수
- 전체 배점 합계 = ${totalScore || '100'}점 여부
- 문항 번호 연속성 (누락·중복 확인)

5순위 출제 내용 적정성
- 복수정답 가능성
- 정답 없는 문항
- 문항 간 단서 제공 (문항 간섭)
- 선지 형식 극단적 불균형
- 교육과정 범위 이탈 문항
- 기출문제·참고서 전재 의심
- 정치·종교적 편향 소재
${itemTableText ? `\n[문항정보표 내용]\n---\n${itemTableText.slice(0, 25000)}\n---` : ''}
${scoringTableText ? `\n[서답형 채점기준표 내용]\n---\n${scoringTableText.slice(0, 15000)}\n---` : ''}

반드시 아래 JSON 형식으로만 응답하세요:
{"issues": [{"level": "높음|중간|낮음|정보", "category": "카테고리명", "title": "오류 제목", "desc": "상세 설명 및 수정 방향", "boundingBox": {"y_min": 0, "x_min": 0, "y_max": 100, "x_max": 1000}}]}

boundingBox: 시험지 이미지(이미지 1)를 1000×1000 기준 좌표. 시험지 이미지와 무관한 항목(문항정보표 오류, 채점기준표 누락 등)은 "boundingBox": null.

오류가 없으면: {"issues": []}`;
};

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
  const {
    type, imageData, text,
    schoolType, subject, totalScore,
    recordSection, checkMode,
    itemTableText, itemTableImage,
    scoringTableText, scoringTableImage,
  } = body;

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: '서버 설정 오류입니다.' }, 500);

  let contents;

  if (type === 'exam') {
    if (!imageData) return json({ error: '시험지 이미지가 없습니다.' }, 400);

    const hasItemTableImg = !!itemTableImage;
    const hasScoringTableImg = !!scoringTableImage;

    const parts = [
      { text: EXAM_PROMPT(schoolType, subject, totalScore, itemTableText, scoringTableText, hasItemTableImg, hasScoringTableImg) },
      { inline_data: { mime_type: 'image/jpeg', data: imageData } },
    ];
    if (hasItemTableImg) parts.push({ inline_data: { mime_type: 'image/jpeg', data: itemTableImage } });
    if (hasScoringTableImg) parts.push({ inline_data: { mime_type: 'image/jpeg', data: scoringTableImage } });

    contents = [{ parts }];

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
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.2,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  );

  if (!response.ok) {
    console.error('Gemini error:', await response.text());
    return json({ error: 'AI 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, 502);
  }

  const result = await response.json();
  const parts = result.candidates?.[0]?.content?.parts ?? [];
  const raw = parts
    .filter(p => !p.thought)
    .map(p => p.text ?? '')
    .join('');

  if (!raw) {
    console.error('Empty response:', JSON.stringify(result).slice(0, 300));
    return json({ error: 'AI 응답이 비어있습니다. 다시 시도해주세요.' }, 500);
  }

  let issues;
  try {
    const cleaned = raw
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    const match = cleaned.match(/\{"issues"\s*:\s*\[[\s\S]*?\]\s*\}/);
    if (!match) throw new Error('no json');
    const parsed = JSON.parse(match[0]);
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
