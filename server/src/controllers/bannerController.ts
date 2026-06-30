import { Request, Response } from "express";
import { Banner } from "../models/Banner.js";

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ displayOrder: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching banners" });
  }
};

export const adminGetBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ displayOrder: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching banners" });
  }
};

export const adminCreateBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Server error creating banner" });
  }
};

export const adminUpdateBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Server error updating banner" });
  }
};

export const adminDeleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting banner" });
  }
};
