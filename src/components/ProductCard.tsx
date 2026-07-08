"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Constants, fmt, I } from "../lib/mock-data";
import { useWishlist } from "./WishlistProvider";
import { useRouter } from "next/navigation";

const { GOLD, MAROON, IVORY, CHARCOAL, MIST, SMOKE, SANS, SERIF } = Constants;

export function ProductCard({
  product,
  onAdd,
}: {
  product: any;
  onAdd?: (p: any) => void;
}) {
  const router = useRouter();
  const [hov, setHov] = useState(false);
  const { toggleWishlist, inWishlist } = useWishlist();

  const onNavigate = () => router.push(`/product/${product.slug}`);

  const img1 = product.images?.[0] || product.img || "";
  const img2 = product.images?.[1] || product.img2 || "";
  const tag = product.tags?.[0] || product.tag || "";
  const categoryName = typeof product.category === 'object' ? product.category.name : product.category;

  return (
    <div style={{ background: "#FDF9F3" }}>
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ aspectRatio: "3/4", background: MIST }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onNavigate}
      >
        {/* Primary image */}
        {img1 && (
          <img
            src={img1}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: hov && img2 ? 0 : 1 }}
          />
        )}
        {/* Secondary image (hover) */}
        {img2 && (
          <img
            src={img2}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: hov ? 1 : 0 }}
          />
        )}

        {product.stock === 0 ? (
          <span
            className="absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1"
            style={{ background: CHARCOAL, color: IVORY, fontFamily: SANS }}
          >
            Out of Stock
          </span>
        ) : product.stock <= 5 ? (
          <span
            className="absolute top-3 left-3 text-[10px] tracking-widest uppercase px-2 py-1"
            style={{ background: MAROON, color: IVORY, fontFamily: SANS }}
          >
            Fast Selling - Only {product.stock} Left!
          </span>
        ) : tag ? (
          <span
            className="absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1"
            style={{
              background: tag?.toLowerCase() === "new" ? MAROON : GOLD,
              color: IVORY,
              fontFamily: SANS,
            }}
          >
            {tag}
          </span>
        ) : null}

        <button
          className="absolute top-3 right-3 p-2"
          style={{ background: "rgba(250,247,242,0.9)" }}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
        >
          <Heart size={15} fill={inWishlist(product.slug) ? MAROON : "none"} stroke={inWishlist(product.slug) ? MAROON : CHARCOAL} />
        </button>

        {/* Add to cart overlay */}
        <div
          className="absolute bottom-0 inset-x-0 p-3 transition-all duration-300"
          style={{ opacity: hov ? 1 : 0, background: "rgba(36,31,26,0.72)" }}
        >
          <button
            className="w-full py-2 text-xs tracking-widest uppercase transition-opacity disabled:opacity-50"
            style={{ background: product.stock === 0 ? CHARCOAL : GOLD, color: IVORY, fontFamily: SANS }}
            disabled={product.stock === 0}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (product.stock > 0 && onAdd) onAdd(product); 
            }}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: GOLD, fontFamily: SANS }}>
          {categoryName}
        </p>
        <h3
          className="mb-1 leading-snug cursor-pointer"
          style={{ fontFamily: SERIF, color: CHARCOAL, fontSize: "0.92rem" }}
          onClick={onNavigate}
        >
          {product.name}
        </h3>
        <p className="text-sm font-medium" style={{ fontFamily: SANS, color: CHARCOAL }}>
          {fmt(product.price)}
        </p>
        <p className="text-xs mt-0.5" style={{ color: SMOKE, fontFamily: SANS }}>
          {product.weight ? `Wt: ${product.weight} · ` : ""}Premium Gold Finish
        </p>
      </div>
    </div>
  );
}
