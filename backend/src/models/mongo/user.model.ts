
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  postgresId: { type : String , required: true },
  email: {type : String},
  name: {type : String},
  role: {type : String},
  createdAt: {type : Date},
});

export const mongoUser = mongoose.model("User", userSchema);
