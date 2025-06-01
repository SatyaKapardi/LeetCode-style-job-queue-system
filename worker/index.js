import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);
  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  
  // Simulate processing delay (2 seconds as requested)
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
  console.log("Worker connected to Redis.");

  while (true) {
    try {
      const submission = await redis.brpop("problems", 0);
      if (submission && submission[1]) {
        await processSubmission(submission[1]);
      }
    } catch (error) {
      console.error("Error processing submission:", error);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

startWorker();
