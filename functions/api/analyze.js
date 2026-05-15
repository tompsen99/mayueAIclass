export async function onRequest({ request }) {

  if (request.method === "GET") {
    return new Response(
      JSON.stringify({
        success: true,
        message: "API 正常（GET）"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  if (request.method === "POST") {
    const body = await request.json();

    return new Response(
      JSON.stringify({
        success: true,
        receivedText: body.text,
        note: "这是来自 Cloudflare Functions 的响应"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response("Method Not Allowed", { status: 405 });
}
