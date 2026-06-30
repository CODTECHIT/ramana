"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, ShoppingCart, Heart, Clock } from "lucide-react";
import { EmptyState, PageHeader } from "../../../../components/dashboard/DashboardUI";
import { useCart } from "../../../../components/CartProvider";
import { useWishlist } from "../../../../components/WishlistProvider";
import { Constants, fmt, I } from "../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

const API = "http://localhost:5000";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

export default function RecentlyViewedPage() {
  const { addToCart } = useCart();
  const { toggleWishlist, inWishlist } = useWishlist();
  const [items, setItems] = useState<any[]>([]);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(`${API}/api/user/recently-viewed`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching recently viewed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedToCart(prev => new Set([...prev, product.slug]));
    setTimeout(() => setAddedToCart(prev => { const n = new Set(prev); n.delete(product.slug); return n; }), 2000);
  };

  const removeItem = async (slug: string) => {
    try {
      await fetch(`${API}/api/user/recently-viewed/${slug}`, { method: "DELETE", credentials: "include" });
      setItems(prev => prev.filter(i => i.slug !== slug));
    } catch (error) {
      console.error(error);
    }
  };

  const clearAll = async () => {
    try {
      await fetch(`${API}/api/user/recently-viewed`, { method: "DELETE", credentials: "include" });
      setItems([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Recently Viewed" subtitle={`${items.length} product${items.length !== 1 ? "s" : ""} viewed recently`} />
        {items.length > 0 && (
          <button onClick={clearAll} className="text-xs px-4 py-2 rounded-full border transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Eye size={36} />}
          title="No recently viewed products"
          description="Products you view will appear here for quick access."
          action={
            <Link href="/collections" className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: GOLD, color: IVORY }}>
              Browse Collections
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product: any) => {
            const wished = inWishlist(product.slug);
            const inCart = addedToCart.has(product.slug);
            return (
              <div
                key={product.slug}
                className="rounded-2xl border overflow-hidden flex flex-col shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                style={{ background: IVORY, borderColor: MIST }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Link href={`/product/${product.slug}`}>
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all hover:scale-110"
                    style={{ background: "white" }}
                  >
                    <Heart size={13} fill={wished ? "#e11d48" : "none"} stroke={wished ? "#e11d48" : SMOKE} />
                  </button>
                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(product.slug)}
                    className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow bg-white/90 hover:bg-white transition-all"
                    style={{ color: SMOKE }}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>

                {/* Info */}
                <div className="p-3.5 flex flex-col flex-1">
                  <Link href={`/product/${product.slug}`}>
                    <p className="text-xs font-semibold line-clamp-2 leading-snug hover:opacity-80 transition-opacity" style={{ color: CHARCOAL, fontFamily: SANS }}>
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-sm font-bold mt-1.5" style={{ color: GOLD, fontFamily: SERIF }}>{fmt(product.price)}</p>
                  <p className="text-xs flex items-center gap-1 mt-1.5" style={{ color: SMOKE }}>
                    <Clock size={12} /> {timeAgo(product.updatedAt || product.createdAt || new Date().toISOString())}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-semibold transition-all duration-300 w-full"
                    style={{ background: inCart ? "#059669" : GOLD, color: IVORY }}
                  >
                    <ShoppingCart size={12} />
                    {inCart ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
