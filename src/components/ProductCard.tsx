"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Constants, fmt } from "../lib/mock-data";
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
  const [wished, setWished] = useState(false);

  const onNavigate = () => router.push(`/product/${product.slug}`);

  const img1 = product.images?.[0] || product.img || "";
  const img2 = product.images?.[1] || product.img2 || img1;
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
        <img
          src={img1}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hov ? 0 : 1 }}
        />
        {/* Secondary image (hover) */}
        <img
          src={img2}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hov ? 1 : 0 }}
        />

        {tag && (
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
        )}

        <button
          className="absolute top-3 right-3 p-2"
          style={{ background: "rgba(250,247,242,0.9)" }}
          onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
        >
          <Heart size={15} fill={wished ? MAROON : "none"} stroke={wished ? MAROON : CHARCOAL} />
        </button>

        {/* Add to cart overlay */}
        <div
          className="absolute bottom-0 inset-x-0 p-3 transition-all duration-300"
          style={{ opacity: hov ? 1 : 0, background: "rgba(36,31,26,0.72)" }}
        >
          <button
            className="w-full py-2 text-xs tracking-widest uppercase"
            style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (onAdd) onAdd(product); 
            }}
          >
            Add to Cart
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
          {product.weight ? `Wt: ${product.weight} · ` : ""}22KT BIS Hallmark
        </p>
      </div>
    </div>
  );
}
