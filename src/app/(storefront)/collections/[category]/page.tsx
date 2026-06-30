"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Check, ChevronLeft } from "lucide-react";
import { ProductCard } from "../../../../components/ProductCard";
import { useCart } from "../../../../components/CartProvider";
import { Constants, fmt } from "../../../../lib/mock-data";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params?.category as string;
  const searchQuery = searchParams?.get("search") || "";
  const { addToCart } = useCart();

  const [priceMax, setPriceMax] = useState(900000);
  const [selected, setSelected] = useState<string[]>([]);
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);

  const occasions = ["Bridal", "Festival", "Daily Wear", "Engagement", "Anniversary"];

  const toggle = (o: string) => {
    setSelected((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
    setCurrentPage(1);
  };

  const handlePriceChange = (val: number) => {
    setPriceMax(val);
    setCurrentPage(1);
  };

  useEffect(() => {
    let url = "http://localhost:5000/api/products";
    const queries = [];
    if (categorySlug && categorySlug !== "all") {
      queries.push(`category=${categorySlug}`);
    }
    if (searchQuery) {
      queries.push(`search=${encodeURIComponent(searchQuery)}`);
    }
    if (queries.length > 0) {
      url += "?" + queries.join("&");
    }

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setRawProducts(data.filter((p: any) => p.active));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug, searchQuery]);

  // Local Filtering
  const filteredProducts = rawProducts.filter((p) => {
    // Filter by price range
    if (p.price > priceMax) return false;

    // Filter by occasion
    if (selected.length > 0) {
      const matchesOccasion = selected.some((occ) => {
        const oLower = occ.toLowerCase();
        return (
          p.tags?.some((t: string) => t.toLowerCase() === oLower) ||
          p.name?.toLowerCase().includes(oLower) ||
          p.description?.toLowerCase().includes(oLower)
        );
      });
      if (!matchesOccasion) return false;
    }

    return true;
  });

  // Local Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "LowToHigh") return a.price - b.price;
    if (sortBy === "HighToLow") return b.price - a.price;
    if (sortBy === "Newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    return 0; // Default Featured
  });

  // Local Pagination
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = sortedProducts.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const categoryDisplayName = categorySlug && categorySlug !== "all"
    ? (rawProducts[0]?.category?.name || categorySlug.replace(/-/g, " "))
    : "All Jewellery";

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
                onChange={(e) => handlePriceChange(+e.target.value)}
                className="w-full mb-2 cursor-pointer"
                style={{ accentColor: GOLD }}
              />
              <div className="flex justify-between text-xs" style={{ color: SMOKE, fontFamily: SANS }}>
                <span>₹10,000</span>
                <span>{fmt(priceMax)}</span>
              </div>
            </div>

            {/* Occasion */}
            <div className="pb-6" style={{ borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD, fontFamily: SANS }}>
                Occasion
              </p>
              <div className="space-y-2.5">
                {occasions.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className="flex items-center gap-2.5 cursor-pointer text-left w-full bg-transparent border-0 focus:outline-none"
                    onClick={() => toggle(o)}
                  >
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
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-normal capitalize" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                  {categoryDisplayName}
                </h1>
                <p className="text-sm mt-1" style={{ color: SMOKE, fontFamily: SANS }}>
                  Showing {filteredProducts.length} pieces
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 text-xs tracking-wider uppercase outline-none cursor-pointer"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "transparent", color: CHARCOAL, fontFamily: SANS }}
              >
                <option value="Featured">Sort: Featured</option>
                <option value="LowToHigh">Price: Low to High</option>
                <option value="HighToLow">Price: High to Low</option>
                <option value="Newest">Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-h-[300px]">
              {paginatedProducts.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  onAdd={addToCart}
                />
              ))}
              {paginatedProducts.length === 0 && (
                <div className="col-span-full py-20 text-center text-sm text-gray-500" style={{ fontFamily: SANS }}>
                  No products match the selected criteria.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-14">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={activePage === 1}
                  className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60 disabled:opacity-30 cursor-pointer"
                  style={{ border: `1px solid rgba(201,162,39,0.3)`, color: CHARCOAL }}
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCurrentPage(n)}
                    className="w-8 h-8 flex items-center justify-center text-sm cursor-pointer"
                    style={{
                      background: n === activePage ? GOLD : "transparent",
                      color: n === activePage ? IVORY : CHARCOAL,
                      border: `1px solid ${n === activePage ? GOLD : "rgba(201,162,39,0.3)"}`,
                      fontFamily: SANS,
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={activePage === totalPages}
                  className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60 disabled:opacity-30 cursor-pointer"
                  style={{ border: `1px solid rgba(201,162,39,0.3)`, color: CHARCOAL }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
