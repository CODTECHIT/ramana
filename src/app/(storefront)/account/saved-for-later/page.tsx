"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, ShoppingCart, Heart, Trash2 } from "lucide-react";
import { EmptyState, PageHeader } from "../../../../components/dashboard/DashboardUI";
import { useCart } from "../../../../components/CartProvider";
import { useWishlist } from "../../../../components/WishlistProvider";
import { Constants, fmt, I } from "../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

const API = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`;

export default function SavedForLaterPage() {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moved, setMoved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch(`${API}/api/user/saved-items`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setSaved(data);
        }
      } catch (error) {
        console.error("Error fetching saved items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const remove = async (slug: string) => {
    try {
      await fetch(`${API}/api/user/saved-items/${slug}`, { method: "DELETE", credentials: "include" });
      setSaved(prev => prev.filter(p => p.slug !== slug));
    } catch (error) {
      console.error(error);
    }
  };

  const moveToCart = (product: any) => {
    addToCart(product);
    setMoved(prev => new Set([...prev, product.slug]));
    setTimeout(() => {
      remove(product.slug);
      setMoved(prev => { const n = new Set(prev); n.delete(product.slug); return n; });
    }, 1200);
  };

  const moveToWishlist = (product: any) => {
    toggleWishlist(product);
    remove(product.slug);
  };

  return (
    <div>
      <PageHeader title="Saved For Later" subtitle={`${saved.length} item${saved.length !== 1 ? "s" : ""} saved`} />

      {saved.length === 0 ? (
        <EmptyState
          icon={<Bookmark size={36} />}
          title="Nothing saved for later"
          description="Move items from your cart here to purchase them another time."
          action={
            <Link href="/cart" className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: GOLD, color: IVORY }}>
              Go to Cart
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {saved.map(product => {
            const justMoved = moved.has(product.slug);
            return (
              <div
                key={product.slug}
                className="rounded-2xl border overflow-hidden shadow-sm flex gap-4 p-4 transition-all duration-200 hover:shadow-md"
                style={{ background: IVORY, borderColor: MIST }}
              >
                {/* Image */}
                <Link href={`/product/${product.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product.slug}`}>
                    <p className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: CHARCOAL, fontFamily: SANS }}>
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-base font-bold mt-1" style={{ color: GOLD, fontFamily: SERIF }}>{fmt(product.price)}</p>
                  <p className="text-xs mt-1" style={{ color: SMOKE }}>Saved on {new Date(product.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => moveToCart(product)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                      style={{ background: justMoved ? "#059669" : GOLD, color: IVORY }}
                    >
                      <ShoppingCart size={12} />
                      {justMoved ? "Added!" : "Move to Cart"}
                    </button>
                    <button
                      onClick={() => moveToWishlist(product)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all hover:opacity-80"
                      style={{ borderColor: MIST, color: SMOKE }}
                    >
                      <Heart size={12} /> Move to Wishlist
                    </button>
                    <button
                      onClick={() => remove(product.slug)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all hover:opacity-80"
                      style={{ borderColor: MIST, color: "#dc2626" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
