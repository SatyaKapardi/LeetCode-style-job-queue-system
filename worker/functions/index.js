
export async function onRequest(context) {
  try {
    // Check if environment variables exist
    if (!context.env.UPSTASH_REDIS_REST_URL || !context.env.UPSTASH_REDIS_REST_TOKEN) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing Redis credentials",
          message: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set"
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

    // Use direct REST API calls instead of @upstash/redis package
    const redisUrl = context.env.UPSTASH_REDIS_REST_URL;
    const redisToken = context.env.UPSTASH_REDIS_REST_TOKEN;

    // Try to pop a job from the queue using REST API
    const response = await fetch(`${redisUrl}/rpop/problems`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      }
    });

    const redisResult = await response.json();
    
    if (redisResult.result && redisResult.result !== null) {
      // We have a job to process
      const jobData = JSON.parse(redisResult.result);
      
      // Process the job (with 2-second delay)
      await processSubmission(jobData);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Processed job",
          job: jobData
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
      // No jobs in queue
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
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
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

async function processSubmission(jobData) {
  const { problemId, code, language } = jobData;
  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  
  // Simulate processing delay (2 seconds as requested)
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}
