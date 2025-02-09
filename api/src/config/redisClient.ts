import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const client = new Redis(process.env.REDIS_PUBLIC_URL as string);

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

export default client;
