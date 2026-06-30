"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { Constants } from "../../lib/mock-data";

const { GOLD, SANS, MIST } = Constants;

interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  displayOrder: number;
  active: boolean;
}

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    displayOrder: 0,
    active: true,
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setUploading(true);
      const sigRes = await fetch("http://localhost:5000/api/admin/upload/signature", {
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

  const fetchBanners = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/banners", {
        credentials: "include",
      });
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      setError("Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxData = async () => {
    try {
      const catRes = await fetch("http://localhost:5000/api/categories");
      const catData = await catRes.json();
      setCategories(catData);

      const prodRes = await fetch("http://localhost:5000/api/products");
      const prodData = await prodRes.json();
      setProducts(prodData.filter((p: any) => p.active));
    } catch (err) {}
  };

  useEffect(() => {
    fetchBanners();
    fetchAuxData();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: "", subtitle: "", image: "", link: "", displayOrder: 0, active: true });
    setShowModal(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner._id);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image,
      link: banner.link || "",
      displayOrder: banner.displayOrder,
      active: banner.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/banners/${editingId}`
        : `http://localhost:5000/api/admin/banners`;

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
      fetchBanners();
    } catch (err) {
      alert("Network error saving banner.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete");
        return;
      }
      fetchBanners();
    } catch (err) {
      alert("Network error.");
    }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading banners...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Banners</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase text-white rounded transition-opacity hover:opacity-90"
          style={{ background: GOLD, fontFamily: SANS }}
        >
          <Plus size={14} /> Add Banner
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {["Image", "Title", "Subtitle", "Link", "Order", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-xs text-gray-500" style={{ fontFamily: SANS }}>No banners configured yet.</td>
              </tr>
            ) : (
              banners.map((b, i) => (
                <tr key={b._id} style={{ borderBottom: i < banners.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <td className="px-5 py-3">
                    <div className="w-20 h-10 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                      {b.image ? (
                        <img src={b.image} alt={b.title || "Banner"} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">No Img</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>{b.title || <span className="text-gray-400 font-light">—</span>}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{b.subtitle || <span className="text-gray-400 font-light">—</span>}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{b.link || <span className="text-gray-400 font-light">—</span>}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{b.displayOrder}</td>
                  <td className="px-5 py-3 text-sm">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{
                        background: b.active ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.12)",
                        color: b.active ? "#16a34a" : "#dc2626",
                        fontFamily: SANS,
                      }}
                    >
                      {b.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(b)} className="p-1 hover:text-[#C9A227] transition-colors"><Edit size={15} /></button>
                      <button onClick={() => handleDelete(b._id)} className="p-1 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
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
                {editingId ? "Edit Banner" : "Add Banner"}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Title (Optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm"
                  style={{ fontFamily: SANS }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Subtitle (Optional)</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] text-sm"
                  style={{ fontFamily: SANS }}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Banner Image</label>
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

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Link Path (Optional)</label>
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
                Save Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
