import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";


if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully.");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectToDatabase;