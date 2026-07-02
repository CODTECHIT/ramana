import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Address } from "../models/Address.js";
import { Review } from "../models/Review.js";
import Wishlist from "../models/Wishlist.js";
import SavedItem from "../models/SavedItem.js";
import RecentlyViewed from "../models/RecentlyViewed.js";
import PaymentMethod from "../models/PaymentMethod.js";
import bcrypt from "bcrypt";

// ─── Profile ────────────────────────────────────────────────────────────────

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user?.id).select("-passwordHash -refreshTokenHash -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, phone, dateOfBirth, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      (req as any).user?.id,
      { $set: { name, phone, dateOfBirth, avatar } },
      { new: true, runValidators: true }
    ).select("-passwordHash -refreshTokenHash -resetPasswordToken -resetPasswordExpires");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Invalid password data. New password must be at least 8 characters." });
    }
    const user = await User.findById((req as any).user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Addresses ──────────────────────────────────────────────────────────────

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.find({ user: (req as any).user?.id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { isDefault, ...rest } = req.body;
    // If setting as default, unset all others first
    if (isDefault) {
      await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
    }
    // If this is the first address, make it default automatically
    const count = await Address.countDocuments({ user: userId });
    const address = await Address.create({ ...rest, user: userId, isDefault: isDefault || count === 0 });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { isDefault, ...rest } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $set: { ...rest, isDefault: isDefault || false } },
      { new: true }
    );
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: (req as any).user?.id });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      { $set: { isDefault: true } },
      { new: true }
    );
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Orders ─────────────────────────────────────────────────────────────────

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const orders = await Order.find({ customer: userId });
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "Processing").length;
    const totalSpent = orders.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.total, 0);
    const recentOrders = await Order.find({ customer: userId }).sort({ createdAt: -1 }).limit(5);
    res.json({ totalOrders, pendingOrders, totalSpent, recentOrders });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Reviews ────────────────────────────────────────────────────────────────

export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ user: (req as any).user?.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { product, productName, productImage, rating, title, body, images, order } = req.body;
    const existing = await Review.findOne({ user: (req as any).user?.id, product });
    if (existing) return res.status(400).json({ message: "You already reviewed this product" });
    const review = await Review.create({
      user: (req as any).user?.id,
      product, productName, productImage, rating, title, body, images, order,
      isVerifiedPurchase: !!order,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { rating, title, body, images } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: (req as any).user?.id },
      { $set: { rating, title, body, images } },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: (req as any).user?.id });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Wishlist ───────────────────────────────────────────────────────────────

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const items = await Wishlist.find({ user: (req as any).user?.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addWishlist = async (req: Request, res: Response) => {
  try {
    const { slug, name, price, originalPrice, img } = req.body;
    const existing = await Wishlist.findOne({ user: (req as any).user?.id, slug });
    if (existing) return res.status(400).json({ message: "Already in wishlist" });
    const item = await Wishlist.create({ user: (req as any).user?.id, slug, name, price, originalPrice, img });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeWishlist = async (req: Request, res: Response) => {
  try {
    await Wishlist.findOneAndDelete({ user: (req as any).user?.id, slug: req.params.slug });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Saved For Later ─────────────────────────────────────────────────────────

export const getSavedItems = async (req: Request, res: Response) => {
  try {
    const items = await SavedItem.find({ user: (req as any).user?.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addSavedItem = async (req: Request, res: Response) => {
  try {
    const { slug, name, price, originalPrice, img } = req.body;
    const existing = await SavedItem.findOne({ user: (req as any).user?.id, slug });
    if (existing) return res.status(400).json({ message: "Already saved" });
    const item = await SavedItem.create({ user: (req as any).user?.id, slug, name, price, originalPrice, img });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeSavedItem = async (req: Request, res: Response) => {
  try {
    await SavedItem.findOneAndDelete({ user: (req as any).user?.id, slug: req.params.slug });
    res.json({ message: "Removed from saved items" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Recently Viewed ─────────────────────────────────────────────────────────

export const getRecentlyViewed = async (req: Request, res: Response) => {
  try {
    const items = await RecentlyViewed.find({ user: (req as any).user?.id }).sort({ updatedAt: -1 }).limit(20);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addRecentlyViewed = async (req: Request, res: Response) => {
  try {
    const { slug, name, price, img } = req.body;
    let item = await RecentlyViewed.findOne({ user: (req as any).user?.id, slug });
    if (item) {
      item.updatedAt = new Date();
      await item.save();
    } else {
      item = await RecentlyViewed.create({ user: (req as any).user?.id, slug, name, price, img });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeRecentlyViewed = async (req: Request, res: Response) => {
  try {
    await RecentlyViewed.findOneAndDelete({ user: (req as any).user?.id, slug: req.params.slug });
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const clearRecentlyViewed = async (req: Request, res: Response) => {
  try {
    await RecentlyViewed.deleteMany({ user: (req as any).user?.id });
    res.json({ message: "Cleared all recently viewed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Payment Methods ─────────────────────────────────────────────────────────

export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const methods = await PaymentMethod.find({ user: (req as any).user?.id }).sort({ createdAt: -1 });
    res.json(methods);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { type, label, detail, bank, icon, isDefault } = req.body;
    if (isDefault) {
      await PaymentMethod.updateMany({ user: (req as any).user?.id }, { $set: { isDefault: false } });
    }
    const method = await PaymentMethod.create({ user: (req as any).user?.id, type, label, detail, bank, icon, isDefault });
    res.status(201).json(method);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removePaymentMethod = async (req: Request, res: Response) => {
  try {
    await PaymentMethod.findOneAndDelete({ _id: req.params.id, user: (req as any).user?.id });
    res.json({ message: "Payment method removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const setDefaultPaymentMethod = async (req: Request, res: Response) => {
  try {
    await PaymentMethod.updateMany({ user: (req as any).user?.id }, { $set: { isDefault: false } });
    const method = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, user: (req as any).user?.id },
      { $set: { isDefault: true } },
      { new: true }
    );
    if (!method) return res.status(404).json({ message: "Payment method not found" });
    res.json(method);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
