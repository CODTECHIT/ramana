"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Heart, ShoppingCart, TrendingUp,
  Clock, Package, ArrowRight, Star,
} from "lucide-react";
import { StatCard, SkeletonCard, OrderStatusBadge, EmptyState, PageHeader } from "../../../components/dashboard/DashboardUI";
import { useCart } from "../../../components/CartProvider";
import { useWishlist } from "../../../components/WishlistProvider";
import { useAuth } from "../../../components/AuthProvider";
import { Constants, fmt, I } from "../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

const API = "http://localhost:5000";
export default function AccountDashboard() {
  const { user } = useAuth();
  const { cart, cartCount } = useCart();
  const { wishlist, wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalSpent: 0 });
  const [viewedProducts, setViewedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, viewedRes] = await Promise.all([
          fetch(`${API}/api/user/dashboard`, { credentials: "include" }),
          fetch(`${API}/api/user/recently-viewed`, { credentials: "include" })
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats({ totalOrders: data.totalOrders, pendingOrders: data.pendingOrders, totalSpent: data.totalSpent });
          setOrders(data.recentOrders || []);
        }
        
        if (viewedRes.ok) {
          const data = await viewedRes.json();
          setViewedProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? ""}! 👋`}
        subtitle="Here's an overview of your account activity"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Orders" value={stats.totalOrders} icon={<ShoppingBag size={22} />} />
            <StatCard label="Pending Orders" value={stats.pendingOrders} icon={<Clock size={22} />} accent="#F59E0B" />
            <StatCard label="Wishlist Items" value={wishlistCount} icon={<Heart size={22} />} accent="#E11D48" />
            <StatCard label="Cart Items" value={cartCount} icon={<ShoppingCart size={22} />}
              sub={cartCount > 0 ? fmt(cartTotal) : undefined} accent="#059669" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border overflow-hidden" style={{ background: IVORY, borderColor: MIST }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: MIST }}>
              <h2 className="font-semibold text-base" style={{ color: CHARCOAL, fontFamily: SERIF }}>
                Recent Orders
              </h2>
              <Link href="/account/orders" className="text-xs flex items-center gap-1 transition-opacity hover:opacity-70" style={{ color: GOLD, fontFamily: SANS }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="p-4 flex flex-col gap-3">
                {[1,2,3].map(i => <SkeletonCard key={i} height="h-16" />)}
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                icon={<Package size={32} />}
                title="No orders yet"
                description="Your order history will appear here once you make your first purchase."
                action={
                  <Link href="/collections" className="text-sm font-medium px-6 py-2.5 rounded-full" style={{ background: GOLD, color: IVORY }}>
                    Start Shopping
                  </Link>
                }
              />
            ) : (
              <div className="divide-y" style={{ borderColor: MIST }}>
                {orders.map((order) => (
                  <Link key={order._id} href={`/account/orders/${order._id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-amber-50/40 transition-colors group">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${GOLD}14` }}
                    >
                      <Package size={18} style={{ color: GOLD }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: CHARCOAL, fontFamily: SANS }}>
                        {order.orderNumber}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: SMOKE }}>
                        {order.items?.[0]?.name}
                        {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold" style={{ color: CHARCOAL, fontFamily: SANS }}>
                        {fmt(order.total)}
                      </p>
                      <div className="mt-1">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                    <ArrowRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: SMOKE }} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions + Stats */}
        <div className="flex flex-col gap-4">
          {/* Total Spent */}
          <div className="rounded-2xl p-5 border" style={{ background: `linear-gradient(135deg, ${CHARCOAL}, #3a3028)`, borderColor: CHARCOAL }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} style={{ color: GOLD }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: GOLD, fontFamily: SANS }}>
                Total Spent
              </span>
            </div>
            <p className="text-3xl font-bold mt-2" style={{ color: IVORY, fontFamily: SERIF }}>
              {loading ? "—" : fmt(stats.totalSpent)}
            </p>
            <p className="text-xs mt-1 opacity-60" style={{ color: IVORY, fontFamily: SANS }}>
              across all orders
            </p>
          </div>

        </div>
      </div>


    </div>
  );
}
