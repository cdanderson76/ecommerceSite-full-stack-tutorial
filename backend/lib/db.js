import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB database connnected ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB, ${error.message}`);
    process.exit(1);
  }
}