"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X, ShoppingBag } from "lucide-react";
import { Constants, fmt } from "../../lib/mock-data";

const { GOLD, SANS, MIST } = Constants;

interface OrderItem {
  name: string;
  price: number;
  qty: number;
  variant?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer?: {
    name: string;
    email: string;
  };
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pin: string;
  };
  paymentMethod: string;
  trackingId?: string;
  trackingLink?: string;
  courierPartner?: string;
  createdAt: string;
}

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState({ trackingId: "", courierPartner: "", trackingLink: "" });
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/orders", {
        credentials: "include",
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // When changing to Shipped, prompt for tracking details first
    if (newStatus === "Shipped") {
      setShippingOrderId(id);
      setTrackingInput({ trackingId: "", courierPartner: "", trackingLink: "" });
      return;
    }
    await submitStatusUpdate(id, newStatus, "", "", "");
  };

  const submitStatusUpdate = async (id: string, status: string, trackingId: string, courierPartner: string, trackingLink: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status, trackingId, courierPartner, trackingLink }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...updated } : o)));
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, ...updated });
      }
      setShippingOrderId(null);
      setEditingTrackingOrderId(null);
      setTrackingInput({ trackingId: "", courierPartner: "", trackingLink: "" });
    } catch (err) {
      alert("Error updating order status.");
    }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading orders...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Orders</h2>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {["Order ID", "Customer", "Items Count", "Total", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-gray-500" style={{ fontFamily: SANS }}>No orders placed yet.</td>
              </tr>
            ) : (
              orders.map((o, i) => {
                const customerName = o.customer ? o.customer.name : (o.guestInfo?.name || "Guest");
                return (
                  <tr key={o._id} style={{ borderBottom: i < orders.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: GOLD, fontFamily: SANS }}>{o.orderNumber}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{customerName}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{o.items.length} items</td>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>{fmt(o.total)}</td>
                    <td className="px-5 py-3 text-sm">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs"
                        style={{
                          background: o.status === "Delivered" ? "rgba(22,163,74,0.12)" : o.status === "Shipped" ? "rgba(37,99,235,0.12)" : o.status === "Cancelled" ? "rgba(220,38,38,0.12)" : "rgba(202,138,4,0.12)",
                          color: o.status === "Delivered" ? "#16a34a" : o.status === "Shipped" ? "#2563eb" : o.status === "Cancelled" ? "#dc2626" : "#ca8a04",
                          fontFamily: SANS,
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-5 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1 text-xs tracking-wider uppercase text-white rounded hover:opacity-90"
                          style={{ background: GOLD, fontFamily: SANS }}
                        >
                          Details
                        </button>
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded outline-none"
                          style={{ fontFamily: SANS }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 pb-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <div>
                <h3 className="text-base font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: SANS }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)}><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" style={{ fontFamily: SANS }}>
              {/* Customer Info */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Customer & Billing</h4>
                <p className="text-sm font-medium" style={{ color: "#374151" }}>
                  Name: {selectedOrder.customer?.name || selectedOrder.guestInfo?.name || "Guest"}
                </p>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Email: {selectedOrder.customer?.email || selectedOrder.guestInfo?.email || "N/A"}
                </p>
                {selectedOrder.guestInfo?.phone && (
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    Phone: {selectedOrder.guestInfo.phone}
                  </p>
                )}
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                  Payment Method: <span className="font-medium text-gray-700">{selectedOrder.paymentMethod}</span>
                </p>
              </div>

              {/* Shipping Info */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Shipping Address</h4>
                <p className="text-sm" style={{ color: "#374151" }}>{selectedOrder.shippingAddress.street}</p>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pin}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3" style={{ fontFamily: SANS }}>Order Items</h4>
              <div className="border border-gray-100 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Item</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-500">Qty</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Price</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-50 last:border-0" style={{ fontFamily: SANS }}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          {item.variant && <p className="text-xs text-gray-400">Variant: {item.variant}</p>}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{fmt(item.price)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{fmt(item.price * item.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex justify-end" style={{ fontFamily: SANS }}>
              <div className="w-64 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-gray-800">{fmt(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-medium text-gray-800">{selectedOrder.shippingFee === 0 ? "FREE" : fmt(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3%):</span>
                  <span className="font-medium text-gray-800">{fmt(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold" style={{ color: "#1A1A2E" }}>
                  <span>Total:</span>
                  <span style={{ color: GOLD }}>{fmt(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded" style={{ background: "#f9f9f9", border: "1px solid rgba(201,162,39,0.15)" }}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold" style={{ fontFamily: SANS }}>Shipment Details</h4>
                <button 
                  onClick={() => {
                    setTrackingInput({
                      trackingId: selectedOrder.trackingId || "",
                      courierPartner: selectedOrder.courierPartner || "",
                      trackingLink: selectedOrder.trackingLink || ""
                    });
                    setEditingTrackingOrderId(selectedOrder._id);
                  }}
                  className="text-xs font-semibold hover:underline" 
                  style={{ color: GOLD }}
                >
                  {selectedOrder.trackingId ? "Edit Tracking" : "Add Tracking"}
                </button>
              </div>
              
              {selectedOrder.trackingId ? (
                <>
                  <p className="text-sm" style={{ fontFamily: SANS, color: "#374151" }}>Courier: <strong>{selectedOrder.courierPartner || "—"}</strong></p>
                  <p className="text-sm" style={{ fontFamily: SANS, color: "#374151" }}>Tracking ID: <strong style={{ color: GOLD }}>{selectedOrder.trackingId}</strong></p>
                  {selectedOrder.trackingLink && (
                    <p className="text-sm mt-1" style={{ fontFamily: SANS }}>
                      <a href={selectedOrder.trackingLink} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>Track Package</a>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-500" style={{ fontFamily: SANS }}>No tracking details added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tracking ID Modal — shown when admin selects "Shipped" */}
      {(shippingOrderId || editingTrackingOrderId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg" style={{ fontFamily: SANS }}>
            <h3 className="text-base font-semibold mb-1" style={{ color: "#1A1A2E" }}>{editingTrackingOrderId ? "Update Shipment Details" : "Enter Shipment Details"}</h3>
            <p className="text-xs text-gray-400 mb-5">A tracking notification email will be sent to the customer.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151" }}>Courier Partner</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Dart, Delhivery, India Post"
                  value={trackingInput.courierPartner}
                  onChange={(e) => setTrackingInput({ ...trackingInput, courierPartner: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 rounded text-sm outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151" }}>Tracking ID <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. BD1234567890IN"
                  value={trackingInput.trackingId}
                  onChange={(e) => setTrackingInput({ ...trackingInput, trackingId: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 rounded text-sm outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151" }}>Tracking Link</label>
                <input
                  type="url"
                  placeholder="https://track.courier.com/..."
                  value={trackingInput.trackingLink}
                  onChange={(e) => setTrackingInput({ ...trackingInput, trackingLink: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 rounded text-sm outline-none focus:border-yellow-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (!trackingInput.trackingId.trim() || !trackingInput.trackingLink.trim()) {
                    alert("Both Tracking ID and Tracking Link are required.");
                    return;
                  }
                  
                  if (shippingOrderId) {
                    submitStatusUpdate(shippingOrderId, "Shipped", trackingInput.trackingId, trackingInput.courierPartner, trackingInput.trackingLink);
                  } else if (editingTrackingOrderId && selectedOrder) {
                    submitStatusUpdate(editingTrackingOrderId, selectedOrder.status, trackingInput.trackingId, trackingInput.courierPartner, trackingInput.trackingLink);
                  }
                }}
                className="flex-1 py-2.5 text-xs uppercase tracking-wider text-white rounded"
                style={{ background: GOLD, color: "#1a1a2e", fontWeight: 600 }}
              >
                {editingTrackingOrderId ? "Save Tracking" : "Mark as Shipped"}
              </button>
              <button
                onClick={() => { 
                  setShippingOrderId(null); 
                  setEditingTrackingOrderId(null);
                  setTrackingInput({ trackingId: "", courierPartner: "", trackingLink: "" }); 
                }}
                className="flex-1 py-2.5 text-xs uppercase tracking-wider rounded border border-gray-200 text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
