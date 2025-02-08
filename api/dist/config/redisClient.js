"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new ioredis_1.default(process.env.REDIS_URL + "?family=0");
client.on("connect", () => {
    console.log("Connected to Redis");
});
client.on("error", (err) => {
    console.error("Redis error:", err);
});
exports.default = client;
