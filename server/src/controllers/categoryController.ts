import { Request, Response } from "express";
import { Category } from "../models/Category.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (Storefront needs this too)
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}).sort({ displayOrder: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Admin
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, heroImage, displayOrder, active } = req.body;

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "Category with this slug already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      heroImage,
      displayOrder,
      active,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Admin
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check slug collision if slug is changed
    if (req.body.slug && req.body.slug !== category.slug) {
      const existing = await Category.findOne({ slug: req.body.slug });
      if (existing) {
        return res.status(400).json({ message: "Slug already in use" });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Admin
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // In a real scenario, check if products exist for this category
    // We will enforce this before deleting
    const { Product } = await import("../models/Product.js");
    const productsCount = await Product.countDocuments({ category: category._id });

    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category because it has ${productsCount} products assigned. Reassign them first.` 
      });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category removed" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
