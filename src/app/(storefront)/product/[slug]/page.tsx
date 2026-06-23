"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  Star,
  Minus,
  Plus,
  Heart,
  MessageCircle,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  GoldBtn,
  SectionEyebrow,
  SectionHeading,
} from "../../../../components/SharedUI";
import { ProductCard } from "../../../../components/ProductCard";
import { useCart } from "../../../../components/CartProvider";
import { I, Constants, fmt } from "../../../../lib/mock-data";
import Link from "next/link";
import { useParams } from "next/navigation";

const { GOLD, CHARCOAL, IVORY, MIST, MAROON, SMOKE, SANS, SERIF } = Constants;

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('18"');
  const [tab, setTab] = useState("details");
  const [setOpen, setSetOpen] = useState(true);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`http://127.0.0.1:5000/api/products/${slug}`).then((r) => r.json()),
      fetch("http://127.0.0.1:5000/api/products").then((r) => r.json()),
    ])
      .then(([p, all]) => {
        setProduct(p);
        setRelated(
          all.filter((x: any) => x.active && x._id !== p._id).slice(0, 4),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product)
    return <div className="p-20 text-center">Product not found</div>;

  const imgs = product.images?.length ? product.images : [I.display];
  const sizes = ['16"', '18"', '20"', '22"', '24"'];

  const TABS = [
    {
      id: "details",
      label: "Product Details",
      content:
        "Crafted in 22KT BIS Hallmark certified gold. Stone: Uncut polypki diamonds and natural rubies. Setting: Traditional Thewa work with meenakari enamel on reverse. Finish: Antique matte with selective polished highlights. Total gold weight: 45.2g. Dimensions: 48cm chain length, pendant 6.2cm × 4.8cm.",
    },
    {
      id: "care",
      label: "Care Instructions",
      content:
        "Store in the velvet-lined box provided, away from direct sunlight. Clean gently with a soft dry cloth. Avoid contact with perfume, hairspray, and chlorine. For deep cleaning, bring to any Ramana Jewells store — complimentary for the lifetime of the piece.",
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content:
        "Free insured shipping across India via Blue Dart. Delivery in 3–5 business days. International shipping available to 35+ countries. 7-day returns on unworn, unaltered pieces in original packaging. 30-day exchange — value credited against your next purchase.",
    },
  ];

  const SET_CONTENTS = [
    "Necklace with extender chain",
    "Matching jhumka earrings",
    "Velvet jewellery box",
    "Authenticity certificate",
    "BIS Hallmark assay card",
  ];

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>
      <div className="max-w-screen-xl mx-auto md:px-6 md:py-10 pb-28 md:pb-0">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs tracking-wider uppercase mb-6 md:mb-10 px-6 md:px-0 pt-6 md:pt-0"
          style={{ color: SMOKE, fontFamily: SANS }}
        >
          <Link href="/" style={{ color: GOLD }}>
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/collections/${product.category?.slug || "all"}`}
            style={{ color: GOLD }}
          >
            {product.category?.name || "Category"}
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: CHARCOAL }}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-20">
          {/* Image gallery */}
          <div>
            <div
              className="relative overflow-hidden mb-3"
              style={{ aspectRatio: "3/4", background: MIST }}
            >
              <img
                src={imgs[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.tags && product.tags.length > 0 && (
                <span
                  className="absolute top-4 left-4 text-xs tracking-widest uppercase px-2 py-1"
                  style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
                >
                  {product.tags[0]}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {imgs.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="flex-1 overflow-hidden"
                  style={{
                    aspectRatio: "1",
                    border: `1.5px solid ${activeImg === i ? GOLD : "transparent"}`,
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="px-6 md:px-0">
            <p
              className="text-xs tracking-widest uppercase mb-2"
              style={{ color: GOLD, fontFamily: SANS }}
            >
              {product.category?.name || "Category"} · 22KT Gold
            </p>
            <h1
              className="text-3xl font-normal leading-snug mb-3"
              style={{ fontFamily: SERIF, color: CHARCOAL }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-3">
              <p
                className="text-2xl font-light"
                style={{ fontFamily: SERIF, color: CHARCOAL }}
              >
                {fmt(product.price)}
              </p>
              <span
                className="text-xs px-2 py-1"
                style={{
                  background: "rgba(201,162,39,0.1)",
                  color: GOLD,
                  fontFamily: SANS,
                }}
              >
                Wt: {product.details?.[0] || product.weight || "10g"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill={GOLD} color={GOLD} />
              ))}
              <span
                className="text-xs ml-1"
                style={{ color: SMOKE, fontFamily: SANS }}
              >
                4.9 (128 reviews)
              </span>
            </div>

            <p
              className="text-sm leading-relaxed mb-7"
              style={{ color: SMOKE, fontFamily: SANS }}
            >
              {product.description ||
                "An heirloom-grade bridal piece inspired by the architectural splendour of South Indian temples. Crafted in 22KT gold."}
            </p>

            {/* Chain length */}
            <div className="mb-6">
              <p
                className="text-xs tracking-wider uppercase mb-3"
                style={{ color: CHARCOAL, fontFamily: SANS }}
              >
                Size/Length: <strong>{size}</strong>
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="px-3 py-1.5 text-xs transition-all"
                    style={{
                      border: `1px solid ${size === s ? GOLD : "rgba(36,31,26,0.2)"}`,
                      background: size === s ? GOLD : "transparent",
                      color: size === s ? IVORY : CHARCOAL,
                      fontFamily: SANS,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Set contents accordion */}
            <div
              className="mb-6"
              style={{ border: `1px solid rgba(201,162,39,0.2)` }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3"
                onClick={() => setSetOpen(!setOpen)}
              >
                <span
                  className="text-xs tracking-wider uppercase"
                  style={{ color: CHARCOAL, fontFamily: SANS }}
                >
                  Set Contents
                </span>
                <ChevronDown
                  size={14}
                  style={{
                    color: GOLD,
                    transform: setOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {setOpen && (
                <div
                  className="px-4 pb-4"
                  style={{ borderTop: `1px solid rgba(201,162,39,0.12)` }}
                >
                  <ul className="mt-3 space-y-1.5">
                    {SET_CONTENTS.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: SMOKE, fontFamily: SANS }}
                      >
                        <Check
                          size={11}
                          style={{ color: GOLD, flexShrink: 0 }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Qty + CTA */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div
                className="flex items-center"
                style={{ border: `1px solid rgba(201,162,39,0.3)` }}
              >
                <button
                  className="px-3 py-2.5 hover:opacity-60 transition-opacity"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus size={13} style={{ color: CHARCOAL }} />
                </button>
                <span
                  className="px-4 text-sm"
                  style={{ color: CHARCOAL, fontFamily: SANS }}
                >
                  {qty}
                </span>
                <button
                  className="px-3 py-2.5 hover:opacity-60 transition-opacity"
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus size={13} style={{ color: CHARCOAL }} />
                </button>
              </div>
              <GoldBtn onClick={() => addToCart(product)}>Add to Cart</GoldBtn>
              <button
                onClick={() => setWished(!wished)}
                className="p-2.5 transition-colors"
                style={{ border: `1px solid rgba(201,162,39,0.3)` }}
              >
                <Heart
                  size={17}
                  fill={wished ? MAROON : "none"}
                  stroke={wished ? MAROON : CHARCOAL}
                />
              </button>
            </div>

            {/* WhatsApp */}
            <button
              className="w-full py-3 flex items-center justify-center gap-2 text-sm tracking-wide mb-6"
              style={{ background: "#25D366", color: "#fff", fontFamily: SANS }}
            >
              <MessageCircle size={16} /> Enquire on WhatsApp
            </button>

            {/* Mini trust */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {[
                "BIS Hallmark 916",
                "Lifetime Exchange",
                "Free Insured Shipping",
                "Secure Checkout",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check size={11} style={{ color: GOLD, flexShrink: 0 }} />
                  <span
                    className="text-xs"
                    style={{ color: SMOKE, fontFamily: SANS }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20 px-6 md:px-0">
          <div
            className="flex overflow-x-auto whitespace-nowrap"
            style={{
              borderBottom: `1px solid rgba(201,162,39,0.18)`,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-6 py-3 text-xs tracking-widest uppercase transition-colors"
                style={{
                  color: tab === t.id ? GOLD : SMOKE,
                  borderBottom: `2px solid ${tab === t.id ? GOLD : "transparent"}`,
                  fontFamily: SANS,
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="py-6 max-w-2xl">
            <p
              className="text-sm leading-relaxed"
              style={{ color: SMOKE, fontFamily: SANS }}
            >
              {TABS.find((t) => t.id === tab)?.content}
            </p>
          </div>
        </div>

        {/* Related products */}
        <section className="px-6 md:px-0">
          <div className="mb-10">
            <SectionEyebrow>You May Also Like</SectionEyebrow>
            <SectionHeading>Related Pieces</SectionHeading>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 z-50 md:hidden flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        style={{
          background: IVORY,
          borderTop: `1px solid rgba(201,162,39,0.12)`,
        }}
      >
        <button
          className="flex-1 py-3 text-xs tracking-[0.18em] uppercase font-medium transition-opacity hover:opacity-90"
          style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
        <button
          className="flex items-center justify-center p-3 transition-opacity hover:opacity-90"
          style={{ background: "#25D366", color: "#fff", fontFamily: SANS }}
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </main>
  );
}
