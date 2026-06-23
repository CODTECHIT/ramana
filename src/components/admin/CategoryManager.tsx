"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { Constants } from "../../lib/mock-data";

const { GOLD, SANS, MIST } = Constants;

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  displayOrder: number;
  active: boolean;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    heroImage: "",
    displayOrder: 0,
    active: true,
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", heroImage: "", displayOrder: 0, active: true });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat._id);
    setFormData({ ...cat });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:5000/api/admin/categories/${editingId}`
        : `http://localhost:5000/api/admin/categories`;
      
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Operation failed");
        return;
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert("Network error saving category.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete");
        return;
      }
      fetchCategories();
    } catch (err) {
      alert("Network error.");
    }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Categories</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase text-white rounded transition-opacity hover:opacity-90"
          style={{ background: GOLD, fontFamily: SANS }}
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {["Image", "Name", "Slug", "Order", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c._id} style={{ borderBottom: i < categories.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                <td className="px-5 py-3">
                  <div className="w-10 h-10 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                    {c.heroImage ? (
                      <img src={c.heroImage} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">No Img</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>{c.name}</td>
                <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{c.slug}</td>
                <td className="px-5 py-3 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{c.displayOrder}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: c.active ? "#dcfce7" : "#fef9c3", color: c.active ? "#16a34a" : "#ca8a04", fontFamily: SANS }}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(c)} className="p-1.5 hover:opacity-60 transition-opacity" style={{ color: "#6B7280" }}><Edit size={13} /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 hover:opacity-60 transition-opacity" style={{ color: "#dc2626" }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">No categories found. Create one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <h3 className="font-medium text-[#1A1A2E]" style={{ fontFamily: SANS }}>
                {editingId ? "Edit Category" : "New Category"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4" style={{ fontFamily: SANS }}>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Name</label>
                <input required type="text" value={formData.name} onChange={e => {
                  const val = e.target.value;
                  setFormData(prev => ({ 
                    ...prev, 
                    name: val, 
                    // Auto-slug generation if creating new
                    slug: !editingId ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prev.slug 
                  }));
                }} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Description</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Image URL (Cloudinary setup in next block)</label>
                <input type="text" value={formData.heroImage} onChange={e => setFormData({ ...formData, heroImage: e.target.value })} placeholder="https://..." className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Display Order</label>
                  <input type="number" value={formData.displayOrder} onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} />
                  <label htmlFor="active" className="text-sm">Active</label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-white rounded text-sm hover:opacity-90" style={{ background: GOLD }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
