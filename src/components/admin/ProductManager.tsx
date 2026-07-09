"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, UploadCloud, XCircle } from "lucide-react";
import { Constants } from "../../lib/mock-data";

const { GOLD, SANS, MIST } = Constants;

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  details: string[];
  setContents?: string[];
  sizes?: string[];
  category: Category;
  images: string[];
  colors?: { name: string; images: string[] }[];
  tags: string[];
  active: boolean;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    stock: 0,
    description: "",
    details: "", // will split by newline
    setContents: "",
    sizes: "",
    category: "",
    images: [] as string[],
    colors: [] as { name: string; images: string[] }[],
    tags: "", // will split by comma
    active: true,
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`)
      ]);
      const pData = await prodRes.json();
      const cData = await catRes.json();
      setProducts(pData);
      setCategories(cData);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      name: "", slug: "", price: 0, stock: 0, description: "",
      details: "", setContents: "", sizes: "", category: categories[0]?._id || "", images: [], colors: [], tags: "", active: true
    });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      slug: p.slug,
      price: p.price,
      stock: p.stock,
      description: p.description,
      details: p.details?.join("\n") || "",
      setContents: p.setContents?.join("\n") || "",
      sizes: p.sizes?.join(", ") || "",
      category: p.category?._id || "",
      images: p.images || [],
      colors: p.colors || [],
      tags: p.tags?.join(", ") || "",
      active: p.active,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorIndex: number = -1) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const target = e.target;

    try {
      setUploading(true);
      // 1. Get signature from backend
      const sigRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/upload/signature`, {
        credentials: "include"
      });
      if (!sigRes.ok) throw new Error("Could not get upload signature");
      
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      // 2. Upload direct to Cloudinary
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("api_key", apiKey);
      formDataUpload.append("timestamp", timestamp.toString());
      formDataUpload.append("signature", signature);
      formDataUpload.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formDataUpload,
      });

      const uploadedData = await uploadRes.json();
      if (uploadedData.secure_url) {
        if (colorIndex >= 0) {
          setFormData(prev => {
            const newColors = [...prev.colors];
            newColors[colorIndex].images.push(uploadedData.secure_url);
            return { ...prev, colors: newColors };
          });
        } else {
          setFormData(prev => ({ ...prev, images: [...prev.images, uploadedData.secure_url] }));
        }
      } else {
        alert("Cloudinary upload failed");
      }
    } catch (err: any) {
      console.error("Product Image Upload Error:", err);
      alert("Error uploading image: " + err.message);
    } finally {
      setUploading(false);
      // Reset input
      if (target) target.value = "";
    }
  };

  const removeImage = (idx: number, colorIndex: number = -1) => {
    if (colorIndex >= 0) {
      setFormData(prev => {
        const newColors = [...prev.colors];
        newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== idx);
        return { ...prev, colors: newColors };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== idx)
      }));
    }
  };

  const addColor = () => {
    setFormData(prev => ({ ...prev, colors: [...prev.colors, { name: "", images: [] }] }));
  };

  const removeColor = (idx: number) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        details: formData.details.split("\n").map(s => s.trim()).filter(Boolean),
        setContents: formData.setContents.split("\n").map(s => s.trim()).filter(Boolean),
        sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
        tags: formData.tags.split(",").map(s => s.trim()).filter(Boolean),
      };

      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/products/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/products`;
      
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Operation failed");
        return;
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Network error saving product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete");
        return;
      }
      fetchData();
    } catch (err) {
      alert("Network error.");
    }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Products</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase text-white rounded transition-opacity hover:opacity-90"
          style={{ background: GOLD, fontFamily: SANS }}
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {["Image", "Name", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p._id} style={{ borderBottom: i < products.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                <td className="px-5 py-3">
                  <div className="w-10 h-10 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">No Img</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS, maxWidth: 200 }}>{p.name}</td>
                <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{p.category?.name || "None"}</td>
                <td className="px-5 py-3 text-sm" style={{ color: "#374151", fontFamily: SANS }}>₹{p.price}</td>
                <td className="px-5 py-3 text-sm" style={{ color: p.stock <= 5 ? "#dc2626" : "#374151", fontFamily: SANS }}>{p.stock}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: p.active ? "#dcfce7" : "#fef9c3", color: p.active ? "#16a34a" : "#ca8a04", fontFamily: SANS }}>
                    {p.active ? "Active" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:opacity-60 transition-opacity" style={{ color: "#6B7280" }}><Edit size={13} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 hover:opacity-60 transition-opacity" style={{ color: "#dc2626" }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center shrink-0" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <h3 className="font-medium text-[#1A1A2E]" style={{ fontFamily: SANS }}>
                {editingId ? "Edit Product" : "New Product"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: SANS }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Name</label>
                    <input required type="text" value={formData.name} onChange={e => {
                      const val = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, name: val, slug: !editingId ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-') : prev.slug 
                      }));
                    }} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Slug</label>
                    <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Price (₹)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Stock</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]">
                      <option value="" disabled>Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Images (Cloudinary) - Default</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 border rounded overflow-hidden">
                        <img src={img} alt="Product upload" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 text-red-500 bg-white rounded-full"><XCircle size={14} /></button>
                      </div>
                    ))}
                    {formData.images.length === 0 && <div className="text-xs text-gray-400 py-4">No images uploaded</div>}
                  </div>
                  <div className="relative inline-block">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e)}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                    />
                    <div className="flex items-center gap-2 px-3 py-1.5 border rounded bg-gray-50 text-sm text-gray-600">
                      <UploadCloud size={16} /> {uploading ? "Uploading..." : "Add Image"}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase tracking-wider text-gray-600">Color Variants</label>
                    <button type="button" onClick={addColor} className="text-xs text-blue-600 font-medium">+ Add Color</button>
                  </div>
                  {formData.colors.map((color, colorIdx) => (
                    <div key={colorIdx} className="p-3 border rounded mb-3 bg-gray-50/50">
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Color Name (e.g. Rose Gold)"
                          value={color.name}
                          onChange={e => {
                            const newColors = [...formData.colors];
                            newColors[colorIdx].name = e.target.value;
                            setFormData(prev => ({ ...prev, colors: newColors }));
                          }}
                          className="flex-1 p-2 border rounded text-sm outline-none focus:border-[#C9A227]"
                        />
                        <button type="button" onClick={() => removeColor(colorIdx)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {color.images.map((img, i) => (
                          <div key={i} className="relative w-16 h-16 border rounded overflow-hidden">
                            <img src={img} alt="Color variant upload" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImage(i, colorIdx)} className="absolute top-0.5 right-0.5 text-red-500 bg-white rounded-full"><XCircle size={14} /></button>
                          </div>
                        ))}
                      </div>
                      {color.images.length < 10 && (
                        <div className="relative inline-block">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, colorIdx)}
                            disabled={uploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                          />
                          <div className="flex items-center gap-2 px-3 py-1.5 border rounded bg-white text-sm text-gray-600">
                            <UploadCloud size={16} /> {uploading ? "Uploading..." : `Add Image (${color.images.length}/10)`}
                          </div>
                        </div>
                      )}
                      {color.images.length >= 10 && (
                        <div className="text-xs text-amber-600 mt-1">Maximum 10 images reached for this color.</div>
                      )}
                    </div>
                  ))}
                  {formData.colors.length === 0 && <p className="text-xs text-gray-400">No color variants added.</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Description</label>
                  <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Details (One per line)</label>
                  <textarea rows={3} value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" placeholder="24K Pure Gold&#10;Hallmarked&#10;Includes certificate" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Set Contents (One per line, Optional)</label>
                  <textarea rows={3} value={formData.setContents} onChange={e => setFormData({ ...formData, setContents: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" placeholder="Necklace with extender chain&#10;Matching jhumka earrings&#10;Velvet jewellery box" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Sizes/Length (Comma separated, Optional)</label>
                    <input type="text" value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" placeholder='16", 18", 20"' />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs uppercase tracking-wider mb-1 text-gray-600">Tags (Comma separated)</label>
                    <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full p-2 border rounded text-sm outline-none focus:border-[#C9A227]" placeholder="bestseller, new arrival, wedding" />
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <input type="checkbox" id="activeProd" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} />
                    <label htmlFor="activeProd" className="text-sm">Active</label>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="px-6 py-4 border-t flex gap-3 shrink-0 bg-gray-50">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded text-sm hover:bg-white bg-transparent">Cancel</button>
              <button type="submit" form="productForm" className="flex-1 py-2 text-white rounded text-sm hover:opacity-90" style={{ background: GOLD }}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
