"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, Download, RotateCcw } from "lucide-react";
import { OrderStatusBadge, OrderTimeline, SkeletonCard, PageHeader } from "../../../../../components/dashboard/DashboardUI";
import { Constants, fmt } from "../../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;
const API = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`;



const getTimelineSteps = (status: string) => [
  { label: "Order Placed", date: "22 Jun 2026, 10:30 AM", done: true },
  { label: "Order Confirmed", date: "22 Jun 2026, 11:00 AM", done: true },
  { label: "Processing", date: "22 Jun 2026, 2:00 PM", done: status !== "Processing" },
  { label: "Shipped", date: status === "Shipped" || status === "Delivered" ? "23 Jun 2026, 9:00 AM" : undefined, done: status === "Shipped" || status === "Delivered", active: status === "Shipped" },
  { label: "Out for Delivery", date: undefined, done: status === "Delivered", active: false },
  { label: "Delivered", date: status === "Delivered" ? "24 Jun 2026, 3:00 PM" : undefined, done: status === "Delivered", active: false },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const found = data.find((o: any) => o._id === id);
          setOrder(found || null);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-32 rounded-lg animate-pulse mb-6" style={{ background: MIST }} />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <SkeletonCard height="h-48" />
            <SkeletonCard height="h-36" />
          </div>
          <div className="flex flex-col gap-4">
            <SkeletonCard height="h-32" />
            <SkeletonCard height="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) return (
    <div className="text-center py-20">
      <p style={{ color: SMOKE }}>Order not found.</p>
      <Link href="/account/orders" className="text-sm mt-3 inline-block" style={{ color: GOLD }}>← Back to Orders</Link>
    </div>
  );

  const steps = getTimelineSteps(order.status);

  return (
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: SMOKE, fontFamily: SANS }}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <PageHeader title={`Order ${order.orderNumber}`}
        subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Items + Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Order Items */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: IVORY, borderColor: MIST }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: MIST }}>
              <h2 className="font-semibold" style={{ color: CHARCOAL, fontFamily: SERIF }}>Items Ordered</h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="divide-y" style={{ borderColor: MIST }}>
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}12` }}>
                    <Package size={24} style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: CHARCOAL, fontFamily: SANS }}>{item.name}</p>
                    {item.variant && <p className="text-xs mt-0.5" style={{ color: SMOKE }}>{item.variant}</p>}
                    <p className="text-xs mt-0.5" style={{ color: SMOKE }}>Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: CHARCOAL, fontFamily: SERIF }}>
                    {fmt(item.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="px-5 py-4 border-t space-y-2" style={{ borderColor: MIST, background: `${GOLD}06` }}>
              <div className="flex justify-between text-sm" style={{ color: SMOKE, fontFamily: SANS }}>
                <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: SMOKE, fontFamily: SANS }}>
                <span>Shipping</span><span>{order.shippingFee === 0 ? "Free" : fmt(order.shippingFee)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm" style={{ color: SMOKE, fontFamily: SANS }}>
                  <span>Tax (GST)</span><span>{fmt(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t" style={{ borderColor: MIST, color: CHARCOAL, fontFamily: SERIF }}>
                <span>Total</span><span>{fmt(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="rounded-2xl border p-5" style={{ background: IVORY, borderColor: MIST }}>
            <h2 className="font-semibold mb-5" style={{ color: CHARCOAL, fontFamily: SERIF }}>Order Tracking</h2>
            {order.trackingId && (
              <div className="flex items-center gap-2 mb-5 p-3 rounded-lg flex-wrap" style={{ background: `${GOLD}10` }}>
                <span className="text-xs" style={{ color: SMOKE }}>Tracking ID:</span>
                <span className="text-xs font-bold" style={{ color: GOLD }}>{order.trackingId}</span>
                {order.courierPartner && (
                  <>
                    <span className="text-xs" style={{ color: SMOKE }}>· via</span>
                    <span className="text-xs font-medium" style={{ color: CHARCOAL }}>{order.courierPartner}</span>
                  </>
                )}
                {order.trackingLink && (
                  <a href={order.trackingLink.startsWith('http') ? order.trackingLink : `https://${order.trackingLink}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-semibold hover:underline" style={{ color: "#2563eb" }}>Track Package ↗</a>
                )}
              </div>
            )}
            <OrderTimeline steps={steps} />
          </div>
        </div>

        {/* Right: Delivery + Payment + Actions */}
        <div className="flex flex-col gap-4">
          {/* Delivery Address */}
          <div className="rounded-2xl border p-5" style={{ background: IVORY, borderColor: MIST }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} style={{ color: GOLD }} />
              <h3 className="font-semibold text-sm" style={{ color: CHARCOAL, fontFamily: SERIF }}>Delivery Address</h3>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: SMOKE, fontFamily: SANS }}>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.pin}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl border p-5" style={{ background: IVORY, borderColor: MIST }}>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} style={{ color: GOLD }} />
              <h3 className="font-semibold text-sm" style={{ color: CHARCOAL, fontFamily: SERIF }}>Payment</h3>
            </div>
            <p className="text-sm" style={{ color: SMOKE, fontFamily: SANS }}>{order.paymentMethod}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "#D4EDDA", color: "#155724" }}>
              ✓ Payment Successful
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border p-5 flex flex-col gap-2" style={{ background: IVORY, borderColor: MIST }}>
            <h3 className="font-semibold text-sm mb-1" style={{ color: CHARCOAL, fontFamily: SERIF }}>Order Actions</h3>
            {order.status === "Delivered" && (
              <>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80" style={{ background: GOLD, color: IVORY, borderColor: GOLD }}>
                  <Download size={14} /> Download Invoice
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-medium border transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>
                  <RotateCcw size={14} /> Request Return
                </button>
              </>
            )}

            <Link href="/account/orders" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-medium border transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>
              ← All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
