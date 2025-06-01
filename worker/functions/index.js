import { Redis } from "@upstash/redis";

export async function onRequest(context) {
  const redis = new Redis({
    url: context.env.UPSTASH_REDIS_REST_URL,
    token: context.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    // Check for jobs in the queue
    const submission = await redis.rpop("problems");
    
    if (submission) {
      await processSubmission(submission);
      return new Response(
        JSON.stringify({
          success: true,
          message: `Processed job`,
          job: JSON.parse(submission)
        }), 
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No jobs in queue"
        }), 
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  } catch (error) {
    console.error("Error processing submission:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

async function processSubmission(submission) {
  const { problemId, code, language } = JSON.parse(submission);
  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  
  // Simulate processing delay (2 seconds as requested)
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}