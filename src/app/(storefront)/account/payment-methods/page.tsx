"use client";

import { useEffect, useState } from "react";
import { Plus, Check, Trash2, Shield, Smartphone, CreditCard, Building2 } from "lucide-react";
import { PageHeader } from "../../../../components/dashboard/DashboardUI";
import { Constants } from "../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

const API = "http://localhost:5000";

const MOCK_TRANSACTIONS = [
  { id: "t1", desc: "Order #JW-8841 — Complete Bridal Set", amount: -895000, date: "23 Jun 2026", status: "Debited", via: "UPI" },
  { id: "t2", desc: "Refund — Order #JW-8820", amount: 48900, date: "12 Jun 2026", status: "Credited", via: "UPI" },
  { id: "t3", desc: "Order #JW-8839 — Temple Haaram", amount: -156800, date: "20 Jun 2026", status: "Debited", via: "Net Banking" },
];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch(`${API}/api/user/payment-methods`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setMethods(data);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Remove this payment method?")) return;
    try {
      await fetch(`${API}/api/user/payment-methods/${id}`, { method: "DELETE", credentials: "include" });
      setMethods(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  
  const setDefault = async (id: string) => {
    try {
      await fetch(`${API}/api/user/payment-methods/${id}/default`, { method: "PATCH", credentials: "include" });
      setMethods(prev => prev.map(m => ({ ...m, isDefault: m._id === id })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMethod = async () => {
    if (addType === "upi" && !upiId.includes("@")) { alert("Enter a valid UPI ID"); return; }
    const newM = {
      type: addType,
      label: addType === "upi" ? "UPI" : addType === "card" ? "Debit/Credit Card" : "Net Banking",
      detail: addType === "upi" ? upiId : addType === "card" ? `**** **** **** ${cardNum.slice(-4)}` : "New Bank Account",
      icon: addType === "upi" ? "📲" : addType === "card" ? "💳" : "🏦",
      isDefault: methods.length === 0,
    };
    try {
      const res = await fetch(`${API}/api/user/payment-methods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newM)
      });
      if (res.ok) {
        const saved = await res.json();
        setMethods(prev => [...prev, saved]);
      }
    } catch (error) {
      console.error(error);
    }
    setShowAdd(false); setUpiId(""); setCardNum(""); setCardName("");
  };

  const inp = "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-300 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Payment Methods" subtitle="Manage your saved payment options" />
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-all" style={{ background: GOLD, color: IVORY }}>
          <Plus size={14} /> Add Method
        </button>
      </div>

      {/* Saved Methods */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {methods.map(m => (
          <div key={m._id} className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200`}
            style={{ background: CHARCOAL, borderColor: m.isDefault ? GOLD : "transparent" }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: IVORY }}>{m.label}</p>
                  <p className="text-xs mt-0.5 opacity-70" style={{ color: IVORY }}>{m.detail}</p>
                </div>
              </div>
              {m.isDefault && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${GOLD}30`, color: GOLD }}>
                  <Check size={10} /> Default
                </div>
              )}
            </div>
            {(m as any).bank && <p className="text-xs opacity-50" style={{ color: IVORY }}>{(m as any).bank}</p>}
            <div className="flex gap-2 pt-2 border-t border-white/10">
              {!m.isDefault && (
                <button onClick={() => setDefault(m._id)} className="flex-1 text-xs py-1.5 rounded-full border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all">
                  Set Default
                </button>
              )}
              <button onClick={() => remove(m._id)} className="px-3 py-1.5 rounded-full text-xs border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-all">
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div className="rounded-xl p-4 flex items-start gap-3 mb-8" style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30` }}>
        <Shield size={18} style={{ color: GOLD, flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>Your payments are secure</p>
          <p className="text-xs mt-0.5" style={{ color: SMOKE }}>All payment data is encrypted. We never store full card details on our servers.</p>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="font-semibold text-base mb-4" style={{ color: CHARCOAL, fontFamily: SERIF }}>Transaction History</h2>
        <div className="rounded-2xl border overflow-hidden" style={{ background: IVORY, borderColor: MIST }}>
          <div className="divide-y" style={{ borderColor: MIST }}>
            {MOCK_TRANSACTIONS.map(tx => (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: tx.amount < 0 ? "#FEE2E2" : "#D1FAE5" }}>
                  {tx.amount < 0 ? "↑" : "↓"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: CHARCOAL, fontFamily: SANS }}>{tx.desc}</p>
                  <p className="text-xs mt-0.5" style={{ color: SMOKE }}>{tx.date} · {tx.via}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: tx.amount < 0 ? "#dc2626" : "#059669" }}>
                    {tx.amount < 0 ? "-" : "+"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs" style={{ color: SMOKE }}>{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Method Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ background: IVORY }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: MIST }}>
              <h2 className="font-semibold" style={{ color: CHARCOAL, fontFamily: SERIF }}>Add Payment Method</h2>
              <button onClick={() => setShowAdd(false)} style={{ color: SMOKE }}>✕</button>
            </div>
            <div className="p-6">
              {/* Type Selector */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {(["upi", "card", "netbanking"] as const).map(t => (
                  <button key={t} onClick={() => setAddType(t)}
                    className="flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all"
                    style={{ borderColor: addType === t ? GOLD : MIST, background: addType === t ? `${GOLD}12` : "white", color: addType === t ? GOLD : SMOKE }}>
                    {t === "upi" ? <Smartphone size={18} /> : t === "card" ? <CreditCard size={18} /> : <Building2 size={18} />}
                    {t === "upi" ? "UPI" : t === "card" ? "Card" : "Net Banking"}
                  </button>
                ))}
              </div>

              {addType === "upi" && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>UPI ID</label>
                  <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="e.g. name@oksbi" className={inp} style={{ borderColor: MIST }} />
                </div>
              )}
              {addType === "card" && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>Cardholder Name</label>
                    <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on card" className={inp} style={{ borderColor: MIST }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>Card Number</label>
                    <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, "").slice(0,16))} placeholder="1234 5678 9012 3456" className={inp} style={{ borderColor: MIST }} maxLength={16} />
                  </div>
                </div>
              )}
              {addType === "netbanking" && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>Select Bank</label>
                  <select className={inp} style={{ borderColor: MIST }}>
                    {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-full border text-sm font-medium hover:opacity-80 transition-all" style={{ borderColor: MIST, color: SMOKE }}>Cancel</button>
              <button onClick={handleAddMethod} className="flex-1 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-all" style={{ background: GOLD, color: IVORY }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
