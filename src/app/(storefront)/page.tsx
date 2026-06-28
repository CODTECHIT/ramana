"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  RefreshCcw,
  CreditCard,
  Truck,
  ArrowRight,
} from "lucide-react";
import {
  GoldDivider,
  SectionEyebrow,
  SectionHeading,
  GoldBtn,
} from "../../components/SharedUI";
import { ProductCard } from "../../components/ProductCard";
import { useCart } from "../../components/CartProvider";
import { I, COLLECTIONS, Constants } from "../../lib/mock-data";
import { useRouter } from "next/navigation";

const { GOLD, IVORY, CHARCOAL, MIST, SANS, SERIF } = Constants;

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:5000/api/categories").then((res) => res.json()),
      fetch("http://127.0.0.1:5000/api/products").then((res) => res.json()),
    ])
      .then(([cats, prods]) => {
        // Backend may return an error object (e.g. { message: 'Server Error' })
        // so ensure we only set an array of categories.
        if (Array.isArray(cats)) {
          setCategories(cats);
        } else if (cats && Array.isArray(cats.categories)) {
          setCategories(cats.categories);
        } else {
          console.error("Unexpected categories response:", cats);
          setCategories([]);
        }
        // Get 4 random products or just the first 4 active ones for bestsellers
        setProducts(prods.filter((p: any) => p.active).slice(0, 4));
      })
      .catch(console.error);
  }, []);

  const TRUST = [
    { icon: Shield, label: "BIS Hallmark Certified" },
    { icon: RefreshCcw, label: "Lifetime Exchange" },
    { icon: CreditCard, label: "Secure Payments" },
    { icon: Truck, label: "Easy Returns" },
  ];

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ height: "91vh", minHeight: 520 }}
      >
        <img
          src={I.hero}
          alt="South Indian bridal jewellery editorial"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Mobile Gradient Overlay (stronger at the bottom-left where text is positioned) */}
        <div
          className="absolute inset-0 block md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(20,16,12,0.95) 0%, rgba(20,16,12,0.7) 45%, rgba(20,16,12,0.2) 80%, transparent 100%)",
          }}
        />
        {/* Desktop Gradient Overlay */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(115deg, rgba(36,31,26,0.85) 0%, rgba(36,31,26,0.3) 55%, transparent 100%)",
          }}
        />
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:justify-center md:pb-0 px-8 md:px-20 max-w-3xl">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4 md:mb-5"
            style={{
              color: GOLD,
              fontFamily: SANS,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            The 2026 Bridal Collection
          </p>
          <h1
            className="text-4xl md:text-7xl font-normal leading-tight mb-4 md:mb-6"
            style={{
              fontFamily: SERIF,
              color: IVORY,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            Born of Gold,
            <br />
            <em>Worn Forever.</em>
          </h1>
          <p
            className="text-base md:text-lg mb-9 max-w-md leading-relaxed"
            style={{
              color: "rgba(250,247,242,0.9)",
              fontFamily: SANS,
              fontWeight: 300,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            Three generations of South Indian master craftsmen. Every piece
            hallmarked, every detail considered.
          </p>
          <div className="flex flex-wrap gap-4">
            <GoldBtn onClick={() => router.push("/collections/all")}>
              Explore Bridal
            </GoldBtn>
            <GoldBtn outline onClick={() => router.push("/collections/all")}>
              View Collections
            </GoldBtn>
          </div>
        </div>

        {/* Bottom gold accent bar */}
        <div
          className="absolute bottom-0 inset-x-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD} 40%, ${GOLD} 60%, transparent)`,
          }}
        />
      </section>

      {/* ── Shop by Category ──────────────────────────────────────────────── */}
      <section className="py-20 max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionEyebrow>Our Categories</SectionEyebrow>
          <SectionHeading center>Shop by Occasion</SectionHeading>
        </div>
        <div
          className="flex overflow-x-auto snap-x gap-4 md:gap-6 pb-4 md:pb-0 md:grid md:grid-cols-7"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex-shrink-0 w-28 md:w-auto flex flex-col items-center gap-3 group cursor-pointer snap-start"
              onClick={() => router.push(`/collections/${cat.slug}`)}
            >
              <div
                className="relative overflow-hidden rounded-full w-full aspect-square transition-all duration-300"
                style={{ background: MIST }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2.5px ${GOLD}`)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <img
                  src={cat.heroImage || cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p
                className="text-xs tracking-widest uppercase text-center leading-tight"
                style={{ color: CHARCOAL, fontFamily: SANS }}
              >
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6">
        <GoldDivider />
      </div>

      {/* ── Collections editorial ─────────────────────────────────────────── */}
      <section className="py-16 max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionEyebrow>Curated Edits</SectionEyebrow>
          <SectionHeading center>Collections</SectionHeading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLLECTIONS.map((col, i) => (
            <div
              key={col.title}
              className="relative overflow-hidden cursor-pointer group"
              style={{ background: MIST }}
              onClick={() => router.push("/collections/all")}
            >
              <div
                className="overflow-hidden"
                style={{ aspectRatio: i === 0 ? "3/4" : "4/5" }}
              >
                <img
                  src={col.img}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(36,31,26,0.88) 0%, rgba(36,31,26,0.1) 55%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  className="text-xl font-normal mb-2"
                  style={{ fontFamily: SERIF, color: IVORY }}
                >
                  {col.title}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: "rgba(250,247,242,0.65)", fontFamily: SANS }}
                >
                  {col.desc}
                </p>
                <span
                  className="text-xs tracking-widest uppercase flex items-center gap-2 transition-opacity hover:opacity-70"
                  style={{ color: GOLD, fontFamily: SANS }}
                >
                  {col.cta} <ArrowRight size={11} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6">
        <GoldDivider />
      </div>

      {/* ── Bestsellers ───────────────────────────────────────────────────── */}
      <section className="py-16 max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionEyebrow>Most Loved</SectionEyebrow>
          <SectionHeading center>Bestsellers</SectionHeading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} onAdd={addToCart} />
          ))}
        </div>
        <div className="text-center mt-12">
          <GoldBtn onClick={() => router.push("/collections/all")}>
            View All Jewellery
          </GoldBtn>
        </div>
      </section>

      {/* ── Trust badges ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#FDF9F3",
          borderTop: `1px solid rgba(201,162,39,0.12)`,
          borderBottom: `1px solid rgba(201,162,39,0.12)`,
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div
                  className="p-4"
                  style={{ border: `1px solid rgba(201,162,39,0.3)` }}
                >
                  <Icon size={20} style={{ color: GOLD }} />
                </div>
                <p
                  className="text-xs tracking-widest uppercase"
                  style={{ color: CHARCOAL, fontFamily: SANS }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: CHARCOAL }}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <SectionEyebrow>Stay Connected</SectionEyebrow>
          <h2
            className="text-3xl font-normal mb-4"
            style={{ fontFamily: SERIF, color: IVORY }}
          >
            The Ramana Jewells Circle
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(250,247,242,0.55)", fontFamily: SANS }}
          >
            Receive early access to new collections, exclusive offers, and
            invitations to private trunk shows.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm outline-none border sm:border-r-0"
              style={{
                background: "rgba(250,247,242,0.07)",
                color: IVORY,
                fontFamily: SANS,
                borderColor: "rgba(201,162,39,0.3)",
              }}
            />
            <button
              className="px-6 py-3 text-xs tracking-[0.18em] uppercase font-medium w-full sm:w-auto"
              style={{ background: GOLD, color: CHARCOAL, fontFamily: SANS }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
