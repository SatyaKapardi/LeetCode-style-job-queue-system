# 🚀 LeetCode-Style Job Queue System

A distributed job queue system similar to LeetCode's problem submission architecture, built with **Cloudflare Pages Functions** and **Upstash Redis**.

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LeetCode System                          │
│                                                             │
│  User Request ──► Primary Backend ──► Queue ──► Workers     │
│       │               │                │         │         │
│       │               │                │       ┌─W1─┐      │
│       │               │                │       │    │      │
│    "Submit            │             ┌──┴──┐    └─▲──┘      │
│     Code"             │             │     │      │         │
│                       │             │ [] []│    ┌─W2─┐      │
│                       │             │ [] []│    │    │      │
│                    Express          │ [] []│    └─▲──┘      │
│                   Server            └──▲──┘      │         │
│                                        │         │         │
│                                    Redis Queue   Workers    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Project Structure

```
LeetCode-style-job-queue-system/
├── express-server/
│   ├── functions/
│   │   ├── index.js      # Health check endpoint
│   │   └── submit.js     # Job submission endpoint
│   └── package.json
├── worker/
│   ├── functions/
│   │   └── index.js      # Job processing worker
│   └── package.json
└── README.md
```

## 🌟 Features

- **✅ Job Submission API** - REST endpoint to submit coding problems
- **✅ Distributed Queue** - Redis-based job queue using Upstash
- **✅ Worker Processing** - Scalable workers that process jobs with configurable delays
- **✅ Cloud Deployment** - Deployed on Cloudflare's edge network
- **✅ Manual Triggers** - HTTP endpoints to manually trigger job processing
- **✅ CORS Enabled** - Ready for frontend integration

## 🚀 Live Demo

### Deployed Services

- **Express Server**: https://36fafd1b.leetcode-express-server.pages.dev
- **Worker Service**: https://063aa957.leetcode-worker.pages.dev

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check for express server |
| `POST` | `/submit` | Submit a coding problem to the queue |
| `GET` | `/worker` | Process one job from the queue |

## 📝 API Usage

### Submit a Job

```bash
curl -X POST https://36fafd1b.leetcode-express-server.pages.dev/submit \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "two-sum",
    "code": "function twoSum(nums, target) { return [0,1]; }",
    "language": "javascript"
  }'
```

**Response:**
```
Submission received and stored.
```

### Process a Job

```bash
curl https://063aa957.leetcode-worker.pages.dev/
```

**Response:**
```json
{
  "success": true,
  "message": "Processed job",
  "job": {
    "problemId": "two-sum",
    "code": "function twoSum(nums, target) { return [0,1]; }",
    "language": "javascript"
  }
}
```

## 🔧 How It Works

1. **Job Submission**: Users submit coding problems via POST to `/submit`
2. **Queue Storage**: Jobs are stored in Redis queue using `LPUSH`
3. **Worker Processing**: Workers poll the queue using `RPOP` and process jobs
4. **Processing Delay**: Each job takes 2 seconds to process (configurable)
5. **Status Response**: Workers return job details and processing status

## 🛠️ Technology Stack

- **Runtime**: Cloudflare Pages Functions (Workers Runtime)
- **Database**: Upstash Redis (REST API)
- **Language**: JavaScript (ES Modules)
- **Deployment**: Cloudflare Pages with GitHub integration
- **Queue**: Redis Lists (LPUSH/RPOP)

## 🏃‍♂️ Local Development

### Prerequisites

- Node.js 18+
- Upstash Redis account
- Cloudflare account

### Environment Variables

```bash
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/LeetCode-style-job-queue-system.git
   cd LeetCode-style-job-queue-system
   ```

2. **Install dependencies**
   ```bash
   cd express-server && npm install
   cd ../worker && npm install
   ```

3. **Set up Upstash Redis**
   - Create account at [upstash.com](https://upstash.com)
   - Create a Redis database
   - Copy REST URL and token

4. **Deploy to Cloudflare Pages**
   - Connect your GitHub repository to Cloudflare Pages
   - Deploy both `express-server` and `worker` as separate projects
   - Set environment variables in Cloudflare dashboard

## 📊 Performance Characteristics

- **Throughput**: Limited by Redis and worker processing speed
- **Latency**: ~2 seconds per job (configurable)
- **Scalability**: Horizontal scaling via multiple worker instances
- **Reliability**: Built on Cloudflare's global edge network
- **Cost**: Serverless pricing - pay per request

## 🧪 Testing

### Complete Test Flow

```bash
# 1. Submit multiple jobs
curl -X POST https://36fafd1b.leetcode-express-server.pages.dev/submit \
  -H "Content-Type: application/json" \
  -d '{"problemId": "reverse-string", "code": "function reverse(s) { return s.split(\"\").reverse().join(\"\"); }", "language": "javascript"}'

curl -X POST https://36fafd1b.leetcode-express-server.pages.dev/submit \
  -H "Content-Type: application/json" \
  -d '{"problemId": "fizz-buzz", "code": "def fizz_buzz(n): return []", "language": "python"}'

# 2. Process jobs
curl https://063aa957.leetcode-worker.pages.dev/  # Processes first job
curl https://063aa957.leetcode-worker.pages.dev/  # Processes second job
curl https://063aa957.leetcode-worker.pages.dev/  # Returns "No jobs in queue"
```

### Browser Testing

Use the included HTML tester for interactive testing:
- Submit jobs through a web interface
- Monitor processing in real-time
- View detailed logs and responses

## 🔮 Future Enhancements

- **Priority Queues**: Support for high/low priority jobs
- **Batch Processing**: Process multiple jobs simultaneously
- **Dead Letter Queue**: Handle failed job processing
- **Metrics Dashboard**: Real-time queue statistics
- **Auto-scaling**: Dynamic worker scaling based on queue size
- **Cron Triggers**: Automatic job processing on schedules
