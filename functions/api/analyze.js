export async function onRequest({ request }) {

  if (request.method === "GET") {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Cloudflare Pages Functions 已连通（GET）"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  if (request.method === "POST") {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Cloudflare Pages Functions 已连通（POST）"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  return new Response("Method Not Allowed", { status: 405 });
}
