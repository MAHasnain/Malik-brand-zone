import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  priceAtAddition: number;
}

export interface ICart extends Document {
  sessionId?: string; // Guest user identification
  adminId?: mongoose.Types.ObjectId; // If logged in admin/user
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  selectedSize: { type: String },
  selectedColor: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  priceAtAddition: { type: Number, required: true }
});

const cartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, index: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', index: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
    totalItems: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', cartSchema);