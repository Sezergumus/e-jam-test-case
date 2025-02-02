import Redis from "ioredis";

const client = new Redis();

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.log("Redis error:", err);
});

export default client;
