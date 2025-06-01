import { Router } from 'itty-router';
import { createClient } from 'redis';

const router = Router();
const redis = createClient({ url: 'YOUR_REDIS_CLOUD_URL' });

redis.on('error', (err) => console.log('Redis Client Error', err));

router.post("/submit", async (request) => {
    const { problemId, code, language } = await request.json();

    try {
        await redis.connect();
        await redis.lPush("problems", JSON.stringify({ problemId, code, language }));
        await redis.disconnect();
        return new Response("Submission received and stored.", { status: 200 });
    } catch (error) {
        console.error("Redis error:", error);
        return new Response("Failed to store submission.", { status: 500 });
    }
});

router.all("*", () => new Response("Not Found", { status: 404 }));

export default {
    async fetch(request: Request) {
        return router.handle(request);
    },
};
