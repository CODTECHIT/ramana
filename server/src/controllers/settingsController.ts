import { Request, Response } from "express";
import { Settings } from "../models/Settings.js";

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings document if none exists
      settings = await Settings.create({ whatsappNumber: "" });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update global settings
// @route   PUT /api/admin/settings
// @access  Admin
export const updateSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    // Update fields
    if (req.body.whatsappNumber !== undefined) {
      settings.whatsappNumber = req.body.whatsappNumber;
    }

    await settings.save();
    res.status(200).json(settings);
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
