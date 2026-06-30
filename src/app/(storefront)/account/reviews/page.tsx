"use client";

import { useEffect, useState } from "react";
import { Star, Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { EmptyState, PageHeader, SkeletonCard } from "../../../../components/dashboard/DashboardUI";
import { Constants, I } from "../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;
const API = "http://localhost:5000";


function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hov, setHov] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHov(i)}
          onMouseLeave={() => onChange && setHov(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={20}
            fill={(hov || value) >= i ? GOLD : "none"}
            stroke={GOLD}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API}/api/user/reviews`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchReviews();
  }, []);

  const openEdit = (r: any) => {
    setForm({ rating: r.rating, title: r.title, body: r.body });
    setEditId(r._id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) { alert("Please fill in title and review."); return; }
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`${API}/api/user/reviews/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(form) });
        if (res.ok) {
          const updated = await res.json();
          setReviews(prev => prev.map(r => r._id === editId ? updated : r));
        }
      }
    } catch (error) {
      console.error(error);
    }
    setSaving(false); setShowForm(false); setEditId(null); setForm({ rating: 5, title: "", body: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try { await fetch(`${API}/api/user/reviews/${id}`, { method: "DELETE", credentials: "include" }); } catch {}
    setReviews(prev => prev.filter(r => r._id !== id));
  };

  const inp = "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-amber-300 transition-all";

  return (
    <div>
      <PageHeader title="Reviews & Ratings" subtitle="Your product reviews help other shoppers" />

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonCard height="h-40" /> <SkeletonCard height="h-40" />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={<Star size={36} />} title="No reviews yet"
          description="Purchase a product to leave your first review."
          action={<a href="/collections" className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: GOLD, color: IVORY }}>Shop Now</a>}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {reviews.map(review => (
            <div key={review._id} className="rounded-2xl border overflow-hidden shadow-sm" style={{ background: IVORY, borderColor: MIST }}>
              {/* Header */}
              <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: MIST, background: `${GOLD}06` }}>
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {review.productImage
                    ? <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Package size={20} style={{ color: GOLD }} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: CHARCOAL, fontFamily: SANS }}>{review.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating value={review.rating} />
                    <span className="text-xs" style={{ color: SMOKE }}>
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#D1FAE5", color: "#059669" }}>✓ Verified</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(review)} className="p-2 rounded-full border transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(review._id)} className="p-2 rounded-full border transition-all hover:opacity-80" style={{ borderColor: MIST, color: "#dc2626" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <p className="text-sm font-semibold mb-1" style={{ color: CHARCOAL, fontFamily: SANS }}>{review.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: SMOKE, fontFamily: SANS }}>{review.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ background: IVORY }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: MIST }}>
              <h2 className="font-semibold" style={{ color: CHARCOAL, fontFamily: SERIF }}>Edit Review</h2>
              <button onClick={() => setShowForm(false)}><X size={16} style={{ color: SMOKE }} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: SMOKE }}>Your Rating</label>
                <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inp} style={{ borderColor: MIST }} placeholder="Sum up your experience" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: SMOKE }}>Review</label>
                <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} className={inp} style={{ borderColor: MIST }} rows={4} placeholder="Tell us about the product…" />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-full border text-sm font-medium hover:opacity-80 transition-all" style={{ borderColor: MIST, color: SMOKE }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-all disabled:opacity-60" style={{ background: GOLD, color: IVORY }}>
                {saving ? "Saving…" : "Update Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
