"use client";

import { useState } from "react";
import { LayoutDashboard, Package, Tag, ShoppingBag as CartIcon, Users, Image as ImageIcon, BarChart2, ShoppingBag, TrendingUp, AlertCircle, Edit, Trash2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Constants, REV_DATA, ORDERS_DATA, RECENT_ORDERS } from "../../../../lib/mock-data";
import Link from "next/link";
import CategoryManager from "../../../../components/admin/CategoryManager";
import ProductManager from "../../../../components/admin/ProductManager";

const { GOLD, SANS, SERIF, MIST, IVORY } = Constants;

export default function AdminPage() {
  const [section, setSection] = useState("dashboard");

  const NAV = [
    { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { id: "products",  label: "Products",   icon: Package          },
    { id: "categories",label: "Categories", icon: Tag              },
    { id: "orders",    label: "Orders",     icon: CartIcon         },
    { id: "customers", label: "Customers",  icon: Users            },
    { id: "banners",   label: "Banners",    icon: ImageIcon        },
    { id: "reports",   label: "Reports",    icon: BarChart2        },
  ];

  const METRICS = [
    { label: "Total Orders",      value: "2,841",   change: "+12.4%",          up: true,  icon: ShoppingBag    },
    { label: "Revenue (Jun)",     value: "₹61.8L",  change: "+18.1%",          up: true,  icon: TrendingUp     },
    { label: "Low Stock Items",   value: "7",        change: "−2 from last week", up: false, icon: AlertCircle  },
    { label: "New Customers",     value: "148",      change: "+8.3%",           up: true,  icon: Users          },
  ];

  return (
    <div className="flex" style={{ height: "100vh", background: "#F4F4F6" }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: "#1A1A2E" }}
      >
        <div className="px-5 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/"
            className="text-xs tracking-widest uppercase mb-0.5 hover:opacity-70 transition-opacity block"
            style={{ color: GOLD, fontFamily: SANS }}
          >
            ← Storefront
          </Link>
          <h2 className="text-lg font-normal mt-1" style={{ fontFamily: SERIF, color: "#E8E8F0" }}>
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-all"
              style={{
                background: section === id ? "rgba(201,162,39,0.12)" : "transparent",
                color: section === id ? GOLD : "rgba(232,232,240,0.55)",
                borderLeft: `2px solid ${section === id ? GOLD : "transparent"}`,
                fontFamily: SANS,
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(232,232,240,0.35)", fontFamily: SANS }}>
            Logged in as Admin
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div
          className="px-8 py-5 flex items-center justify-between"
          style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div>
            <h1 className="text-xl font-medium" style={{ color: "#1A1A2E", fontFamily: SERIF }}>
              {NAV.find((n) => n.id === section)?.label}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280", fontFamily: SANS }}>
              Monday, 23 June 2026
            </p>
          </div>
          {section === "products" && (
            <button
              className="px-4 py-2 text-xs tracking-wider uppercase"
              style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
            >
              + Add Product
            </button>
          )}
        </div>

        <div className="p-8">
          {section === "dashboard" && (
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
                      <m.icon size={15} style={{ color: GOLD }} />
                    </div>
                    <p className="text-2xl font-medium mb-1" style={{ color: "#1A1A2E", fontFamily: SERIF }}>
                      {m.value}
                    </p>
                    <p className="text-xs" style={{ color: m.up ? "#16a34a" : "#dc2626", fontFamily: SANS }}>
                      {m.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="md:col-span-2 p-5 rounded" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 className="text-sm font-medium mb-5" style={{ color: "#1A1A2E", fontFamily: SANS }}>
                    Revenue (₹ Lakhs) — 2026
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={REV_DATA}>
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
                    Orders This Week
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ORDERS_DATA}>
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
                    {RECENT_ORDERS.map((o, i) => (
                      <tr
                        key={o.id}
                        style={{ borderBottom: i < RECENT_ORDERS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                      >
                        <td className="px-6 py-3.5 text-sm font-medium" style={{ color: GOLD, fontFamily: SANS }}>{o.id}</td>
                        <td className="px-6 py-3.5 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{o.customer}</td>
                        <td className="px-6 py-3.5 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{o.item}</td>
                        <td className="px-6 py-3.5 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>{o.amount}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              background: o.status === "Delivered" ? "#dcfce7" : o.status === "Shipped" ? "#dbeafe" : "#fef9c3",
                              color:      o.status === "Delivered" ? "#16a34a" : o.status === "Shipped" ? "#2563eb" : "#ca8a04",
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
              </div>
            </div>
          )}

          {section === "products" && <ProductManager />}

          {section === "categories" && <CategoryManager />}

          {!["dashboard", "products", "categories"].includes(section) && (
            <div
              className="flex items-center justify-center rounded"
              style={{ height: 280, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="text-center">
                <p className="text-sm font-medium mb-1" style={{ color: "#374151", fontFamily: SANS }}>
                  {NAV.find((n) => n.id === section)?.label}
                </p>
                <p className="text-xs" style={{ color: "#6B7280", fontFamily: SANS }}>Coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
