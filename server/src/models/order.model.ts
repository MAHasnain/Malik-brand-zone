import { Schema, model, Document } from "mongoose";
export interface IOrder extends Document {
  orderId: string;
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  orderItems: {
    product: Schema.Types.ObjectId;
    title: string;
    size?: string;
    color?: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled"; // Changed from status to orderStatus
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
 {
  orderId: { type: String, required: true, unique: true, index: true },
  customerInfo: {
   fullName: { type: String, required: true },
   phone: { type: String, required: true },
   address: { type: String, required: true },
   city: { type: String, required: true },
  },
  orderItems: [
   {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    title: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
   },
  ],
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "COD" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  orderStatus: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
 },
 { timestamps: true },
);

export const Order = model<IOrder>("Order", OrderSchema);
