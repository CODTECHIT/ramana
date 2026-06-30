import { Request, Response } from "express";
import { Product } from "../models/Product.js";

import { Category } from "../models/Category.js";

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    let filter: any = {};
    if (req.query.category) {
      const categorySlug = req.query.category as string;
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        return res.status(200).json([]);
      }
      filter.category = category._id;
    }
    if (req.query.search) {
      const keyword = req.query.search as string;
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }
    const products = await Product.find(filter).populate("category", "name slug");
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category", "name slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, price, stock, description, details, category, images, tags, active } = req.body;

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this slug already exists" });
    }

    const product = await Product.create({
      name, slug, price, stock, description, details, category, images, tags, active
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check slug collision
    if (req.body.slug && req.body.slug !== product.slug) {
      const existing = await Product.findOne({ slug: req.body.slug });
      if (existing) {
        return res.status(400).json({ message: "Slug already in use" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
