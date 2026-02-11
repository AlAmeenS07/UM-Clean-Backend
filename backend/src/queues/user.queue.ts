
import { Queue } from "bullmq";

export const userQueue = new Queue("user-sync-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});