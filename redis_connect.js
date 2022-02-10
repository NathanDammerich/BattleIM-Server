import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// export const client = new Redis(process.env.REDIS_URL, {
//   tls: {
//     rejectUnauthorized: false,
//   },
//   connectTimeout: 10000,
// });

export const client = new Redis(process.env.REDIS_URL);

client.on("connect", () => {
  console.log("redis connected");
});
