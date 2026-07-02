"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { Constants } from "../../lib/mock-data";

const { GOLD, SANS, MIST } = Constants;

interface Collection {
  _id: string;
  title: string;
  description?: string;
  image: string;
  cta?: string;
  link?: string;
  displayOrder: number;
  active: boolean;
}

export default function CollectionManager() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    cta: "Explore Collection",
    link: "/collections/all",
    displayOrder: 0,
    active: true,
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setUploading(true);
      const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/upload/signature`, {
        credentials: "include"
      });
      if (!sigRes.ok) throw new Error("Could not get upload signature");
      
      const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("api_key", apiKey);
      formDataUpload.append("timestamp", timestamp.toString());
      formDataUpload.append("signature", signature);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formDataUpload,
      });

      const uploadedData = await uploadRes.json();
      if (uploadedData.secure_url) {
        setFormData(prev => ({ ...prev, image: uploadedData.secure_url }));
      } else {
        alert("Cloudinary upload failed");
      }
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/collections`, {
        credentials: "include",
      });
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxData = async () => {
    try {
      const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`);
      const catData = await catRes.json();
      setCategories(catData);

      const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`);
      const prodData = await prodRes.json();
      setProducts(prodData.filter((p: any) => p.active));
    } catch (err) {}
  };

  useEffect(() => {
    fetchCollections();
    fetchAuxData();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", image: "", cta: "Explore Collection", link: "/collections/all", displayOrder: 0, active: true });
    setShowModal(true);
  };

  const openEdit = (col: Collection) => {
    setEditingId(col._id);
    setFormData({
      title: col.title,
      description: col.description || "",
      image: col.image,
      cta: col.cta || "Explore Collection",
      link: col.link || "/collections/all",
      displayOrder: col.displayOrder,
      active: col.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/collections/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/collections`;

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
      fetchCollections();
    } catch (err) {
      alert("Network error saving collection.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/collections/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete");
        return;
      }
      fetchCollections();
    } catch (err) {
      alert("Network error.");
    }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading collections...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Collections</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase text-white rounded transition-opacity hover:opacity-90"
          style={{ background: GOLD, fontFamily: SANS }}
        >
          <Plus size={14} /> Add Collection
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {["Image", "Title", "Description", "CTA", "Link", "Order", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {collections.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-xs text-gray-500" style={{ fontFamily: SANS }}>No curated collections configured yet.</td>
              </tr>
            ) : (
              collections.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: i < collections.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <td className="px-5 py-3">
                    <div className="w-16 h-12 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                      {c.image ? (
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">No Img</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>{c.title}</td>
                  <td className="px-5 py-3 text-sm truncate max-w-xs" style={{ color: "#6B7280", fontFamily: SANS }}>{c.description || <span className="text-gray-400 font-light">—</span>}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{c.cta}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{c.link}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{c.displayOrder}</td>
                  <td className="px-5 py-3 text-sm">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        background: c.active ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.12)",
                        color: c.active ? "#16a34a" : "#dc2626",
                        fontFamily: SANS,
                      }}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="p-1 hover:text-[#C9A227] transition-colors"><Edit size={15} /></button>
                      <button onClick={() => handleDelete(c._id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>
                {editingId ? "Edit Collection" : "Add Collection"}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm"
                  style={{ fontFamily: SANS }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm h-20"
                  style={{ fontFamily: SANS }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Collection Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#FDF9F3] file:text-[#C9A227] hover:file:bg-[#FDF9F3]/80"
                  />
                </div>
                {uploading && <p className="text-[10px] text-gray-400 mt-1">Uploading to Cloudinary...</p>}
                {formData.image && (
                  <div className="mt-2 relative w-20 h-20 border rounded bg-gray-50 overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>CTA Label</label>
                  <input
                    type="text"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm"
                    style={{ fontFamily: SANS }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Link Path</label>
                  <select
                    value={
                      categories.some(c => `/collections/${c.slug}` === formData.link) ||
                      products.some(p => `/product/${p.slug}` === formData.link) ||
                      formData.link === "/collections/all" ||
                      formData.link === ""
                        ? formData.link
                        : "custom"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, link: val === "custom" ? "/custom" : val });
                    }}
                    className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm bg-white mb-2"
                    style={{ fontFamily: SANS }}
                  >
                    <option value="">No Link</option>
                    <option value="/collections/all">Shop All Products</option>
                    {categories.length > 0 && (
                      <optgroup label="Categories">
                        {categories.map(c => (
                          <option key={c._id} value={`/collections/${c.slug}`}>{c.name}</option>
                        ))}
                      </optgroup>
                    )}
                    {products.length > 0 && (
                      <optgroup label="Products">
                        {products.map(p => (
                          <option key={p._id} value={`/product/${p.slug}`}>{p.name}</option>
                        ))}
                      </optgroup>
                    )}
                    <option value="custom">Custom Link Path...</option>
                  </select>

                  {/* Show manual input if it's a custom path */}
                  {(formData.link &&
                    formData.link !== "/collections/all" &&
                    !categories.some(c => `/collections/${c.slug}` === formData.link) &&
                    !products.some(p => `/product/${p.slug}` === formData.link)) && (
                    <input
                      type="text"
                      placeholder="e.g. /custom-url or https://..."
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm animate-fade-in"
                      style={{ fontFamily: SANS }}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm"
                    style={{ fontFamily: SANS }}
                  />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded"
                      style={{ accentColor: GOLD }}
                    />
                    <span className="text-sm" style={{ color: "#374151", fontFamily: SANS }}>Active</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 text-white font-medium rounded transition-opacity hover:opacity-90 uppercase tracking-widest text-xs"
                style={{ background: GOLD, fontFamily: SANS }}
              >
                Save Collection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
