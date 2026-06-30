"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Share2, Trash2, Bell } from "lucide-react";
import { EmptyState, PageHeader } from "../../../../components/dashboard/DashboardUI";
import { useWishlist } from "../../../../components/WishlistProvider";
import { useCart } from "../../../../components/CartProvider";
import { Constants, fmt, I } from "../../../../lib/mock-data";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [moved, setMoved] = useState<Set<string>>(new Set());

  const items = wishlist;

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setMoved(prev => new Set([...prev, product.slug]));
    setTimeout(() => setMoved(prev => { const n = new Set(prev); n.delete(product.slug); return n; }), 2000);
  };

  const discount = (orig: number, cur: number) => Math.round(((orig - cur) / orig) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="My Wishlist" subtitle={`${items.length} item${items.length !== 1 ? "s" : ""} saved`} />
        <button className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>
          <Share2 size={14} /> Share Wishlist
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart size={36} />}
          title="Your wishlist is empty"
          description="Save items you love and come back to them anytime."
          action={
            <Link href="/collections" className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: GOLD, color: IVORY }}>
              Explore Collections
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((product: any) => {
            const justAdded = moved.has(product.slug);
            return (
              <div
                key={product.slug}
                className="rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col"
                style={{ background: IVORY, borderColor: MIST }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={product.img || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#DC2626", color: "white" }}>
                      -{discount(product.originalPrice, product.price)}%
                    </div>
                  )}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all hover:scale-110"
                    style={{ background: IVORY }}
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/product/${product.slug}`}>
                    <p className="text-sm font-semibold leading-snug line-clamp-2 hover:opacity-80 transition-opacity" style={{ color: CHARCOAL, fontFamily: SANS }}>
                      {product.name}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-bold" style={{ color: GOLD, fontFamily: SERIF }}>{fmt(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs line-through" style={{ color: SMOKE }}>{fmt(product.originalPrice)}</span>
                    )}
                  </div>

                  {/* Price Alert */}
                  <button className="flex items-center gap-1.5 mt-2 text-xs px-3 py-1.5 rounded-full border w-fit transition-all hover:opacity-80" style={{ borderColor: MIST, color: SMOKE }}>
                    <Bell size={11} /> Price Drop Alert
                  </button>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                    style={{
                      background: justAdded ? "#059669" : GOLD,
                      color: IVORY,
                    }}
                  >
                    <ShoppingCart size={14} />
                    {justAdded ? "Added to Cart!" : "Add to Cart"}
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
