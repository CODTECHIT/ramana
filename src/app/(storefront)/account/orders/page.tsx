"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, Download, RefreshCw, X, RotateCcw } from "lucide-react";
import { OrderStatusBadge, EmptyState, SkeletonCard, PageHeader } from "../../../../components/dashboard/DashboardUI";
import { Constants, fmt } from "../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;
const API = "http://localhost:5000";

const STATUS_FILTER = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <PageHeader title="My Orders" subtitle="Track, manage and view all your orders" />

      {/* Status Filter Pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTER.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
            style={{
              background: filter === s ? GOLD : IVORY,
              color: filter === s ? IVORY : SMOKE,
              borderColor: filter === s ? GOLD : MIST,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} height="h-32" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={36} />}
          title="No orders found"
          description={filter === "All" ? "You haven't placed any orders yet." : `No ${filter.toLowerCase()} orders.`}
          action={
            <Link href="/collections" className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: GOLD, color: IVORY }}>
              Shop Now
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(order => (
            <div
              key={order._id}
              className="rounded-2xl border overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md"
              style={{ background: IVORY, borderColor: MIST }}
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: MIST, background: `${GOLD}06` }}>
                <div className="flex items-center gap-3">
                  <Package size={16} style={{ color: GOLD }} />
                  <div>
                    <span className="text-sm font-bold" style={{ color: CHARCOAL, fontFamily: SERIF }}>
                      {order.orderNumber}
                    </span>
                    <span className="text-xs ml-3" style={{ color: SMOKE, fontFamily: SANS }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-bold" style={{ color: CHARCOAL, fontFamily: SERIF }}>
                    {fmt(order.total)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-5 py-4">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm" style={{ color: CHARCOAL, fontFamily: SANS }}>
                      {item.name}
                      {item.qty > 1 && <span className="ml-1 text-xs" style={{ color: SMOKE }}>×{item.qty}</span>}
                    </span>
                    <span className="text-sm font-medium" style={{ color: CHARCOAL, fontFamily: SANS }}>
                      {fmt(item.price)}
                    </span>
                  </div>
                ))}

                {order.trackingId && (
                  <div className="mt-3 p-2.5 rounded-lg flex items-center gap-2" style={{ background: `${GOLD}10` }}>
                    <span className="text-xs" style={{ color: SMOKE }}>Tracking ID:</span>
                    <span className="text-xs font-bold" style={{ color: GOLD }}>{order.trackingId}</span>
                    {order.trackingLink && (
                      <a href={order.trackingLink} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-semibold hover:underline" style={{ color: "#2563eb" }}>Track Package</a>
                    )}
                  </div>
                )}

                <div className="mt-3 text-xs" style={{ color: SMOKE, fontFamily: SANS }}>
                  <span>via {order.paymentMethod} · </span>
                  <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-t" style={{ borderColor: MIST }}>
                <Link
                  href={`/account/orders/${order._id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: GOLD, color: GOLD }}
                >
                  View Details <ArrowRight size={12} />
                </Link>
                {order.status === "Delivered" && (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all hover:opacity-80"
                      style={{ borderColor: MIST, color: SMOKE }}>
                      <Download size={12} /> Invoice
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all hover:opacity-80"
                      style={{ borderColor: MIST, color: SMOKE }}>
                      <RotateCcw size={12} /> Return
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all hover:opacity-80"
                      style={{ borderColor: MIST, color: SMOKE }}>
                      <RefreshCw size={12} /> Reorder
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
