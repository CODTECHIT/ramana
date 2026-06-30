import { Request, Response } from "express";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

export const getDashboardReports = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();

    // Sum revenue of non-cancelled orders
    const completedOrders = await Order.find({ status: { $ne: "Cancelled" } });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // Low stock count (less than 5 items in stock)
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 5 } });

    // Customers count
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Last 5 orders
    const recentOrders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Weekly/Daily orders in last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      return d;
    }).reverse();

    const ordersChartData = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await Order.countDocuments({
          createdAt: { $gte: date, $lt: nextDay },
        });

        const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });
        return { day: dayName, orders: count };
      })
    );

    // Monthly revenue in last 6 months
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      d.setHours(0,0,0,0);
      return d;
    }).reverse();

    const revenueChartData = await Promise.all(
      last6Months.map(async (date) => {
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

        const monthlyOrders = await Order.find({
          status: { $ne: "Cancelled" },
          createdAt: { $gte: monthStart, $lte: monthEnd },
        });

        const rev = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
        const monthName = monthStart.toLocaleDateString("en-IN", { month: "short" });
        return { month: monthName, revenue: parseFloat((rev / 100000).toFixed(2)) }; // In Lakhs
      })
    );

    res.status(200).json({
      metrics: {
        totalOrders,
        totalRevenue,
        lowStockCount,
        totalCustomers,
      },
      charts: {
        orders: ordersChartData,
        revenue: revenueChartData,
      },
      recentOrders: recentOrders.map(o => ({
        id: o.orderNumber,
        customer: o.customer ? (o.customer as any).name : (o.guestInfo?.name || "Guest"),
        item: o.items.length === 1 ? o.items[0].name : `${o.items[0].name} +${o.items.length - 1} items`,
        amount: o.total,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      })),
    });
  } catch (error) {
    console.error("Dashboard Report Error:", error);
    res.status(500).json({ message: "Server error fetching report data" });
  }
};
