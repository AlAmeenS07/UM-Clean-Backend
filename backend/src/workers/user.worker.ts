import { Worker } from "bullmq";
import { connectMongo } from "../config/mongo";
import { mongoUser } from "../models/mongo/user.model";


connectMongo()

const worker = new Worker( "user-sync-queue", async job => {
    const data = job.data;

    if (job.name == "sync-user") {
      await mongoUser.create({
        postgresId: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        isActive: data.isActive,
        createdAt: data.createdAt,
      });
    }

    if (job.name == "update-user") {
      await mongoUser.updateOne(
        { postgresId: data.id },
        { isActive: data.isActive }
      );
    }

    console.log("Data synced to Mongo");
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

console.log("Worker running...");