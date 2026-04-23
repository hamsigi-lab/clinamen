const EXAM_PROMPT = (schoolType, subject, totalScore, itemTableText, scoringTableText, hasItemTableImg, hasScoringTableImg) => {
  const docs = ['• 이미지 1: 시험지 원안'];
  let imgIdx = 2;
  if (hasItemTableImg) docs.push(`• 이미지 ${imgIdx++}: 문항정보표(이원목적분류표)`);
  if (hasScoringTableImg) docs.push(`• 이미지 ${imgIdx++}: 서답형 채점기준표`);
  if (itemTableText) docs.push('• 문항정보표 텍스트: 아래 [문항정보표 내용] 참조');
  if (scoringTableText) docs.push('• 서답형 채점기준표 텍스트: 아래 [채점기준표 내용] 참조');

  return `당신은 낭주중학교 시험지 검토 전문가입니다.
2026학년도 낭주중학교 학업성적관리규정 및 교육청 문항 오류 최소화 점검표 기준으로 제공된 자료를 종합 검토해주세요.

과목: ${subject || '미기재'} | 학교급: ${schoolType || '중학교'} | 총점: ${totalScore || '100점'}

[검토 자료]
${docs.join('\n')}

━━━ 검토 기준 (우선순위 순) ━━━

【1순위】 오탈자·편집 오류 — 반드시 모두 찾아낼 것
- 발문·지문·선지·보기의 맞춤법, 띄어쓰기, 문장부호 오류
- 사실 오류 (연도, 인명, 지명, 수치, 단위)
- 동일 문항 내 용어 혼용 또는 불일치
- 글꼴·글자색·크기 불통일 → 편집 오류로 인한 정답 암시 가능성
- 발문에 불필요하거나 모호한 표현 포함 여부
- 발문 초점이 불분명하거나 출제 의도가 불명확한 경우

【2순위】 문항정보표 ↔ 시험지 대조 (문항정보표 제공 시 반드시 전수 검토)
- 배점 총합 = ${totalScore || '100'}점 일치 여부 (고사원안·문항정보표 양쪽 모두)
- 문항별 배점 상호 일치 여부
- 시험지 정답과 문항정보표 정답 일치 여부
- 고사명·고사일시·과목명·학년 등 기재 내용 일치 여부
- 성취기준 코드 형식 및 문항 내용과의 부합 여부 (예: 9수01-01)
- 내용영역이 실제 문항 내용과 일치하는지
- 난이도(상/중/하) 비율이 학교 규정과 일치하는지
- 총 문항 수 일치 여부

【3순위】 서답형 배점·채점기준 (낭주중 학업성적관리규정)
- 서답형(단답+서술+논술) 총 배점 ≥ 총점의 30%
- 국어·사회(역사포함)·도덕·수학·과학·영어: 서술(논술)형 ≥ 총점의 20%
- 서답형 문항 배점 기준(평가 요소별·조건별 부분점수 부여 여부) 세부 제시 여부
- 채점기준표 완비 여부: 기본답안 + 인정답안 + 부분점수 기준 (채점기준표 제공 시)
- 2점 이상 서답형 문항의 부분점수 기준 명시 여부

【4순위】 고사원안 형식·서식 오류
- 부정형 발문(~아닌 것은, ~틀린 것은, ~없는 것은 등): 진한 글씨(bold) + 밑줄 동시 적용 여부
- 선택형·서답형 문항 번호 체계 분리 여부
- 매 쪽 꼬리말 완비: 학년도·과목명·학년·학기·고사명·전체 쪽수·해당 쪽 번호
- 문항 번호 연속성 (누락·중복 여부)
- 고사원안 무단 사용 금지 문구 명시 여부
- 정답 도출에 필요한 모든 조건이 발문/지문에 제시되었는지

【5순위】 선택지(선지) 오류
- 선택지 번호 중복 여부 (예: ①이 두 번 나오는 경우)
- 두 개 이상의 선택지에 공통 요소가 포함되어 정답 단서가 되는 경우
- 동일 내용으로 중복된 선택지 여부
- 지문·보기와 무관한 내용으로 선택지 구성 여부
- 정답 선택지가 오답 논란 소지가 있는 경우
- 오답 선택지가 정답 논란 소지가 있는 경우
- 발문의 정답의 단서가 지문·보기·다른 문항에서 과도하게 제시된 경우

【6순위】 출제 내용 적정성
- 복수정답 가능성 (둘 이상 선지가 정답이 될 수 있는 경우)
- 정답이 없는 문항
- 문항 간섭: 다른 문항으로 정답을 유추할 수 있는 경우
- 교육과정 성취기준 범위 이탈 또는 선행학습 내용 출제
- 수업목표·성취기준과 무관한 지식·기능 평가 여부
- 주어진 시험 시간 내 해결이 불가능한 수준의 난이도
- 역배점 의심 (어려운 문항에 낮은 배점, 쉬운 문항에 높은 배점)
- 기출문제·시중 참고서 문제 전재 의심
- 정치·종교·문화 편향성 있는 소재 사용
- 특정 학급·학생에게 문항 내용을 암시할 가능성 (문제 유출 의혹)
- 제시 자료(그림, 표, 보기)의 내용 오류 또는 출처 문제
${itemTableText ? `\n[문항정보표 내용]\n---\n${itemTableText.slice(0, 25000)}\n---` : ''}
${scoringTableText ? `\n[서답형 채점기준표 내용]\n---\n${scoringTableText.slice(0, 15000)}\n---` : ''}

━━━ 응답 형식 ━━━
반드시 아래 JSON 형식으로만 응답하세요:
{"issues": [{"level": "높음|중간|낮음|정보", "category": "카테고리명", "title": "오류 제목", "desc": "상세 설명 및 수정 방향", "boundingBox": {"y_min": 0, "x_min": 0, "y_max": 100, "x_max": 1000}}]}

level 기준:
- 높음: 채점 오류·복수정답·오탈자 등 즉시 수정 필요
- 중간: 규정 위반·서식 오류 등 수정 권장
- 낮음: 표현 개선·확인 권고 사항
- 정보: 참고용 안내

boundingBox: 시험지 이미지(이미지 1) 기준 1000×1000 좌표. 시험지 이미지와 무관한 항목(문항정보표 오류, 채점기준표 누락 등)은 "boundingBox": null.

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
  try {
    return await handleRequest(context);
  } catch (e) {
    console.error('Unhandled exception:', e?.message, e?.stack?.slice(0, 300));
    return json({ error: '서버 오류', _debug: String(e?.message) }, 500);
  }
}

async function handleRequest(context) {
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

  const response = await callGemini(contents, apiKey);

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini HTTP error:', response.status, errText.slice(0, 300));

    if (response.status === 429) {
      let waitMsg = '1분 후 다시 시도해주세요.';
      try {
        const details = JSON.parse(errText)?.error?.details ?? [];
        const retryDelay = details.find(d => d['@type']?.includes('RetryInfo'))?.retryDelay;
        if (retryDelay) {
          const sec = parseInt(retryDelay);
          if (!isNaN(sec) && sec > 0) waitMsg = `${sec}초 후 다시 시도해주세요.`;
        }
      } catch(e) {}
      return json({
        error: `무료 API 요청 한도 초과 — ${waitMsg}\n(오늘 사용량이 많으면 내일 자동 초기화됩니다. 지속 문제 시 Google AI Studio에서 유료 플랜 활성화 필요)`,
      }, 429);
    }

    return json({ error: `AI 오류 [${response.status}] — 잠시 후 다시 시도해주세요.` }, 502);
  }

  const result = await response.json();

  if (result.error) {
    console.error('Gemini API error:', JSON.stringify(result.error).slice(0, 300));
    return json({ error: 'AI 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, 502);
  }

  const finishReason = result.candidates?.[0]?.finishReason ?? 'UNKNOWN';
  const parts = result.candidates?.[0]?.content?.parts ?? [];
  const raw = parts
    .filter(p => !p.thought)
    .map(p => p.text ?? '')
    .join('');

  if (!raw) {
    console.error('Empty response | finish:', finishReason, '| result:', JSON.stringify(result).slice(0, 400));
    return json({ error: 'AI 응답이 비어있습니다. 다시 시도해주세요.' }, 500);
  }

  let issues;
  try {
    const cleaned = raw
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    issues = extractIssues(cleaned);
    if (!issues) throw new Error('no json');
  } catch (e) {
    console.error('Parse error | finish:', finishReason, '| raw[:600]:', raw.slice(0, 600));
    return json({ error: 'AI 응답 처리 오류입니다. 다시 시도해주세요.' }, 500);
  }

  return json({ issues });
}

// 503(서버 혼잡)만 다음 모델로 전환. 429(한도 초과)는 즉시 반환 — 키가 같으면 모델 바꿔도 소용없음
async function callGemini(contents, apiKey) {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  const body = JSON.stringify({
    contents,
    generationConfig: { maxOutputTokens: 16384, temperature: 0.2 },
  });

  let lastRes;
  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
    );
    console.log(`${model} → ${res.status}`);
    if (res.status !== 503) return res; // 429 포함 모든 비-503은 즉시 반환
    lastRes = res;
  }
  return lastRes;
}

// 다중 전략으로 JSON 추출 — Gemini가 설명 텍스트를 앞뒤로 붙이는 경우에도 대응
function extractIssues(cleaned) {
  // 전략 1: {"issues": [...]} 전체 greedy 매칭
  const m1 = cleaned.match(/\{"issues"\s*:\s*\[[\s\S]*\]\s*\}/);
  if (m1) {
    try {
      const p = JSON.parse(m1[0]);
      if (Array.isArray(p.issues)) return p.issues;
    } catch(e) {}
  }

  // 전략 2: "issues" 키 뒤의 배열만 추출
  const m2 = cleaned.match(/"issues"\s*:\s*(\[[\s\S]*\])/);
  if (m2) {
    try {
      const arr = JSON.parse(m2[1]);
      if (Array.isArray(arr)) return arr;
    } catch(e) {}
  }

  // 전략 3: 응답 전체를 JSON으로 파싱
  try {
    const p = JSON.parse(cleaned);
    if (Array.isArray(p.issues)) return p.issues;
    if (Array.isArray(p)) return p;
  } catch(e) {}

  // 전략 4: {"issues": 이후 잘린 경우 복구 시도
  const start = cleaned.indexOf('{"issues"');
  if (start !== -1) {
    const fragment = cleaned.slice(start);
    const lastComma = fragment.lastIndexOf('},{');
    const candidate = lastComma !== -1
      ? fragment.slice(0, lastComma + 1) + ']}'
      : fragment + ']}';
    try {
      const p = JSON.parse(candidate);
      if (Array.isArray(p.issues)) return p.issues;
    } catch(e) {}
  }

  return null;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
