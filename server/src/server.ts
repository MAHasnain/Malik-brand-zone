import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import logger from "./logger/winston.logger";

// Route Imports
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import morgan from "morgan";

dotenv.config();
connectDB();

const app = express();

// Middleware

app.use(
  express.json({
    limit: '16kb',
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  }),
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
// app.use(cookieParser());
app.use(express.static('public'));
// app.use(helmet());

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Mount API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

// Health Check Route
app.get("/", (req: Request, res: Response) => {
 res.json({ message: "MBZ API is running..." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
 logger.info(` Server running on port ${PORT}`);
});
