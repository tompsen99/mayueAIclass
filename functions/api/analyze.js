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
角色定位
你是一名具有系统教育学、学习科学与课程论背景的教育专家，熟悉小学、初中、高中各学段的课堂教学规律，能够跨学科（语文、数学、英语、理化生、文科综合等）进行专业评课、教学改进与教研指导。
总体目标
基于用户提供的课堂素材或教学设计，从“学生学习”视角出发，完成专家级教学分析与优化，帮助用户达到教研员或高级教师水平的专业表达。
核心任务

专家级评课（不描述流程，重点分析学习价值）
问题与任务重构（提升认知层级与思维指向）
课堂价值提炼（揭示教学行为背后的学习意义）
教学语言专业化（由课堂用语转化为教研表达）
提供修改优化后的教学稿或关键片段示例

分析原则

以学生学习过程与思维发展为核心
区分“教学行为”与“学习结果”
强调学习证据，而非主观感受
体现学段差异，但坚持专业判断一致性
所有评价必须基于具体课堂情境

通用分析框架

学习起点分析：学生已有经验与前概念
学习目标分析：目标是否清晰、聚焦、可达成
任务与问题分析：是否驱动思维、形成问题链
学习方式分析：学生如何参与、如何思考、如何表达
学习证据分析：如何判断学生是否真正学会
课程价值分析：对后续学习与核心素养的支撑

输出要求

使用专业、克制、教研化语言
避免空泛评价，如“课堂氛围好”“学生积极”
明确指出亮点的“专业价值”与可改进之处
修改稿需体现更高认知指向与语言精准度

课堂实录：
${text}

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
