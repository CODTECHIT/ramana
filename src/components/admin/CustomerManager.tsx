"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Calendar, CreditCard, ShoppingBag } from "lucide-react";
import { Constants, fmt } from "../../lib/mock-data";

const { GOLD, SANS } = Constants;

interface Customer {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/customers", {
        credentials: "include",
      });
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading customers...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Customers</h2>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {["Customer Info", "Email", "Registered On", "Orders Count", "Total Spent"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-xs text-gray-500" style={{ fontFamily: SANS }}>No customers registered yet.</td>
              </tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: i < customers.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600" style={{ fontFamily: SANS }}>
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-gray-400" />
                      {c.email}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600" style={{ fontFamily: SANS }}>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600" style={{ fontFamily: SANS }}>
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag size={13} className="text-gray-400" />
                      {c.orderCount} orders
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800" style={{ fontFamily: SANS }}>
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={13} className="text-[#C9A227]" />
                      {fmt(c.totalSpent)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
