import mongoose from "mongoose";

import dotenv from "dotenv/config";


const connectDB = async () => {
  try {
    const DB_NAME = "book";
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB Connected !! DB Host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MOngoDB Connection Error", error);
    process.exit(1);
  }
};

export default connectDB;
