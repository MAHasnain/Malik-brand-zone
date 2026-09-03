import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import logger from "../logger/winston.logger";


export const errorHandler = (
 err: any,
 req: Request,
 res: Response,
 next: NextFunction,
) => {
 let error = err;

 if (!(error instanceof ApiError)) {
  const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
  const message = error.message || "Something went wrong";
  error = new ApiError(statusCode, message, error?.errors || [], err.stack);
 }

 logger.error(
  `${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method}`,
 );

 // Send standardized error response
 res.status(error.statusCode).json({
  success: false,
  message: error.message,
  errors: error.errors,
  stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
 });
};
