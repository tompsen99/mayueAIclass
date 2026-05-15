export async function onRequest({ request, env }) {

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { text } = await request.json();

  if (!text || !text.trim()) {
    return new Response(
      JSON.stringify({ success: false, error: "文本为空" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // 👉 教学分析 Prompt（你后面可以随意改）
  const prompt = `
你是一名资深教研员，请分析以下课堂实录。如果你检测到以下不是课堂实录，返回结果（课堂实录格式错误，请不要提交与课堂实录无关的内容。 ）

重点分析：
1. 教师讲述占比
2. 是否有有效提问
3. 是否体现学生主体
4. 是否符合新课标理念
5. 是否有探究式学习
6. 给出改进建议

课堂实录：
${text}

请按以下结构输出：

【教学亮点】
【存在问题】
【改进建议】
【综合评价】
`;

  // ✅ 调用 DeepSeek
  const resp = await fetch(
    "https://api.deepseek.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    }
  );

  const data = await resp.json();

  const result =
    data.choices?.[0]?.message?.content || "分析失败";

  return new Response(
    JSON.stringify({
      success: true,
      result
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
