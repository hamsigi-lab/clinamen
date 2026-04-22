export async function onRequestPost(context) {
  const { request, env } = context;

  const { message } = await request.json();

  if (!message || message.trim().length === 0) {
    return json({ error: '메시지를 입력해주세요.' }, 400);
  }

  if (message.length > 1000) {
    return json({ error: '메시지가 너무 길어요. 1000자 이내로 입력해주세요.' }, 400);
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: '서버 설정 오류입니다.' }, 500);
  }

  const prompt = `다음 메시지 또는 상황에 대한 자연스러운 한국어 답장 3가지를 생성해줘.

메시지/상황: ${message}

규칙:
- 상황과 맥락을 파악해서 어울리는 톤으로 작성
- 각 옵션은 서로 다른 뉘앙스 (예: 짧게/길게, 부드럽게/직접적으로 등)
- 실제로 바로 보낼 수 있을 만큼 자연스러운 한국어
- 이모지는 상황에 맞게만 사용
- 반드시 아래 JSON 형식으로만 응답:

{"replies": ["답장1", "답장2", "답장3"]}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Anthropic API error:', err);
    return json({ error: 'AI 호출 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.' }, 502);
  }

  const result = await response.json();
  const text = result.content?.[0]?.text ?? '';

  let replies;
  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? '{}');
    replies = parsed.replies;
    if (!Array.isArray(replies) || replies.length === 0) throw new Error();
  } catch {
    return json({ error: 'AI 응답을 처리하지 못했어요. 다시 시도해주세요.' }, 500);
  }

  return json({ replies });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
