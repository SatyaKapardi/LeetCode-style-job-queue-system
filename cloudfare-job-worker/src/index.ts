export default {
  async scheduled(controller, env, ctx) {
    for (let i = 0; i < 5; i++) {
      const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/rpop/problems`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([])
      });

      const text = await res.text();
      if (text === "null") break;

      const { problemId, code, language } = JSON.parse(text);
      console.log(`Processing: ${problemId}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
