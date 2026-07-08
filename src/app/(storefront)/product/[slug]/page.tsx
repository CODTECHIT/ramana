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
  Share2,
} from "lucide-react";
import {
  GoldBtn,
  SectionEyebrow,
  SectionHeading,
} from "../../../../components/SharedUI";
import { ProductCard } from "../../../../components/ProductCard";
import { useCart } from "../../../../components/CartProvider";
import { useWishlist } from "../../../../components/WishlistProvider";
import { I, Constants, fmt } from "../../../../lib/mock-data";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const { GOLD, CHARCOAL, IVORY, MIST, MAROON, SMOKE, SANS, SERIF } = Constants;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleWishlist, inWishlist } = useWishlist();

  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState("");
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [tab, setTab] = useState("details");
  const [setOpen, setSetOpen] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, active: false });

  // Reset active image when color changes
  useEffect(() => {
    setActiveImg(0);
  }, [activeColor]);

  const handleWhatsApp = () => {
    if (!product || !whatsappNumber) return;
    const message = `Hi! I'm interested in the ${product.name} (Rs. ${product.price}). Can you share more details?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at Ramana Jewells!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing", err);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, active: true });
  };

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${slug}`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?active=true&limit=5`).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`).then((r) => r.json()),
    ])
      .then(([p, all, settings]) => {
        setProduct(p);
        if (p?.sizes && p.sizes.length > 0) setSize(p.sizes[0]);
        if (p?.colors && p.colors.length > 0) setActiveColor(p.colors[0].name);
        if (Array.isArray(all)) {
          setRelated(
            all.filter((x: any) => x._id !== p._id).slice(0, 4),
          );
        }
        if (settings && settings.whatsappNumber) {
          setWhatsappNumber(settings.whatsappNumber);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product)
    return <div className="p-20 text-center">Product not found</div>;

  const sizes = product.sizes?.length ? product.sizes : [];
  const colors = product.colors?.length ? product.colors : [];

  const currentColor = colors.find((c: any) => c.name === activeColor);
  const imgs = (currentColor?.images?.length) ? currentColor.images : (product.images?.length ? product.images : [I.display]);


  const TABS = [
    {
      id: "details",
      label: "Product Details",
      content: product.details && product.details.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {product.details.map((detail: string, idx: number) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
      ) : (
        "Premium gold finish. Intricately hand-crafted set with traditional kemp ruby work and delicate pearl beads. Perfect for weddings, festivals, and special occasions."
      ),
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

  const setContents = product.setContents?.length ? product.setContents : [];

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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-8 md:mb-12">
          {/* Image gallery */}
          <div className="md:col-span-5">
            <div
              className="relative overflow-hidden mb-3 group cursor-crosshair"
              style={{ aspectRatio: "3/4", background: MIST }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomPos((prev) => ({ ...prev, active: false }))}
            >
              <img
                src={imgs[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover pointer-events-none"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: zoomPos.active ? "scale(2.5)" : "scale(1)",
                  transition: "transform 0.1s ease-out",
                }}
              />
              {product.tags && product.tags.length > 0 && (
                <span
                  className="absolute top-4 left-4 text-xs tracking-widest uppercase px-2 py-1 z-10"
                  style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
                >
                  {product.tags[0]}
                </span>
              )}
            </div>
            {imgs.length > 1 && (
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
            )}
          </div>

          {/* Product info */}
          <div className="md:col-span-7 px-6 md:px-0">
            <p
              className="text-xs tracking-widest uppercase mb-2"
              style={{ color: GOLD, fontFamily: SANS }}
            >
              {product.category?.name || "Category"} · Premium Finish
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
                "An heirloom-grade bridal piece inspired by the architectural splendour of South Indian temples. Crafted in premium gold finish."}
            </p>

            {/* Chain length */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-xs tracking-wider uppercase mb-3"
                  style={{ color: CHARCOAL, fontFamily: SANS }}
                >
                  Size/Length: <strong>{size}</strong>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s: string) => (
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
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-xs tracking-wider uppercase mb-3"
                  style={{ color: CHARCOAL, fontFamily: SANS }}
                >
                  Color: <strong>{activeColor}</strong>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c: any) => (
                    <button
                      key={c.name}
                      onClick={() => setActiveColor(c.name)}
                      className="px-3 py-1.5 text-xs transition-all"
                      style={{
                        border: `1px solid ${activeColor === c.name ? GOLD : "rgba(36,31,26,0.2)"}`,
                        background: activeColor === c.name ? GOLD : "transparent",
                        color: activeColor === c.name ? IVORY : CHARCOAL,
                        fontFamily: SANS,
                      }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Set contents accordion */}
            {setContents.length > 0 && (
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
                      {setContents.map((item: string) => (
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
            )}

            {/* Stock Warning */}
            {product.stock === 0 ? (
              <p className="text-red-600 text-sm font-medium mb-4" style={{ fontFamily: SANS }}>
                Currently Out of Stock. Please check back later.
              </p>
            ) : product.stock <= 5 ? (
              <p className="text-[#C9A227] text-sm font-medium mb-4" style={{ fontFamily: SANS }}>
                Fast Selling — Only {product.stock} unit{product.stock === 1 ? "" : "s"} left!
              </p>
            ) : null}

            {/* Qty + CTA */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div
                className="flex items-center"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, opacity: product.stock === 0 ? 0.5 : 1, pointerEvents: product.stock === 0 ? "none" : "auto" }}
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
              <div className="flex gap-2">
                <GoldBtn 
                  disabled={product.stock === 0}
                  onClick={() => addToCart({ ...product, selectedColor: activeColor })}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </GoldBtn>
                <button
                  disabled={product.stock === 0}
                  className={`px-8 py-3 text-xs tracking-[0.18em] uppercase font-medium transition-all duration-300 ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{
                    fontFamily: SANS,
                    background: CHARCOAL,
                    color: IVORY,
                    border: `1px solid ${CHARCOAL}`,
                  }}
                  onClick={() => {
                    if (product.stock === 0) return;
                    addToCart({ ...product, selectedColor: activeColor });
                    router.push("/cart");
                  }}
                  onMouseEnter={(e) => { if (product.stock > 0) e.currentTarget.style.background = "#333"; }}
                  onMouseLeave={(e) => { if (product.stock > 0) e.currentTarget.style.background = CHARCOAL; }}
                >
                  Buy Now
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-2.5 transition-colors"
                style={{ border: `1px solid rgba(201,162,39,0.3)` }}
                title="Add to Wishlist"
              >
                <Heart
                  size={17}
                  fill={inWishlist(product.slug) ? MAROON : "none"}
                  stroke={inWishlist(product.slug) ? MAROON : CHARCOAL}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 transition-colors"
                style={{ border: `1px solid rgba(201,162,39,0.3)` }}
                title="Share"
              >
                <Share2 size={17} stroke={CHARCOAL} />
              </button>
            </div>

            {/* WhatsApp */}
            {whatsappNumber && (
              <button
                onClick={handleWhatsApp}
                className="w-full py-3 flex items-center justify-center gap-2 text-sm tracking-wide mb-6"
                style={{ background: "#25D366", color: "#fff", fontFamily: SANS }}
              >
                <MessageCircle size={16} /> Enquire on WhatsApp
              </button>
            )}

            {/* Mini trust */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {[
                "Premium Finish Quality",
                "Care & storage guide",
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
        <div className="mb-10 md:mb-20 px-6 md:px-0">
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
          <div className="mb-6 md:mb-10">
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
        className="fixed bottom-0 left-0 right-0 p-3 z-50 md:hidden flex gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        style={{
          background: IVORY,
          borderTop: `1px solid rgba(201,162,39,0.12)`,
        }}
      >
        <button
          disabled={product.stock === 0}
          className={`flex-1 py-3 text-[10px] tracking-widest uppercase font-medium transition-opacity hover:opacity-90 text-center ${product.stock === 0 ? "opacity-50" : ""}`}
          style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
          onClick={() => addToCart({ ...product, selectedColor: activeColor })}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
        <button
          disabled={product.stock === 0}
          className={`flex-1 py-3 text-[10px] tracking-widest uppercase font-medium transition-opacity hover:opacity-90 text-center ${product.stock === 0 ? "opacity-50" : ""}`}
          style={{ background: CHARCOAL, color: IVORY, fontFamily: SANS }}
          onClick={() => {
            if (product.stock === 0) return;
            addToCart({ ...product, selectedColor: activeColor });
            router.push("/cart");
          }}
        >
          Buy Now
        </button>
        {whatsappNumber && (
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center px-3 py-3 transition-opacity hover:opacity-90"
            style={{ background: "#25D366", color: "#fff" }}
          >
            <MessageCircle size={18} />
          </button>
        )}
      </div>
    </main>
  );
}
