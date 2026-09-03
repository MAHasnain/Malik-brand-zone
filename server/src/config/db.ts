import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from "mongoose";
import logger from '../logger/winston.logger';
import ApiError from '../utils/ApiError';
export const connectDB = async () => {
 try {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
   throw new ApiError(500, "MONGODB_URI is not defined in .env file");
  }

  const conn = await mongoose.connect(mongoURI);
  logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
 } catch (error) {
  logger.error(`❌ Error connecting to MongoDB: ${(error as Error).message}`);

  process.exit(1);
 }
};
