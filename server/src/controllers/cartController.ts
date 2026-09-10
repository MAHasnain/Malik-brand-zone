import { Request, Response } from "express";
import { Cart } from "../models/cart.model";
import { Product } from "../models/product.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Helper to recalculate cart metrics
const recalculateCart = (cart: any) => {
 cart.totalItems = cart.items.reduce(
  (acc: number, item: any) => acc + item.quantity,
  0,
 );
 cart.totalPrice = cart.items.reduce(
  (acc: number, item: any) => acc + item.priceAtAddition * item.quantity,
  0,
 );
};

// 1. ADD / UPDATE ITEM IN CART
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
 const { productId, size, color, quantity = 1, sessionId } = req.body;

 if (!productId) throw new ApiError(400, "Product ID is required");

 const product = await Product.findById(productId);
 if (!product) throw new ApiError(404, "Product not found");
 if (product.stock < quantity)
  throw new ApiError(400, `Only ${product.stock} items available in stock`);

 const query = req.admin ? { adminId: req.admin._id } : { sessionId };
 if (!query.adminId && !query.sessionId)
  throw new ApiError(400, "Session ID or User Auth is required");

 let cart = await Cart.findOne(query);
 if (!cart) {
  cart = new Cart({ ...query, items: [] });
 }

 // Check if same item variant exists
 const existingItemIndex = cart.items.findIndex(
  (item) =>
   item.product.toString() === productId &&
   item.selectedSize === size &&
   item.selectedColor === color,
 );

 const priceToUse = product.discountPrice || product.price;

 if (existingItemIndex > -1) {
  const newQty = cart.items[existingItemIndex].quantity + Number(quantity);
  if (product.stock < newQty)
   throw new ApiError(
    400,
    `Cannot add more. Stock limit (${product.stock}) reached.`,
   );
  cart.items[existingItemIndex].quantity = newQty;
 } else {
  cart.items.push({
   product: productId as any,
   selectedSize: size,
   selectedColor: color,
   quantity: Number(quantity),
   priceAtAddition: priceToUse,
  });
 }

 recalculateCart(cart);
 await cart.save();
 await cart.populate(
  "items.product",
  "title images price discountPrice stock slug",
 );

 res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

// 2. VALIDATE CART BEFORE CHECKOUT (Crucial E-commerce Logic)
export const validateCart = asyncHandler(
 async (req: Request, res: Response) => {
  const { items } = req.body; // Array of items from frontend state or DB

  if (!items || !Array.isArray(items) || items.length === 0) {
   throw new ApiError(400, "Cart items array is required");
  }

  const validationResults = [];
  let isCartValid = true;
  let updatedSubtotal = 0;

  for (const item of items) {
   const product = await Product.findById(item.product);

   if (!product) {
    isCartValid = false;
    validationResults.push({
     ...item,
     status: "UNAVAILABLE",
     issue: "Product no longer exists",
    });
    continue;
   }

   const currentPrice = product.discountPrice || product.price;
   const isPriceChanged = currentPrice !== item.price;
   const isStockAvailable = product.stock >= item.quantity;

   if (!isStockAvailable || isPriceChanged) {
    isCartValid = false;
   }

   const itemTotal = currentPrice * Math.min(item.quantity, product.stock);
   updatedSubtotal += isStockAvailable ? itemTotal : 0;

   validationResults.push({
    product: product._id,
    title: product.title,
    requestedQuantity: item.quantity,
    availableStock: product.stock,
    currentPrice,
    priceChanged: isPriceChanged,
    stockIssue: !isStockAvailable,
    valid: isStockAvailable && !isPriceChanged,
   });
  }

  res
   .status(200)
   .json(
    new ApiResponse(
     200,
     {
      isValid: isCartValid,
      itemsValidation: validationResults,
      updatedSubtotal,
     },
     isCartValid
      ? "Cart is ready for checkout"
      : "Cart contains price/stock discrepancies",
    ),
   );
 },
);

// 3. REMOVE ITEM FROM CART
export const removeFromCart = asyncHandler(
 async (req: Request, res: Response) => {
  const { itemId, sessionId } = req.body;
  const query = req.admin ? { adminId: req.admin._id } : { sessionId };

  const cart = await Cart.findOne(query);
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter((item: any) => item._id.toString() !== itemId);
  recalculateCart(cart);
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
 },
);

// 4. CLEAR ENTIRE CART
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
 const { sessionId } = req.body;
 const query = req.admin ? { adminId: req.admin._id } : { sessionId };

 await Cart.findOneAndDelete(query);
 res.status(200).json(new ApiResponse(200, {}, "Cart cleared successfully"));
});

// 5. GET CART (Fetch current cart state for User/Session)
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = (req.query.sessionId as string) || req.headers['x-session-id'];

  const query = req.admin ? { adminId: req.admin._id } : { sessionId };

  if (!query.adminId && !query.sessionId) {
    throw new ApiError(400, 'Session ID or Auth Token is required to fetch cart');
  }

  const cart = await Cart.findOne(query).populate({
    path: 'items.product',
    select: 'title images price discountPrice stock slug fabric sizes colors',
  });

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(200, { items: [], totalPrice: 0, totalItems: 0 }, 'Cart is empty')
    );
  }

  res.status(200).json(new ApiResponse(200, cart, 'Cart fetched successfully'));
});

// 6. UPDATE ITEM QUANTITY (Direct quantity increment/decrement)
export const updateCartItemQuantity = asyncHandler(async (req: Request, res: Response) => {
  const { itemId, quantity, sessionId } = req.body;

  if (!itemId || quantity === undefined) {
    throw new ApiError(400, 'Item ID and new quantity are required');
  }

  if (Number(quantity) < 1) {
    throw new ApiError(400, 'Quantity must be at least 1. Use remove endpoint to delete item.');
  }

  const query = req.admin ? { adminId: req.admin._id } : { sessionId };
  const cart = await Cart.findOne(query);

  if (!cart) throw new ApiError(404, 'Cart not found');

  const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === itemId);
  if (itemIndex === -1) throw new ApiError(404, 'Item not found in cart');

  // Verify stock limit
  const product = await Product.findById(cart.items[itemIndex].product);
  if (!product) throw new ApiError(404, 'Product no longer exists');

  if (product.stock < Number(quantity)) {
    throw new ApiError(400, `Stock limit exceeded. Maximum available: ${product.stock}`);
  }

  cart.items[itemIndex].quantity = Number(quantity);
  recalculateCart(cart);

  await cart.save();
  await cart.populate('items.product', 'title images price discountPrice stock slug');

  res.status(200).json(new ApiResponse(200, cart, 'Cart item quantity updated'));
});