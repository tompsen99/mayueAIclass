export async function onRequestPost() {
  return new Response(
    JSON.stringify({
      success: true,
      result: "API 已连通"
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
