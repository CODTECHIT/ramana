"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  RefreshCcw,
  CreditCard,
  Truck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
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
import Image from "next/image";

const { GOLD, IVORY, CHARCOAL, MIST, SANS, SERIF } = Constants;

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?active=true&limit=4`).then((res) => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/banners`).then((res) => res.json()).catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/collections`).then((res) => res.json()).catch(() => []),
    ])
      .then(([cats, prods, bans, cols]) => {
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
        
        if (Array.isArray(prods)) {
          setProducts(prods);
        } else {
          setProducts([]);
        }
        
        if (Array.isArray(bans)) {
          setBanners(bans);
        }
        if (Array.isArray(cols) && cols.length > 0) {
          setCollections(cols);
        } else {
          setCollections(COLLECTIONS);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const TRUST = [
    { icon: Shield, label: "Certified Quality" },
    { icon: RefreshCcw, label: "Lifetime Exchange" },
    { icon: CreditCard, label: "Secure Payments" },
    { icon: Truck, label: "Easy Returns" },
  ];

  const currentHero = banners.length > 0 ? banners[activeBannerIdx] : null;
  const heroImageSrc = currentHero?.image || I.hero;
  const heroTitle = currentHero?.title || "Timeless Elegance,";
  const heroSubtitle = currentHero?.subtitle || "Three generations of South Indian master craftsmen. Intricately designed, every detail considered.";
  const heroLink = currentHero?.link || "/collections/all";

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden transition-all duration-700 ease-in-out bg-[#FDF9F3]"
        style={{ height: "91vh", minHeight: 520 }}
      >
          <Image
            src={heroImageSrc}
            alt={currentHero?.title || "South Indian bridal jewellery editorial"}
            fill
            priority
            fetchPriority="high"
            quality={60}
            className="object-cover transition-all duration-700 transform scale-100"
            key={heroImageSrc}
          />
        {/* Mobile Gradient Overlay */}
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
        <div className="relative z-10 h-full w-full max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col justify-end pb-10 md:justify-center md:pb-0">
          <div className="max-w-3xl">
            <p
              className="text-xs tracking-[0.4em] uppercase mb-4 md:mb-5"
              style={{
                color: GOLD,
                fontFamily: SANS,
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
            {currentHero ? "Featured Collections" : "The 2026 Bridal Collection"}
          </p>
          <h1
            className="text-4xl md:text-7xl font-normal leading-tight mb-4 md:mb-6"
            style={{
              fontFamily: SERIF,
              color: IVORY,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            {currentHero ? (
              <span>{heroTitle}</span>
            ) : (
              <>
                Born of Gold,
                <br />
                <em>Worn Forever.</em>
              </>
            )}
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
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <GoldBtn onClick={() => router.push(heroLink)}>
              Explore Now
            </GoldBtn>
            {!currentHero && (
              <GoldBtn outline onClick={() => router.push("/collections/all")}>
                View Collections
              </GoldBtn>
            )}
          </div>
          </div>
        </div>

        {/* Banner Navigation Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIdx(idx)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  background: activeBannerIdx === idx ? GOLD : "rgba(250,247,242,0.4)",
                  border: `1px solid ${activeBannerIdx === idx ? GOLD : "transparent"}`
                }}
              />
            ))}
          </div>
        )}

        {/* Bottom gold accent bar */}
        <div
          className="absolute bottom-0 inset-x-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD} 40%, ${GOLD} 60%, transparent)`,
          }}
        />
      </section>

      {/* ── Shop by Category ──────────────────────────────────────────────── */}
      <section className="py-8 md:py-12 max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-14">
          <SectionEyebrow>Our Categories</SectionEyebrow>
          <SectionHeading center>Shop by Occasion</SectionHeading>
        </div>
        <div
          className="flex overflow-x-auto snap-x gap-4 md:gap-6 pb-4 md:pb-0 md:flex md:flex-wrap md:justify-center md:gap-y-8 md:overflow-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-28 md:w-32 flex flex-col items-center gap-3">
                <div className="w-full aspect-square rounded-full bg-gray-200 animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
              </div>
            ))
          ) : (
            (categories.length > 7 && !showAllCategories ? categories.slice(0, 7) : categories).map((cat) => (
              <button
                key={cat.name}
                className="flex-shrink-0 w-28 md:w-32 flex flex-col items-center gap-3 group cursor-pointer snap-start"
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
                  <Image
                    src={cat.heroImage || cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 128px, 128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p
                  className="text-xs tracking-widest uppercase text-center leading-tight"
                  style={{ color: CHARCOAL, fontFamily: SANS }}
                >
                  {cat.name}
                </p>
              </button>
            ))
          )}

          {!isLoading && categories.length > 7 && (
            <button
              className="flex-shrink-0 w-28 md:w-32 flex flex-col items-center gap-3 group cursor-pointer"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              <div
                className="relative overflow-hidden rounded-full w-full aspect-square transition-all duration-300 flex items-center justify-center border bg-[#FDF9F3]"
                style={{ borderColor: "rgba(201,162,39,0.3)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2.5px ${GOLD}`)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {showAllCategories ? (
                  <ChevronUp size={24} style={{ color: GOLD }} />
                ) : (
                  <ChevronDown size={24} style={{ color: GOLD }} />
                )}
              </div>
              <p
                className="text-xs tracking-widest uppercase text-center leading-tight font-semibold"
                style={{ color: GOLD, fontFamily: SANS }}
              >
                {showAllCategories ? "View Less" : "View More"}
              </p>
            </button>
          )}
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6">
        <GoldDivider />
      </div>

      {/* ── Collections editorial ─────────────────────────────────────────── */}
      <section className="py-8 md:py-12 max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-14">
          <SectionEyebrow>Curated Edits</SectionEyebrow>
          <SectionHeading center>Collections</SectionHeading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: i === 0 ? "3/4" : "4/5" }} className="w-full bg-gray-200 animate-pulse" />
            ))
          ) : (
            collections.map((col, i) => (
              <div
                key={col.title}
                className="relative overflow-hidden cursor-pointer group"
                style={{ background: MIST }}
                onClick={() => router.push(col.link || "/collections/all")}
              >
                <div
                  className="overflow-hidden"
                  style={{ aspectRatio: i === 0 ? "3/4" : "4/5" }}
                >
                  <Image
                    src={col.image || col.img}
                    alt={col.title}
                    fill
                    quality={60}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                    {col.description || col.desc}
                  </p>
                  <span
                    className="text-xs tracking-widest uppercase flex items-center gap-2 transition-opacity hover:opacity-70"
                    style={{ color: GOLD, fontFamily: SANS }}
                  >
                    {col.cta} <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6">
        <GoldDivider />
      </div>

      {/* ── Bestsellers ───────────────────────────────────────────────────── */}
      <section className="py-8 md:py-12 max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-14">
          <SectionEyebrow>Most Loved</SectionEyebrow>
          <SectionHeading center>Bestsellers</SectionHeading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                 <div className="w-full aspect-square bg-gray-200 animate-pulse" />
                 <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                 <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
              </div>
            ))
          ) : (
            products.map((p) => (
              <ProductCard key={p.slug} product={p} onAdd={addToCart} />
            ))
          )}
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
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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


    </main>
  );
}
