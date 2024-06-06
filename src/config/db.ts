import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connection successful");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Failed to connect to Database", err);
    });
    // database connection after registration of events - connected and error
    await mongoose.connect(config.databaseURl as string);
  } catch (err) {
    console.log("Failed to connect to Database", err);
    process.exit(1);
  }
};

export default connectDB;
