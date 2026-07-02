"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";
import { EmptyState, PageHeader, SkeletonCard } from "../../../../components/dashboard/DashboardUI";
import { Constants } from "../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;
const API = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`;

const EMPTY_FORM = { fullName: "", mobile: "", addressLine1: "", addressLine2: "", city: "", state: "Tamil Nadu", country: "India", pincode: "", landmark: "", isDefault: false };

const STATES = ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana", "Maharashtra", "Gujarat", "Rajasthan", "Delhi", "West Bengal", "Other"];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${API}/api/user/addresses`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchAddresses();
  }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (addr: any) => {
    setForm({ fullName: addr.fullName, mobile: addr.mobile, addressLine1: addr.addressLine1, addressLine2: addr.addressLine2 || "", city: addr.city, state: addr.state, country: addr.country, pincode: addr.pincode, landmark: addr.landmark || "", isDefault: addr.isDefault });
    setEditingId(addr._id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.mobile || !form.addressLine1 || !form.city || !form.pincode) {
      alert("Please fill in all required fields."); return;
    }
    setSaving(true);
    try {
      const url = editingId ? `${API}/api/user/addresses/${editingId}` : `${API}/api/user/addresses`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(form) });
      if (res.ok) {
        const saved = await res.json();
        if (editingId) setAddresses(prev => prev.map(a => a._id === editingId ? saved : (form.isDefault ? { ...a, isDefault: false } : a)));
        else setAddresses(prev => [...prev, saved]);
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false); setShowForm(false); setEditingId(null); setForm(EMPTY_FORM);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try { await fetch(`${API}/api/user/addresses/${id}`, { method: "DELETE", credentials: "include" }); } catch {}
    setAddresses(prev => prev.filter(a => a._id !== id));
  };

  const handleSetDefault = async (id: string) => {
    try { await fetch(`${API}/api/user/addresses/${id}/default`, { method: "PATCH", credentials: "include" }); } catch {}
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
  };

  const inp = "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2";
  const inpStyle = { borderColor: MIST, fontFamily: SANS, background: "white" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="My Addresses" subtitle="Manage your saved delivery addresses" />
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80" style={{ background: GOLD, color: IVORY }}>
          <Plus size={15} /> Add Address
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <SkeletonCard height="h-40" /> <SkeletonCard height="h-40" />
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <EmptyState icon={<MapPin size={36} />} title="No addresses saved" description="Add your first delivery address." action={
          <button onClick={openAdd} className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: GOLD, color: IVORY }}>Add Address</button>
        } />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr._id} className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200 ${addr.isDefault ? "shadow-sm" : ""}`}
              style={{ background: IVORY, borderColor: addr.isDefault ? GOLD : MIST }}>
              {addr.isDefault && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit text-xs font-semibold" style={{ background: `${GOLD}18`, color: GOLD }}>
                  <Check size={11} /> Default Address
                </div>
              )}
              <div className="text-sm leading-relaxed" style={{ color: CHARCOAL, fontFamily: SANS }}>
                <p className="font-semibold">{addr.fullName}</p>
                <p className="mt-1 text-xs" style={{ color: SMOKE }}>{addr.mobile}</p>
                <p className="mt-1">{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                {addr.landmark && <p className="text-xs mt-0.5" style={{ color: SMOKE }}>Near: {addr.landmark}</p>}
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: MIST }}>
                <button onClick={() => openEdit(addr)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>
                  <Pencil size={11} /> Edit
                </button>
                <button onClick={() => handleDelete(addr._id)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all hover:opacity-80" style={{ borderColor: MIST, color: "#dc2626" }}>
                  <Trash2 size={11} /> Delete
                </button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all hover:opacity-80" style={{ borderColor: GOLD, color: GOLD }}>
                    <Check size={11} /> Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ background: IVORY }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: MIST }}>
              <h2 className="font-semibold" style={{ color: CHARCOAL, fontFamily: SERIF }}>{editingId ? "Edit Address" : "Add New Address"}</h2>
              <button onClick={() => setShowForm(false)} className="text-lg leading-none" style={{ color: SMOKE }}>✕</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-2 gap-4">
              {[
                { key: "fullName", label: "Full Name *", col: 2 },
                { key: "mobile", label: "Mobile Number *", col: 2 },
                { key: "addressLine1", label: "Address Line 1 *", col: 2 },
                { key: "addressLine2", label: "Address Line 2", col: 2 },
                { key: "city", label: "City *", col: 1 },
                { key: "pincode", label: "Pincode *", col: 1 },
                { key: "landmark", label: "Landmark", col: 2 },
              ].map(({ key, label, col }) => (
                <div key={key} className={col === 2 ? "col-span-2" : "col-span-1"}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>{label}</label>
                  <input
                    value={(form as any)[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className={inp}
                    style={{ ...inpStyle, borderColor: MIST }}
                    placeholder={label.replace(" *", "")}
                  />
                </div>
              ))}
              <div className="col-span-1">
                <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>State *</label>
                <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className={inp} style={inpStyle}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>Country</label>
                <input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className={inp} style={inpStyle} />
              </div>
              <div className="col-span-2 flex items-center gap-3 pt-1">
                <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
                <label htmlFor="isDefault" className="text-sm" style={{ color: CHARCOAL }}>Set as default address</label>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: MIST }}>
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-full text-sm font-medium border transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-60" style={{ background: GOLD, color: IVORY }}>
                {saving ? "Saving…" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
