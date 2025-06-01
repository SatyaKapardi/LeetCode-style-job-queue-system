import express from "express";
import { Redis } from "@upstash/redis";

const app = express();
app.use(express.json());

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

app.post("/submit", async (req, res) => {
  const problemId = req.body.problemId;
  const code = req.body.code;
  const language = req.body.language;

  try {
    await redis.lpush("problems", JSON.stringify({ code, language, problemId }));
    res.status(200).send("Submission received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to store submission.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
