import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export default async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "homework-api",
      ssl: true,
      serverSelectionTimeoutMS: 10000,
      tlsInsecure: true, // <-- use ONLY this if you're debugging TLS errors
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    throw err;
  }
}

