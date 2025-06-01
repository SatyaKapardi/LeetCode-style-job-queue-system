export async function onRequestPost(context) {
  try {
    // Check if environment variables exist
    if (!context.env.UPSTASH_REDIS_REST_URL || !context.env.UPSTASH_REDIS_REST_TOKEN) {
      return new Response("Missing Redis credentials", {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
        },
      });
    }

    const body = await context.request.json();
    const { problemId, code, language } = body;

    // Use direct REST API calls
    const redisUrl = context.env.UPSTASH_REDIS_REST_URL;
    const redisToken = context.env.UPSTASH_REDIS_REST_TOKEN;

    // Push job to queue using REST API
    const response = await fetch(`${redisUrl}/lpush/problems`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([JSON.stringify({ code, language, problemId })])
    });

    const result = await response.json();
    
    if (result.result) {
      return new Response("Submission received and stored.", {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
        },
      });
    } else {
      throw new Error('Failed to store in Redis');
    }
  } catch (error) {
    console.error("Redis error:", error);
    return new Response(`Failed to store submission: ${error.message}`, {
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
