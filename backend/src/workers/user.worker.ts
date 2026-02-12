import { Worker } from "bullmq";
import { connectMongo } from "../config/mongo";
import { mongoUser } from "../models/mongo/user.model";


connectMongo()

const worker = new Worker(
  "user-sync-queue",
  async job => {
    const data = job.data;

    await mongoUser.create({
      postgresId: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.isActive,
      createdAt: data.createdAt,
    });

    console.log("User synced to Mongo");
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

console.log("Worker running...");