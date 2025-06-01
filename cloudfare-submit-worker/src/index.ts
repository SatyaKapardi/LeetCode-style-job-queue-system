// src/index.ts
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    if (request.method === "POST" && new URL(request.url).pathname === "/submit") {
      const { problemId, code, language } = await request.json();

      const payload = JSON.stringify({ problemId, code, language });

      const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/lpush/problems`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([payload])
      });

      if (response.ok) {
        return new Response("Submission stored", { status: 200 });
      } else {
        return new Response("Error storing submission", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}
