"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Check, ChevronLeft } from "lucide-react";
import { ProductCard } from "../../../../components/ProductCard";
import { useCart } from "../../../../components/CartProvider";
import { Constants, fmt } from "../../../../lib/mock-data";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params?.category as string;
  const { addToCart } = useCart();
  const [priceMax, setPriceMax] = useState(900000);
  const [selected, setSelected] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const occasions = ["Bridal", "Festival", "Daily Wear", "Engagement", "Anniversary"];
  const purities  = ["22KT", "18KT", "24KT"];
  const toggle    = (o: string) =>
    setSelected((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));

  useEffect(() => {
    const url = categorySlug && categorySlug !== "all" 
      ? `http://127.0.0.1:5000/api/products?category=${categorySlug}`
      : "http://127.0.0.1:5000/api/products";

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setProducts(data.filter((p: any) => p.active));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug]);

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs tracking-wider uppercase mb-10"
          style={{ color: SMOKE, fontFamily: SANS }}
        >
          <Link href="/" style={{ color: GOLD }}>Home</Link>
          <ChevronRight size={12} />
          <span style={{ color: CHARCOAL }}>Collections</span>
        </nav>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <h3 className="text-base mb-6" style={{ fontFamily: SERIF, color: CHARCOAL }}>Refine</h3>

            {/* Price */}
            <div className="pb-6 mb-6" style={{ borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD, fontFamily: SANS }}>
                Price Range
              </p>
              <input
                type="range" min={10000} max={900000} value={priceMax}
                onChange={(e) => setPriceMax(+e.target.value)}
                className="w-full mb-2"
                style={{ accentColor: GOLD }}
              />
              <div className="flex justify-between text-xs" style={{ color: SMOKE, fontFamily: SANS }}>
                <span>₹10,000</span>
                <span>{fmt(priceMax)}</span>
              </div>
            </div>

            {/* Occasion */}
            <div className="pb-6 mb-6" style={{ borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD, fontFamily: SANS }}>
                Occasion
              </p>
              <div className="space-y-2.5">
                {occasions.map((o) => (
                  <label key={o} className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggle(o)}>
                    <div
                      className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{
                        border: `1px solid ${selected.includes(o) ? GOLD : "rgba(36,31,26,0.25)"}`,
                        background: selected.includes(o) ? GOLD : "transparent",
                      }}
                    >
                      {selected.includes(o) && <Check size={10} color={IVORY} />}
                    </div>
                    <span className="text-sm" style={{ color: CHARCOAL, fontFamily: SANS }}>{o}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Purity */}
            <div className="pb-6" style={{ borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD, fontFamily: SANS }}>
                Gold Purity
              </p>
              <div className="space-y-2.5">
                {purities.map((p) => (
                  <label key={p} className="flex items-center gap-2.5 cursor-pointer">
                    <div className="w-4 h-4 rounded-full" style={{ border: `1px solid rgba(36,31,26,0.25)` }} />
                    <span className="text-sm" style={{ color: CHARCOAL, fontFamily: SANS }}>{p} Gold</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-normal" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                  All Jewellery
                </h1>
                <p className="text-sm mt-1" style={{ color: SMOKE, fontFamily: SANS }}>
                  Showing {products.length} pieces
                </p>
              </div>
              <select
                className="px-4 py-2 text-xs tracking-wider uppercase outline-none"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "transparent", color: CHARCOAL, fontFamily: SANS }}
              >
                <option>Sort: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  onAdd={addToCart}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1.5 mt-14">
              <button className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, color: CHARCOAL }}>
                <ChevronLeft size={13} />
              </button>
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className="w-8 h-8 flex items-center justify-center text-sm"
                  style={{
                    background: n === 1 ? GOLD : "transparent",
                    color: n === 1 ? IVORY : CHARCOAL,
                    border: `1px solid ${n === 1 ? GOLD : "rgba(201,162,39,0.3)"}`,
                    fontFamily: SANS,
                  }}
                >
                  {n}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, color: CHARCOAL }}>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
