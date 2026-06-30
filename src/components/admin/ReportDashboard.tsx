"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, TrendingUp, AlertCircle, Users } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Constants, fmt } from "../../lib/mock-data";

const { GOLD, SANS, SERIF } = Constants;

interface ReportData {
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    lowStockCount: number;
    totalCustomers: number;
  };
  charts: {
    orders: Array<{ day: string; orders: number }>;
    revenue: Array<{ month: string; revenue: number }>;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    item: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export default function ReportDashboard() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReportData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/reports", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to load live reports.");
      }
      const report = await res.json();
      setData(report);
    } catch (err: any) {
      setError(err.message || "Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading live dashboard reports...</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-center text-red-500 text-sm" style={{ fontFamily: SANS }}>{error || "No data available."}</div>;
  }

  const { metrics, charts, recentOrders } = data;

  const METRICS = [
    { label: "Total Orders", value: metrics.totalOrders.toLocaleString(), icon: ShoppingBag },
    { label: "Revenue (Live)", value: fmt(metrics.totalRevenue), icon: TrendingUp },
    { label: "Low Stock Items", value: metrics.lowStockCount.toLocaleString(), icon: AlertCircle, warn: metrics.lowStockCount > 0 },
    { label: "Customers", value: metrics.totalCustomers.toLocaleString(), icon: Users },
  ];

  return (
    <div>
      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="p-5 rounded"
            style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                {m.label}
              </p>
              <m.icon size={15} style={{ color: m.warn ? "#dc2626" : GOLD }} />
            </div>
            <p className="text-2xl font-medium mb-1" style={{ color: "#1A1A2E", fontFamily: SERIF }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="md:col-span-2 p-5 rounded" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 className="text-sm font-medium mb-5" style={{ color: "#1A1A2E", fontFamily: SANS }}>
            Revenue (₹ Lakhs) — Last 6 Months
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={charts.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontSize: 12, borderRadius: 4 }} />
              <Line type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 3, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 className="text-sm font-medium mb-5" style={{ color: "#1A1A2E", fontFamily: SANS }}>
            Orders — Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={charts.orders}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontSize: 12, borderRadius: 4 }} />
              <Bar dataKey="orders" fill={GOLD} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <h3 className="text-sm font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Recent Orders</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500" style={{ fontFamily: SANS }}>No orders placed yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                {["Order ID", "Customer", "Item", "Amount", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#6B7280", fontFamily: SANS }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr
                  key={o.id}
                  style={{ borderBottom: i < recentOrders.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                >
                  <td className="px-6 py-3.5 text-sm font-medium" style={{ color: GOLD, fontFamily: SANS }}>{o.id}</td>
                  <td className="px-6 py-3.5 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{o.customer}</td>
                  <td className="px-6 py-3.5 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{o.item}</td>
                  <td className="px-6 py-3.5 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>{fmt(o.amount)}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: o.status === "Delivered" ? "#dcfce7" : o.status === "Shipped" ? "#dbeafe" : o.status === "Cancelled" ? "#fee2e2" : "#fef9c3",
                        color:      o.status === "Delivered" ? "#16a34a" : o.status === "Shipped" ? "#2563eb" : o.status === "Cancelled" ? "#991b1b" : "#ca8a04",
                        fontFamily: SANS,
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
