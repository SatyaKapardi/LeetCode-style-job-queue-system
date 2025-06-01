export async function onRequest(context) {
  return new Response("Express server is running! Use /submit to submit jobs.", {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain',
    },
  });
}

// express-server/functions/submit.js  
import { Redis } from "@upstash/redis";

export async function onRequestPost(context) {
  const redis = new Redis({
    url: context.env.UPSTASH_REDIS_REST_URL,
    token: context.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    const body = await context.request.json();
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

export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
