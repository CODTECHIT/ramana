import { Request, Response } from "express";
import { Collection } from "../models/Collection.js";

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await Collection.find({ active: true }).sort({ displayOrder: 1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching collections" });
  }
};

export const adminGetCollections = async (req: Request, res: Response) => {
  try {
    const collections = await Collection.find().sort({ displayOrder: 1 });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching collections" });
  }
};

export const adminCreateCollection = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Server error creating collection" });
  }
};

export const adminUpdateCollection = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Server error updating collection" });
  }
};

export const adminDeleteCollection = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting collection" });
  }
};
