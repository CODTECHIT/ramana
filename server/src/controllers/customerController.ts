import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-passwordHash -refreshTokenHash").sort({ createdAt: -1 });

    const customersWithStats = await Promise.all(
      customers.map(async (c) => {
        const orders = await Order.find({ customer: c._id });
        const totalSpent = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
        return {
          ...c.toObject(),
          orderCount: orders.length,
          totalSpent,
        };
      })
    );
    res.status(200).json(customersWithStats);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching customers" });
  }
};
