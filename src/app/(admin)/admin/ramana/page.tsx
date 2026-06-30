"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Package, Tag, ShoppingBag as CartIcon, Users, Image as ImageIcon, BarChart2 } from "lucide-react";
import { Constants } from "../../../../lib/mock-data";
import Link from "next/link";
import CategoryManager from "../../../../components/admin/CategoryManager";
import ProductManager from "../../../../components/admin/ProductManager";
import ReportDashboard from "../../../../components/admin/ReportDashboard";
import BannerManager from "../../../../components/admin/BannerManager";
import OrderManager from "../../../../components/admin/OrderManager";
import CustomerManager from "../../../../components/admin/CustomerManager";
import CollectionManager from "../../../../components/admin/CollectionManager";

const { GOLD, SANS, SERIF, IVORY } = Constants;

export default function AdminPage() {
  const [section, setSection] = useState("dashboard");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data.name) setAdminName(data.name);
      })
      .catch(() => {});
  }, []);

  const NAV = [
    { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { id: "products",  label: "Products",   icon: Package          },
    { id: "categories",label: "Categories", icon: Tag              },
    { id: "collections",label: "Collections",icon: Tag             },
    { id: "orders",    label: "Orders",     icon: CartIcon         },
    { id: "customers", label: "Customers",  icon: Users            },
    { id: "banners",   label: "Banners",    icon: ImageIcon        },
    { id: "reports",   label: "Reports",    icon: BarChart2        },
  ];

  return (
    <div className="flex animate-fade-in" style={{ height: "100vh", background: "#F4F4F6" }}>
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
            Logged in as {adminName}
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
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="p-8">
          {section === "dashboard" && <ReportDashboard />}

          {section === "products" && <ProductManager />}

          {section === "categories" && <CategoryManager />}

          {section === "collections" && <CollectionManager />}

          {section === "banners" && <BannerManager />}

          {section === "orders" && <OrderManager />}

          {section === "customers" && <CustomerManager />}

          {section === "reports" && <ReportDashboard />}
        </div>
      </main>
    </div>
  );
}
