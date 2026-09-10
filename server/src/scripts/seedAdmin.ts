import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "../models/admin.model";
import ApiError from "../utils/ApiError";
import logger from "../logger/winston.logger";

dotenv.config();

const seedAdmin = async () => {
 try {
  if (!process.env.MONGODB_URI) {
   throw new ApiError(500, "MONGO_URI is not defined in .env");
  }

  // Connect to DB
  await mongoose.connect(process.env.MONGODB_URI);
  logger.info("✅ Database connected for seeding");

  const adminEmail = "malikbrandzone.store@gmail.com";
  const plainPassword = "Adnan@admin123*";

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
   logger.warn(`⚠️ Admin with email ${adminEmail} already exists.`);
   process.exit(0);
  }

  // Hash the password manually for the seed
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  // Create the Admin
  await Admin.create({
   name: "MBZ Super Admin",
   email: adminEmail,
   password_hash: hashedPassword,
   isActive: true,
  });

  logger.info("🎉 Super Admin seeded successfully!");
  process.exit(0);
 } catch (error) {
  logger.error("❌ Seeding failed:", error);
  process.exit(1);
 }
};

seedAdmin();
