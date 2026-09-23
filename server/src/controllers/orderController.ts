import { Request, Response } from "express";
import { IOrder, Order } from "../models/order.model";
import { Product } from "../models/product.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import logger from "../logger/winston.logger";

// Helper to generate unique order ID (MBZ-XXXXXX)
const generateOrderId = (): string => {
 const randomNum = Math.floor(100000 + Math.random() * 900000);
 return `MBZ-${randomNum}`;
};

// 1. PLACE NEW ORDER (Public - Guest Checkout)
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
 const {
  customer,
  orderItems,
  shippingFee = 200,
  paymentMethod = "COD",
 } = req.body;

 if (!customer || !orderItems || orderItems.length === 0) {
  throw new ApiError(400, "Customer details and order items are required");
 }

 let calculatedSubtotal = 0;
 const verifiedItems = [];

 // Atomic Stock Reduction & Server-side Calculation
 for (const item of orderItems) {
  const product = await Product.findById(item.product);
  if (!product) {
   throw new ApiError(404, `Product not found: ${item.title}`);
  }

  if (product.stock < item.quantity) {
   throw new ApiError(400, `Stock depleted for product: ${product.title}`);
  }

  const itemPrice = product.discountPrice || product.price;
  calculatedSubtotal += itemPrice * item.quantity;

  // Deduct Stock
  product.stock -= item.quantity;
  await product.save();

  verifiedItems.push({
   product: product._id,
   title: product.title,
   price: itemPrice,
   quantity: item.quantity,
   selectedSize: item.selectedSize,
   selectedColor: item.selectedColor,
   image: product.images[0] || "",
  });
 }

 const grandTotal = calculatedSubtotal + Number(shippingFee);
 const customOrderId = generateOrderId();

 const order = await Order.create({
  orderId: customOrderId,
  customerInfo: customer,
  orderItems: verifiedItems,
  subtotal: calculatedSubtotal,
  shippingFee: Number(shippingFee),
  totalAmount: grandTotal,
  paymentMethod,
 });

 logger.info(
  `New MBZ Order Created: ${order.orderId} | Total: PKRs ${grandTotal}`,
 );

 res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
});

// 2. GET ALL ORDERS (Admin Only - With Filters & Pagination)
export const getAllOrders = asyncHandler(
 async (req: Request, res: Response) => {
  const { status, page = 1, limit = 10 } = req.query;
  const queryObj: any = {};

  if (status) queryObj.orderStatus = status;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
   Order.find(queryObj).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
   Order.countDocuments(queryObj),
  ]);

  res
   .status(200)
   .json(
    new ApiResponse(
     200,
     {
      orders,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
     },
     "Orders fetched",
    ),
   );
 },
);

// 3. GET ORDER BY ORDER ID (Public Tracking)
export const getOrderByCustomId = asyncHandler(
 async (req: Request, res: Response) => {
  const order = (await Order.findOne({
   orderId: req.params.orderId,
  })) as IOrder | null;
  if (!order) throw new ApiError(404, "Order not found");

  res
   .status(200)
   .json(new ApiResponse(200, order, "Order fetched successfully"));
 },
);

// 4. UPDATE ORDER STATUS (Admin Only)
export const updateOrderStatus = asyncHandler(
 async (req: Request, res: Response) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = (await Order.findById(req.params.id)) as IOrder | null;
  if (!order) throw new ApiError(404, "Order not found");

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();

  logger.info(
   `Order Status Updated: ${order.orderId} -> ${orderStatus || order.orderStatus}`,
  );

  res.status(200).json(new ApiResponse(200, order, "Order status updated"));
 },
);
