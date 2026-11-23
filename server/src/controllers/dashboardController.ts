import type { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const getDashboard = asyncHandler(
 async (_req: Request, res: Response) => {
  const [totals, activeProducts, recentOrders] = await Promise.all([
   Order.aggregate<{ orders: number; revenue: number; customers: number }>([
    {
     $group: {
      _id: { $trim: { input: { $ifNull: ["$customerInfo.phone", ""] } } },
      orders: { $sum: 1 },
      revenue: {
       $sum: {
        $cond: [
         {
          $and: [
           { $eq: ["$paymentStatus", "Paid"] },
           { $ne: ["$orderStatus", "Cancelled"] },
          ],
         },
         "$totalAmount",
         0,
        ],
       },
      },
     },
    },
    {
     $group: {
      _id: null,
      orders: { $sum: "$orders" },
      revenue: { $sum: "$revenue" },
      customers: { $sum: { $cond: [{ $ne: ["$_id", ""] }, 1, 0] } },
     },
    },
   ]),
   Product.countDocuments({ stock: { $gt: 0 } }),
   Order.find()
    .select("orderId customerInfo.fullName totalAmount orderStatus")
    .sort({ createdAt: -1, _id: -1 })
    .limit(5)
    .lean(),
  ]);
  const { orders = 0, revenue = 0, customers = 0 } = totals[0] ?? {};
  res
   .set("Cache-Control", "private, no-store")
   .json(
    new ApiResponse(
     200,
     { orders, revenue, customers, activeProducts, recentOrders },
     "Dashboard loaded",
    ),
   );
 },
);
