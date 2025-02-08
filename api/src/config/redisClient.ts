import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const client = new Redis(
  "redis://default:YMpuHYHOtpQAOirEEUGKxtXgkiKDIsVl@redis.railway.internal:6379" as string
);

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

export default client;
