"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Heart, ShoppingCart,
  Bookmark, MapPin, CreditCard, Star, Eye,
  UserCircle, LogOut, X, Menu, ChevronRight,
} from "lucide-react";
import { useAuth } from "../AuthProvider";
import { Constants } from "../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

const NAV_ITEMS = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ fontFamily: SANS }}>
      {/* User Info */}
      <div className="p-6 border-b" style={{ borderColor: MIST }}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, color: IVORY }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: CHARCOAL, fontFamily: SERIF }}>
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs truncate mt-0.5" style={{ color: SMOKE }}>
              {user?.email || "Not logged in"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg transition-all duration-200 group"
              style={{
                background: active ? `${GOLD}18` : "transparent",
                color: active ? GOLD : SMOKE,
              }}
            >
              <Icon
                size={18}
                className="flex-shrink-0 transition-colors"
                style={{ color: active ? GOLD : SMOKE }}
              />
              <span
                className="text-sm font-medium flex-1"
                style={{ color: active ? GOLD : CHARCOAL }}
              >
                {label}
              </span>
              {active && <ChevronRight size={14} style={{ color: GOLD }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: MIST }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200 hover:bg-red-50 group"
        >
          <LogOut size={18} className="text-red-400 flex-shrink-0" />
          <span className="text-sm font-medium text-red-500">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 rounded-lg shadow-md"
        style={{ background: CHARCOAL, color: GOLD }}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-72 h-full shadow-2xl"
            style={{ background: IVORY }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full"
              style={{ background: MIST, color: SMOKE }}
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen border-r overflow-y-auto"
        style={{ background: IVORY, borderColor: MIST }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
