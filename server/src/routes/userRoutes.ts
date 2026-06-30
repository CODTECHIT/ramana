import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDashboardStats,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  getWishlist,
  addWishlist,
  removeWishlist,
  getSavedItems,
  addSavedItem,
  removeSavedItem,
  getRecentlyViewed,
  addRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
} from "../controllers/userController.js";

const router = Router();

// All user routes require authentication
router.use(protect);

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", changePassword);

// Dashboard stats
router.get("/dashboard", getDashboardStats);

// Addresses
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);
router.patch("/addresses/:id/default", setDefaultAddress);

// Reviews
router.get("/reviews", getMyReviews);
router.post("/reviews", createReview);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist", addWishlist);
router.delete("/wishlist/:slug", removeWishlist);

// Saved For Later
router.get("/saved-items", getSavedItems);
router.post("/saved-items", addSavedItem);
router.delete("/saved-items/:slug", removeSavedItem);

// Recently Viewed
router.get("/recently-viewed", getRecentlyViewed);
router.post("/recently-viewed", addRecentlyViewed);
router.delete("/recently-viewed/:slug", removeRecentlyViewed);
router.delete("/recently-viewed", clearRecentlyViewed);

// Payment Methods
router.get("/payment-methods", getPaymentMethods);
router.post("/payment-methods", addPaymentMethod);
router.delete("/payment-methods/:id", removePaymentMethod);
router.patch("/payment-methods/:id/default", setDefaultPaymentMethod);

export default router;
