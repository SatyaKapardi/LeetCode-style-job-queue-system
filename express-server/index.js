// express-server/index.js (rename from index.ts)
import { Redis } from "@upstash/redis";

export default {
  async fetch(request, env) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method === 'POST' && new URL(request.url).pathname === '/submit') {
      try {
        const body = await request.json();
        const { problemId, code, language } = body;

        await redis.lpush("problems", JSON.stringify({ code, language, problemId }));

        return new Response("Submission received and stored.", {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain',
          },
        });
      } catch (error) {
        console.error("Redis error:", error);
        return new Response("Failed to store submission.", {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain',
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};

// worker/index.js (rename from index.ts)
import { Redis } from "@upstash/redis";

export default {
  async fetch(request, env) {
    return new Response("Worker is running", { status: 200 });
  },

  async scheduled(event, env, ctx) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    try {
      const submission = await redis.rpop("problems");
      
      if (submission) {
        await processSubmission(submission);
      }
    } catch (error) {
      console.error("Error processing submission:", error);
    }
  },
};

async function processSubmission(submission) {
  const { problemId, code, language } = JSON.parse(submission);
  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  
  // Simulate processing delay (2 seconds as requested)
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}
