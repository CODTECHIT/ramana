import { useState } from "react";
import heroImage from "../landing page.jpeg";
import {
  Search, User, Heart, ShoppingBag, Menu, ArrowRight, ChevronRight,
  ChevronDown, ChevronLeft, Star, Plus, Minus, Check, X,
  Shield, RefreshCcw, CreditCard, Truck,
  LayoutDashboard, Package, Tag, ShoppingCart as CartIcon, Users,
  BarChart2, MessageCircle, Instagram, Facebook, Twitter, Youtube,
  Edit, Trash2, TrendingUp, AlertCircle, Image as ImageIcon,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "home" | "category" | "product" | "cart" | "admin";

interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  img2: string;
  tag: string;
  weight: string;
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
  variant: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD = "#C9A227";
const DARK_GOLD = "#B8860B";
const MAROON = "#5C1A1B";
const IVORY = "#FAF7F2";
const CHARCOAL = "#241F1A";
const MIST = "#EDE8DF";
const SMOKE = "#6B6158";

const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN");

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";

// ─── Image URLs ───────────────────────────────────────────────────────────────
const I = {
  hero:      heroImage.src,
  bride1:    "https://images.unsplash.com/photo-1756483560049-e7b2208f99a0?w=800&h=1000&fit=crop&auto=format",
  necklace:  "https://images.unsplash.com/flagged/photo-1570055349452-29232699cc63?w=600&h=750&fit=crop&auto=format",
  bangles:   "https://images.unsplash.com/photo-1587271511223-18b7ef9a327a?w=600&h=600&fit=crop&auto=format",
  tikka:     "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=600&h=750&fit=crop&auto=format",
  headdress: "https://images.unsplash.com/photo-1665960212625-3c6b274222ed?w=600&h=750&fit=crop&auto=format",
  greenSari: "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=600&h=750&fit=crop&auto=format",
  haaram:    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=750&fit=crop&auto=format",
  goldChain: "https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=600&h=750&fit=crop&auto=format",
  rings:     "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600&h=600&fit=crop&auto=format",
  redBeads:  "https://images.unsplash.com/photo-1617191880362-aac615de3c26?w=600&h=600&fit=crop&auto=format",
  snake:     "https://images.unsplash.com/photo-1705326452395-1d35e6add570?w=600&h=600&fit=crop&auto=format",
  greenEar:  "https://images.unsplash.com/photo-1594140700520-8afea3283e2c?w=600&h=750&fit=crop&auto=format",
  display:   "https://images.unsplash.com/photo-1758995115857-2de1eb6283d0?w=600&h=600&fit=crop&auto=format",
  bride2:    "https://images.unsplash.com/photo-1669257965114-225af79f3455?w=600&h=750&fit=crop&auto=format",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Necklaces",        img: I.necklace  },
  { name: "Long Harams",      img: I.haaram    },
  { name: "Hipbelts",         img: I.greenSari },
  { name: "Tikkas",           img: I.tikka     },
  { name: "Hair Accessories", img: I.headdress },
  { name: "Bangles",          img: I.bangles   },
  { name: "Bridal Sets",      img: I.bride1    },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Kancheepuram Bridal Necklace",   price: 284500, img: I.necklace,  img2: I.goldChain, tag: "Bestseller", weight: "45.2g", category: "Necklaces"        },
  { id: 2, name: "Lakshmi Temple Haaram",           price: 156800, img: I.haaram,   img2: I.redBeads,  tag: "New",        weight: "62.1g", category: "Long Harams"       },
  { id: 3, name: "Bridal Vanki Hipbelt",            price: 198400, img: I.bangles,  img2: I.snake,     tag: "Bestseller", weight: "38.7g", category: "Hipbelts"          },
  { id: 4, name: "Maang Tikka with Pearls",         price:  48900, img: I.tikka,    img2: I.greenEar,  tag: "",           weight: "12.3g", category: "Tikkas"            },
  { id: 5, name: "Bridal Jadanagam Set",            price:  92300, img: I.headdress,img2: I.bride1,    tag: "New",        weight: "28.5g", category: "Hair Accessories"  },
  { id: 6, name: "Panchaloha Bangles",              price:  74600, img: I.snake,    img2: I.bangles,   tag: "",           weight: "22.8g", category: "Bangles"           },
  { id: 7, name: "Complete Bridal Jewellery Set",   price: 895000, img: I.bride1,   img2: I.bride2,    tag: "Bestseller", weight: "185.4g", category: "Bridal Sets"      },
  { id: 8, name: "22KT Gold Chain Necklace",        price:  68200, img: I.goldChain,img2: I.display,   tag: "",           weight: "18.9g", category: "Necklaces"         },
];

const COLLECTIONS = [
  { title: "The Bridal Edit",    desc: "Curated sets for the modern Indian bride. Temple-inspired motifs hand-crafted in 22KT gold.",                                        img: I.bride1,    cta: "Explore Collection" },
  { title: "Temple Jewellery",   desc: "Sacred motifs from Kancheepuram and Thanjavur — Lakshmi, Gaja and peacock rendered in repousse gold.",                               img: I.redBeads,  cta: "View Collection"    },
  { title: "Everyday Gold",      desc: "Understated pieces for daily wear. Lightweight, BIS hallmarked, and built to last a lifetime.",                                       img: I.goldChain, cta: "Shop Now"           },
];

const TICKER = [
  "Gold 22KT — ₹13,375/g",
  "Gold 18KT — ₹10,942/g",
  "Gold 24KT — ₹14,615/g",
  "Silver 999 — ₹85/g",
  "Platinum — ₹3,240/g",
];

const REV_DATA = [
  { month: "Jan", revenue: 28.4 }, { month: "Feb", revenue: 31.2 },
  { month: "Mar", revenue: 45.6 }, { month: "Apr", revenue: 39.8 },
  { month: "May", revenue: 52.4 }, { month: "Jun", revenue: 61.8 },
];

const ORDERS_DATA = [
  { day: "Mon", orders: 24 }, { day: "Tue", orders: 31 }, { day: "Wed", orders: 19 },
  { day: "Thu", orders: 42 }, { day: "Fri", orders: 58 }, { day: "Sat", orders: 67 }, { day: "Sun", orders: 38 },
];

const RECENT_ORDERS = [
  { id: "#JW-8841", customer: "Priya Ramamurthy",   item: "Complete Bridal Set",        amount: "₹8,95,000", status: "Processing", date: "23 Jun 2026" },
  { id: "#JW-8840", customer: "Kavitha Subramanian", item: "Kancheepuram Necklace",      amount: "₹2,84,500", status: "Shipped",     date: "23 Jun 2026" },
  { id: "#JW-8839", customer: "Meenakshi Iyer",      item: "Lakshmi Temple Haaram",      amount: "₹1,56,800", status: "Delivered",   date: "22 Jun 2026" },
  { id: "#JW-8838", customer: "Ananya Krishnan",     item: "Panchaloha Bangles",         amount: "₹74,600",   status: "Delivered",   date: "22 Jun 2026" },
  { id: "#JW-8837", customer: "Sowmya Venkatesh",    item: "Maang Tikka Set",            amount: "₹48,900",   status: "Processing", date: "21 Jun 2026" },
];

const ADMIN_PRODUCTS = [
  { name: "Kancheepuram Bridal Necklace", category: "Necklaces",        stock: 3,  price: "₹2,84,500", active: true,  img: I.necklace   },
  { name: "Lakshmi Temple Haaram",        category: "Long Harams",      stock: 8,  price: "₹1,56,800", active: true,  img: I.haaram     },
  { name: "Bridal Vanki Hipbelt",         category: "Hipbelts",         stock: 2,  price: "₹1,98,400", active: true,  img: I.bangles    },
  { name: "Maang Tikka with Pearls",      category: "Tikkas",           stock: 14, price: "₹48,900",   active: false, img: I.tikka      },
  { name: "Bridal Jadanagam Set",         category: "Hair Accessories", stock: 6,  price: "₹92,300",   active: true,  img: I.headdress  },
  { name: "Complete Bridal Jewellery Set",category: "Bridal Sets",      stock: 1,  price: "₹8,95,000", active: true,  img: I.bride1     },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <div className="flex items-center justify-center my-14 opacity-90 max-w-2xl mx-auto w-full px-4">
      <div className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD} 80%, ${GOLD})` }} />
      <div className="mx-5 flex flex-col items-center justify-center relative" style={{ color: GOLD }}>
        <svg width="48" height="48" viewBox="0 0 64 64" fill="currentColor">
          {/* Coconut */}
          <path d="M32 4 C28 4 24 10 24 14 C24 14 28 16 32 16 C36 16 40 14 40 14 C40 10 36 4 32 4 Z"/>
          {/* Mango Leaves */}
          <path d="M24 14 C16 10 8 12 8 12 C8 12 12 20 20 22 C22 23 24 22 24 22 Z"/>
          <path d="M40 14 C48 10 56 12 56 12 C56 12 52 20 44 22 C42 23 40 22 40 22 Z"/>
          <path d="M21 16 C12 15 4 20 4 20 C4 20 10 27 18 26 C20 25 21 24 21 24 Z"/>
          <path d="M43 16 C52 15 60 20 60 20 C60 20 54 27 46 26 C44 25 43 24 43 24 Z"/>
          {/* Kalash Pot Body */}
          <path d="M22 22 C12 22 10 36 10 42 C10 52 20 56 32 56 C44 56 54 52 54 42 C54 36 52 22 42 22 L22 22 Z" />
          {/* Intricate Swastika / Pattern inside the pot */}
          <path d="M32 28 V46 M24 37 H40" stroke={IVORY} strokeWidth="2" strokeLinecap="round" />
          <path d="M24 37 V28 H28 M40 37 V46 H36 M32 28 H40 V32 M32 46 H24 V42" stroke={IVORY} strokeWidth="2" fill="none" />
          {/* Base / Stand */}
          <path d="M24 56 L18 62 H46 L40 56 Z" />
          {/* Dots */}
          <circle cx="28" cy="33" r="1.5" fill={IVORY} />
          <circle cx="36" cy="33" r="1.5" fill={IVORY} />
          <circle cx="28" cy="41" r="1.5" fill={IVORY} />
          <circle cx="36" cy="41" r="1.5" fill={IVORY} />
        </svg>
      </div>
      <div className="h-[2px] flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD} 80%, ${GOLD})` }} />
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: GOLD, fontFamily: SANS }}>
      {children}
    </p>
  );
}

function SectionHeading({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2
      className={`text-4xl font-normal leading-tight ${center ? "text-center" : ""}`}
      style={{ fontFamily: SERIF, color: CHARCOAL }}
    >
      {children}
    </h2>
  );
}

function GoldBtn({
  children,
  onClick,
  outline = false,
  full = false,
  sm = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  outline?: boolean;
  full?: boolean;
  sm?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`${full ? "w-full" : ""} ${sm ? "px-5 py-2 text-xs" : "px-8 py-3 text-xs"} tracking-[0.18em] uppercase font-medium transition-all duration-300`}
      style={{
        fontFamily: SANS,
        background: outline ? "transparent" : hov ? DARK_GOLD : GOLD,
        color: outline ? (hov ? GOLD : IVORY) : IVORY,
        border: `1px solid ${GOLD}`,
      }}
    >
      {children}
    </button>
  );
}

function ProductCard({
  product,
  onAdd,
  onNavigate,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  onNavigate: () => void;
}) {
  const [hov, setHov] = useState(false);
  const [wished, setWished] = useState(false);

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
          src={product.img}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hov ? 0 : 1 }}
        />
        {/* Secondary image (hover) */}
        <img
          src={product.img2}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hov ? 1 : 0 }}
        />

        {product.tag && (
          <span
            className="absolute top-3 left-3 text-xs tracking-widest uppercase px-2 py-1"
            style={{
              background: product.tag === "New" ? MAROON : GOLD,
              color: IVORY,
              fontFamily: SANS,
            }}
          >
            {product.tag}
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
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: GOLD, fontFamily: SANS }}>
          {product.category}
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
          Wt: {product.weight} · 22KT BIS Hallmark
        </p>
      </div>
    </div>
  );
}

// ─── Utility Bar ─────────────────────────────────────────────────────────────

function UtilityBar() {
  const doubled = [...TICKER, ...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden py-2" style={{ background: CHARCOAL }}>
      <div
        style={{
          display: "flex",
          animation: "smTicker 35s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-xs tracking-[0.2em] uppercase"
            style={{ color: GOLD, fontFamily: SANS, paddingRight: "3rem" }}
          >
            {item}
            <span style={{ marginLeft: "3rem", opacity: 0.3 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  setPage,
  cartCount,
}: {
  setPage: (p: Page) => void;
  cartCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLeft = ["Necklaces", "Long Harams", "Hipbelts", "Tikkas"];
  const navRight = ["Hair Accessories", "Bangles", "Bridal Sets"];

  return (
    <header style={{ background: IVORY, borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

        {/* Left nav */}
        <nav className="hidden lg:flex gap-6 flex-1">
          {navLeft.map((item) => (
            <button
              key={item}
              onClick={() => setPage("category")}
              className="text-xs tracking-[0.18em] uppercase transition-colors hover:opacity-100"
              style={{ color: SMOKE, fontFamily: SANS }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = SMOKE)}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Logo */}
        <div
          className="flex-shrink-0 text-center cursor-pointer"
          onClick={() => setPage("home")}
        >
          <p className="text-xs tracking-[0.45em] uppercase" style={{ color: GOLD, fontFamily: SANS }}>
            Est. 1948
          </p>
          <h1
            className="text-2xl font-normal leading-none mt-0.5"
            style={{ fontFamily: SERIF, color: CHARCOAL }}
          >
            Swarna Mahal
          </h1>
          <p
            className="text-xs tracking-[0.3em] uppercase mt-0.5"
            style={{ color: MAROON, fontFamily: SANS }}
          >
            Fine Jewellers
          </p>
        </div>

        {/* Right nav + icons */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
          <nav className="flex gap-6">
            {navRight.map((item) => (
              <button
                key={item}
                onClick={() => setPage("category")}
                className="text-xs tracking-[0.18em] uppercase"
                style={{ color: SMOKE, fontFamily: SANS }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = SMOKE)}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-2" style={{ borderLeft: `1px solid rgba(201,162,39,0.2)`, paddingLeft: "1rem" }}>
            <button className="p-1 transition-opacity hover:opacity-60" style={{ color: CHARCOAL }}><Search size={17} /></button>
            <button onClick={() => setPage("admin")} className="p-1 transition-opacity hover:opacity-60" style={{ color: CHARCOAL }}><User size={17} /></button>
            <button className="p-1 transition-opacity hover:opacity-60" style={{ color: CHARCOAL }}><Heart size={17} /></button>
            <button
              onClick={() => setPage("cart")}
              className="relative p-1 transition-opacity hover:opacity-60"
              style={{ color: CHARCOAL }}
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                  style={{ background: MAROON, fontSize: "9px", fontFamily: SANS }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-1" style={{ color: CHARCOAL }} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden px-6 pb-6" style={{ borderTop: `1px solid rgba(201,162,39,0.12)` }}>
          {[...navLeft, ...navRight].map((item) => (
            <button
              key={item}
              onClick={() => { setPage("category"); setMobileOpen(false); }}
              className="block w-full text-left py-3 text-xs tracking-[0.2em] uppercase"
              style={{ color: CHARCOAL, fontFamily: SANS, borderBottom: `1px solid rgba(201,162,39,0.1)` }}
            >
              {item}
            </button>
          ))}
          <div className="flex items-center gap-4 pt-4">
            <button style={{ color: CHARCOAL }}><Search size={18} /></button>
            <button style={{ color: CHARCOAL }}><Heart size={18} /></button>
            <button onClick={() => setPage("cart")} className="relative" style={{ color: CHARCOAL }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: MAROON, fontSize: "9px" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const cols = [
    { title: "Shop",    items: ["Necklaces", "Long Harams", "Bangles", "Bridal Sets", "Hipbelts", "Tikkas"] },
    { title: "Brand",   items: ["Our Story", "Craftsmanship", "BIS Hallmark", "Karigar Partners", "Blog"] },
    { title: "Support", items: ["Contact Us", "FAQ", "Shipping & Returns", "Sizing Guide", "WhatsApp"] },
  ];

  return (
    <footer style={{ background: CHARCOAL }}>
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-normal mb-1" style={{ fontFamily: SERIF, color: IVORY }}>
              Swarna Mahal
            </h2>
            <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ color: GOLD, fontFamily: SANS }}>
              Fine Jewellers · Est. 1948
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(250,247,242,0.55)", fontFamily: SANS }}>
              Three generations of South Indian master craftsmen preserving the art of temple jewellery. BIS Hallmark certified, lifetime exchange guaranteed.
            </p>
            <div className="flex gap-2 mb-6">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 transition-opacity hover:opacity-70"
                  style={{ border: `1px solid rgba(201,162,39,0.3)`, color: GOLD }}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
              style={{ background: "#25D366", color: "#fff", fontFamily: SANS }}
            >
              <MessageCircle size={15} /> WhatsApp Us
            </button>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4
                className="text-xs tracking-[0.25em] uppercase mb-5"
                style={{ color: GOLD, fontFamily: SANS }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => setPage("category")}
                      className="text-sm text-left transition-opacity hover:opacity-80"
                      style={{ color: "rgba(250,247,242,0.55)", fontFamily: SANS }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: `1px solid rgba(201,162,39,0.12)` }}
        >
          <p className="text-xs" style={{ color: "rgba(250,247,242,0.35)", fontFamily: SANS }}>
            © 2026 Swarna Mahal Fine Jewellers. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "rgba(250,247,242,0.35)", fontFamily: SANS }}>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({
  setPage,
  onAddToCart,
}: {
  setPage: (p: Page) => void;
  onAddToCart: (p: Product) => void;
}) {
  const TRUST = [
    { icon: Shield,     label: "BIS Hallmark Certified" },
    { icon: RefreshCcw, label: "Lifetime Exchange"       },
    { icon: CreditCard, label: "Secure Payments"         },
    { icon: Truck,      label: "Easy Returns"            },
  ];

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: "91vh", minHeight: 520 }}>
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
            className="text-xs tracking-[0.4em] uppercase mb-5"
            style={{
              color: GOLD,
              fontFamily: SANS,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            The 2026 Bridal Collection
          </p>
          <h1
            className="text-5xl md:text-7xl font-normal leading-tight mb-6"
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
            Three generations of South Indian master craftsmen. Every piece hallmarked, every detail considered.
          </p>
          <div className="flex flex-wrap gap-4">
            <GoldBtn onClick={() => setPage("category")}>Explore Bridal</GoldBtn>
            <GoldBtn outline onClick={() => setPage("category")}>View Collections</GoldBtn>
          </div>
        </div>

        {/* Bottom gold accent bar */}
        <div
          className="absolute bottom-0 inset-x-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD} 40%, ${GOLD} 60%, transparent)` }}
        />
      </section>

      {/* ── Shop by Category ──────────────────────────────────────────────── */}
      <section className="py-20 max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionEyebrow>Our Categories</SectionEyebrow>
          <SectionHeading center>Shop by Occasion</SectionHeading>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center gap-3 group cursor-pointer"
              onClick={() => setPage("category")}
            >
              <div
                className="relative overflow-hidden rounded-full w-full aspect-square transition-all duration-300"
                style={{ background: MIST }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2.5px ${GOLD}`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <img
                  src={cat.img}
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
              onClick={() => setPage("category")}
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
                style={{ background: "linear-gradient(0deg, rgba(36,31,26,0.88) 0%, rgba(36,31,26,0.1) 55%, transparent 100%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3
                  className="text-xl font-normal mb-2"
                  style={{ fontFamily: SERIF, color: IVORY }}
                >
                  {col.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(250,247,242,0.65)", fontFamily: SANS }}>
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
          {PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={onAddToCart}
              onNavigate={() => setPage("product")}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <GoldBtn onClick={() => setPage("category")}>View All Jewellery</GoldBtn>
        </div>
      </section>

      {/* ── Trust badges ──────────────────────────────────────────────────── */}
      <div style={{ background: "#FDF9F3", borderTop: `1px solid rgba(201,162,39,0.12)`, borderBottom: `1px solid rgba(201,162,39,0.12)` }}>
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                <div className="p-4" style={{ border: `1px solid rgba(201,162,39,0.3)` }}>
                  <Icon size={20} style={{ color: GOLD }} />
                </div>
                <p className="text-xs tracking-widest uppercase" style={{ color: CHARCOAL, fontFamily: SANS }}>
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
            The Swarna Mahal Circle
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(250,247,242,0.55)", fontFamily: SANS }}>
            Receive early access to new collections, exclusive offers, and invitations to private trunk shows.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm outline-none"
              style={{
                background: "rgba(250,247,242,0.07)",
                color: IVORY,
                fontFamily: SANS,
                border: `1px solid rgba(201,162,39,0.3)`,
                borderRight: "none",
              }}
            />
            <button
              className="px-6 py-3 text-xs tracking-[0.18em] uppercase font-medium"
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

// ─── Category Page ────────────────────────────────────────────────────────────

function CategoryPage({
  setPage,
  onAddToCart,
}: {
  setPage: (p: Page) => void;
  onAddToCart: (p: Product) => void;
}) {
  const [priceMax, setPriceMax] = useState(900000);
  const [selected, setSelected] = useState<string[]>([]);

  const occasions = ["Bridal", "Festival", "Daily Wear", "Engagement", "Anniversary"];
  const purities  = ["22KT", "18KT", "24KT"];
  const toggle    = (o: string) =>
    setSelected((p) => (p.includes(o) ? p.filter((x) => x !== o) : [...p, o]));

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs tracking-wider uppercase mb-10"
          style={{ color: SMOKE, fontFamily: SANS }}
        >
          <button onClick={() => setPage("home")} style={{ color: GOLD }}>Home</button>
          <ChevronRight size={12} />
          <span style={{ color: CHARCOAL }}>Bridal Sets</span>
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
                onChange={(e) => setPriceMax(+e.target.value)}
                className="w-full mb-2"
                style={{ accentColor: GOLD }}
              />
              <div className="flex justify-between text-xs" style={{ color: SMOKE, fontFamily: SANS }}>
                <span>₹10,000</span>
                <span>{fmt(priceMax)}</span>
              </div>
            </div>

            {/* Occasion */}
            <div className="pb-6 mb-6" style={{ borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD, fontFamily: SANS }}>
                Occasion
              </p>
              <div className="space-y-2.5">
                {occasions.map((o) => (
                  <label key={o} className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggle(o)}>
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
                  </label>
                ))}
              </div>
            </div>

            {/* Purity */}
            <div className="pb-6" style={{ borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD, fontFamily: SANS }}>
                Gold Purity
              </p>
              <div className="space-y-2.5">
                {purities.map((p) => (
                  <label key={p} className="flex items-center gap-2.5 cursor-pointer">
                    <div className="w-4 h-4 rounded-full" style={{ border: `1px solid rgba(36,31,26,0.25)` }} />
                    <span className="text-sm" style={{ color: CHARCOAL, fontFamily: SANS }}>{p} Gold</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-normal" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                  Bridal Sets
                </h1>
                <p className="text-sm mt-1" style={{ color: SMOKE, fontFamily: SANS }}>
                  Showing {PRODUCTS.length} pieces
                </p>
              </div>
              <select
                className="px-4 py-2 text-xs tracking-wider uppercase outline-none"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "transparent", color: CHARCOAL, fontFamily: SANS }}
              >
                <option>Sort: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {PRODUCTS.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={onAddToCart}
                  onNavigate={() => setPage("product")}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1.5 mt-14">
              <button className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, color: CHARCOAL }}>
                <ChevronLeft size={13} />
              </button>
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className="w-8 h-8 flex items-center justify-center text-sm"
                  style={{
                    background: n === 1 ? GOLD : "transparent",
                    color: n === 1 ? IVORY : CHARCOAL,
                    border: `1px solid ${n === 1 ? GOLD : "rgba(201,162,39,0.3)"}`,
                    fontFamily: SANS,
                  }}
                >
                  {n}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, color: CHARCOAL }}>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────

function ProductPage({
  setPage,
  onAddToCart,
}: {
  setPage: (p: Page) => void;
  onAddToCart: (p: Product) => void;
}) {
  const product = PRODUCTS[0];
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("18\"");
  const [tab, setTab] = useState("details");
  const [setOpen, setSetOpen] = useState(true);
  const [wished, setWished] = useState(false);

  const imgs = [product.img, product.img2, I.display, I.rings];
  const sizes = ["16\"", "18\"", "20\"", "22\"", "24\""];

  const TABS = [
    {
      id: "details", label: "Product Details",
      content: "Crafted in 22KT BIS Hallmark certified gold. Stone: Uncut polypki diamonds and natural rubies. Setting: Traditional Thewa work with meenakari enamel on reverse. Finish: Antique matte with selective polished highlights. Total gold weight: 45.2g. Dimensions: 48cm chain length, pendant 6.2cm × 4.8cm.",
    },
    {
      id: "care", label: "Care Instructions",
      content: "Store in the velvet-lined box provided, away from direct sunlight. Clean gently with a soft dry cloth. Avoid contact with perfume, hairspray, and chlorine. For deep cleaning, bring to any Swarna Mahal store — complimentary for the lifetime of the piece.",
    },
    {
      id: "shipping", label: "Shipping & Returns",
      content: "Free insured shipping across India via Blue Dart. Delivery in 3–5 business days. International shipping available to 35+ countries. 7-day returns on unworn, unaltered pieces in original packaging. 30-day exchange — value credited against your next purchase.",
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
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs tracking-wider uppercase mb-10" style={{ color: SMOKE, fontFamily: SANS }}>
          <button onClick={() => setPage("home")} style={{ color: GOLD }}>Home</button>
          <ChevronRight size={12} />
          <button onClick={() => setPage("category")} style={{ color: GOLD }}>Necklaces</button>
          <ChevronRight size={12} />
          <span style={{ color: CHARCOAL }}>Kancheepuram Bridal Necklace</span>
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
              {product.tag && (
                <span
                  className="absolute top-4 left-4 text-xs tracking-widest uppercase px-2 py-1"
                  style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
                >
                  {product.tag}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {imgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="flex-1 overflow-hidden"
                  style={{ aspectRatio: "1", border: `1.5px solid ${activeImg === i ? GOLD : "transparent"}` }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: GOLD, fontFamily: SANS }}>
              Necklaces · 22KT Gold
            </p>
            <h1
              className="text-3xl font-normal leading-snug mb-3"
              style={{ fontFamily: SERIF, color: CHARCOAL }}
            >
              Kancheepuram Bridal Necklace
            </h1>

            <div className="flex items-center gap-4 mb-3">
              <p className="text-2xl font-light" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                {fmt(product.price)}
              </p>
              <span
                className="text-xs px-2 py-1"
                style={{ background: "rgba(201,162,39,0.1)", color: GOLD, fontFamily: SANS }}
              >
                Wt: {product.weight}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill={GOLD} color={GOLD} />
              ))}
              <span className="text-xs ml-1" style={{ color: SMOKE, fontFamily: SANS }}>4.9 (128 reviews)</span>
            </div>

            <p className="text-sm leading-relaxed mb-7" style={{ color: SMOKE, fontFamily: SANS }}>
              An heirloom-grade bridal necklace inspired by the architectural splendour of Kancheepuram temples. Set with uncut polypki diamonds and natural rubies in 22KT gold, with intricate meenakari enamel detailing on the reverse.
            </p>

            {/* Chain length */}
            <div className="mb-6">
              <p className="text-xs tracking-wider uppercase mb-3" style={{ color: CHARCOAL, fontFamily: SANS }}>
                Chain Length: <strong>{size}</strong>
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
            <div className="mb-6" style={{ border: `1px solid rgba(201,162,39,0.2)` }}>
              <button
                className="w-full flex items-center justify-between px-4 py-3"
                onClick={() => setSetOpen(!setOpen)}
              >
                <span className="text-xs tracking-wider uppercase" style={{ color: CHARCOAL, fontFamily: SANS }}>
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
                <div className="px-4 pb-4" style={{ borderTop: `1px solid rgba(201,162,39,0.12)` }}>
                  <ul className="mt-3 space-y-1.5">
                    {SET_CONTENTS.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm" style={{ color: SMOKE, fontFamily: SANS }}>
                        <Check size={11} style={{ color: GOLD, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Qty + CTA */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center" style={{ border: `1px solid rgba(201,162,39,0.3)` }}>
                <button className="px-3 py-2.5 hover:opacity-60 transition-opacity" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={13} style={{ color: CHARCOAL }} />
                </button>
                <span className="px-4 text-sm" style={{ color: CHARCOAL, fontFamily: SANS }}>{qty}</span>
                <button className="px-3 py-2.5 hover:opacity-60 transition-opacity" onClick={() => setQty(qty + 1)}>
                  <Plus size={13} style={{ color: CHARCOAL }} />
                </button>
              </div>
              <GoldBtn onClick={() => { onAddToCart(product); setPage("cart"); }}>Add to Cart</GoldBtn>
              <button
                onClick={() => setWished(!wished)}
                className="p-2.5 transition-colors"
                style={{ border: `1px solid rgba(201,162,39,0.3)` }}
              >
                <Heart size={17} fill={wished ? MAROON : "none"} stroke={wished ? MAROON : CHARCOAL} />
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
              {["BIS Hallmark 916", "Lifetime Exchange", "Free Insured Shipping", "Secure Checkout"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check size={11} style={{ color: GOLD, flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: SMOKE, fontFamily: SANS }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex" style={{ borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
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
            <p className="text-sm leading-relaxed" style={{ color: SMOKE, fontFamily: SANS }}>
              {TABS.find((t) => t.id === tab)?.content}
            </p>
          </div>
        </div>

        {/* Related products */}
        <section>
          <div className="mb-10">
            <SectionEyebrow>You May Also Like</SectionEyebrow>
            <SectionHeading>Related Pieces</SectionHeading>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {PRODUCTS.slice(1, 5).map((p) => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onNavigate={() => setPage("product")} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// ─── Cart / Checkout Page ─────────────────────────────────────────────────────

function CartPage({
  cart,
  setCart,
  setPage,
}: {
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  setPage: (p: Page) => void;
}) {
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name: "", phone: "", street: "", city: "", pin: "", state: "Tamil Nadu" });
  const [pay, setPay] = useState("upi");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal > 500000 ? 0 : 299;
  const total     = subtotal + shipping;

  const updateQty = (id: number, d: number) =>
    setCart(cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const removeItem = (id: number) => setCart(cart.filter((i) => i.id !== id));

  const STEPS = ["Cart", "Address", "Payment"];

  const PAY_METHODS = [
    { id: "upi",        label: "UPI (PhonePe, GPay, Paytm)", desc: "Instant transfer, no extra charges"    },
    { id: "netbanking", label: "Net Banking",                 desc: "All major banks supported"              },
    { id: "card",       label: "Credit / Debit Card",         desc: "Visa, Mastercard, RuPay — 0% EMI"      },
    { id: "cod",        label: "Cash on Delivery",            desc: "Pay when your jewellery arrives"        },
  ];

  const STATES = ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Kerala", "Maharashtra", "Delhi", "Telangana"];

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-14">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    background: i <= step ? GOLD : "transparent",
                    color: i <= step ? IVORY : SMOKE,
                    border: `1.5px solid ${i <= step ? GOLD : "rgba(201,162,39,0.3)"}`,
                    fontFamily: SANS,
                  }}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span
                  className="text-xs mt-1.5 tracking-wider uppercase"
                  style={{ color: i <= step ? GOLD : SMOKE, fontFamily: SANS }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-20 md:w-28 mx-3 mb-5"
                  style={{ height: 1, background: i < step ? GOLD : "rgba(201,162,39,0.2)" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: SERIF, color: CHARCOAL }}>Your Cart</h2>
                {cart.length === 0 ? (
                  <div className="text-center py-24">
                    <ShoppingBag size={42} className="mx-auto mb-4" style={{ color: "rgba(201,162,39,0.3)" }} />
                    <p className="text-sm mb-6" style={{ color: SMOKE, fontFamily: SANS }}>Your cart is empty</p>
                    <GoldBtn onClick={() => setPage("category")}>Explore Jewellery</GoldBtn>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4"
                        style={{ background: "#FDF9F3", border: `1px solid rgba(201,162,39,0.15)` }}
                      >
                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden" style={{ background: MIST }}>
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm mb-1 truncate" style={{ fontFamily: SERIF, color: CHARCOAL }}>{item.name}</h3>
                          <p className="text-xs mb-1" style={{ color: SMOKE, fontFamily: SANS }}>{item.variant}</p>
                          <p className="text-sm font-medium mb-3" style={{ fontFamily: SANS, color: CHARCOAL }}>{fmt(item.price)}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center" style={{ border: `1px solid rgba(201,162,39,0.3)` }}>
                              <button className="px-2 py-1.5" onClick={() => updateQty(item.id, -1)}><Minus size={11} style={{ color: CHARCOAL }} /></button>
                              <span className="px-3 text-xs" style={{ color: CHARCOAL, fontFamily: SANS }}>{item.qty}</span>
                              <button className="px-2 py-1.5" onClick={() => updateQty(item.id, 1)}><Plus size={11} style={{ color: CHARCOAL }} /></button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs hover:opacity-60 transition-opacity"
                              style={{ color: SMOKE, fontFamily: SANS }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                            {fmt(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: SERIF, color: CHARCOAL }}>Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "name",   label: "Full Name",       placeholder: "Priya Ramamurthy",      span: 1 },
                    { key: "phone",  label: "Mobile Number",   placeholder: "+91 98400 12345",        span: 1 },
                    { key: "street", label: "Street Address",  placeholder: "42, Anna Nagar Main Road", span: 2 },
                    { key: "city",   label: "City",            placeholder: "Chennai",                span: 1 },
                    { key: "pin",    label: "PIN Code",        placeholder: "600040",                 span: 1 },
                  ].map((f) => (
                    <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                      <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: CHARCOAL, fontFamily: SANS }}>
                        {f.label}
                      </label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={addr[f.key as keyof typeof addr]}
                        onChange={(e) => setAddr({ ...addr, [f.key]: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm outline-none"
                        style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "#FDF9F3", color: CHARCOAL, fontFamily: SANS }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: CHARCOAL, fontFamily: SANS }}>State</label>
                    <select
                      value={addr.state}
                      onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm outline-none"
                      style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "#FDF9F3", color: CHARCOAL, fontFamily: SANS }}
                    >
                      {STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: SERIF, color: CHARCOAL }}>Payment</h2>
                <div className="space-y-3">
                  {PAY_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 p-4 cursor-pointer transition-all"
                      style={{
                        border: `1.5px solid ${pay === m.id ? GOLD : "rgba(201,162,39,0.2)"}`,
                        background: pay === m.id ? "rgba(201,162,39,0.04)" : "#FDF9F3",
                      }}
                      onClick={() => setPay(m.id)}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ border: `1.5px solid ${pay === m.id ? GOLD : "rgba(36,31,26,0.25)"}` }}
                      >
                        {pay === m.id && (
                          <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: CHARCOAL, fontFamily: SANS }}>{m.label}</p>
                        <p className="text-xs" style={{ color: SMOKE, fontFamily: SANS }}>{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div
              className="p-6 sticky top-6"
              style={{ background: "#FDF9F3", border: `1px solid rgba(201,162,39,0.18)` }}
            >
              <h3 className="text-lg font-normal mb-5" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                Order Summary
              </h3>

              <div className="space-y-2.5 pb-4 mb-4" style={{ borderBottom: `1px solid rgba(201,162,39,0.12)` }}>
                {cart.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm gap-2">
                    <span className="truncate flex-1" style={{ color: SMOKE, fontFamily: SANS }}>
                      {i.name} ×{i.qty}
                    </span>
                    <span className="flex-shrink-0" style={{ color: CHARCOAL, fontFamily: SANS }}>
                      {fmt(i.price * i.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pb-4 mb-4" style={{ borderBottom: `1px solid rgba(201,162,39,0.12)` }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: SMOKE, fontFamily: SANS }}>Subtotal</span>
                  <span style={{ color: CHARCOAL, fontFamily: SANS }}>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: SMOKE, fontFamily: SANS }}>Insured Shipping</span>
                  <span style={{ color: shipping === 0 ? GOLD : CHARCOAL, fontFamily: SANS }}>
                    {shipping === 0 ? "Free" : fmt(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-medium" style={{ fontFamily: SERIF, color: CHARCOAL }}>Total</span>
                <span className="text-xl font-normal" style={{ fontFamily: SERIF, color: CHARCOAL }}>{fmt(total)}</span>
              </div>

              {step < 2 ? (
                <GoldBtn onClick={() => setStep((s) => s + 1)} full>
                  {step === 0 ? "Proceed to Address" : "Continue to Payment"}
                </GoldBtn>
              ) : (
                <GoldBtn onClick={() => alert("Order placed! Confirmation sent to WhatsApp.")} full>
                  Place Order
                </GoldBtn>
              )}

              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="w-full mt-3 text-xs tracking-wider uppercase text-center hover:opacity-60 transition-opacity py-2"
                  style={{ color: SMOKE, fontFamily: SANS }}
                >
                  ← Back
                </button>
              )}

              <div className="mt-5 flex items-center justify-center gap-2">
                <Shield size={12} style={{ color: GOLD }} />
                <span className="text-xs" style={{ color: SMOKE, fontFamily: SANS }}>256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminPage({ setPage }: { setPage: (p: Page) => void }) {
  const [section, setSection] = useState("dashboard");

  const NAV = [
    { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { id: "products",  label: "Products",   icon: Package          },
    { id: "categories",label: "Categories", icon: Tag              },
    { id: "orders",    label: "Orders",     icon: CartIcon         },
    { id: "customers", label: "Customers",  icon: Users            },
    { id: "banners",   label: "Banners",    icon: ImageIcon        },
    { id: "reports",   label: "Reports",    icon: BarChart2        },
  ];

  const METRICS = [
    { label: "Total Orders",      value: "2,841",   change: "+12.4%",          up: true,  icon: ShoppingBag    },
    { label: "Revenue (Jun)",     value: "₹61.8L",  change: "+18.1%",          up: true,  icon: TrendingUp     },
    { label: "Low Stock Items",   value: "7",        change: "−2 from last week", up: false, icon: AlertCircle  },
    { label: "New Customers",     value: "148",      change: "+8.3%",           up: true,  icon: Users          },
  ];

  return (
    <div className="flex" style={{ height: "100vh", background: "#F4F4F6" }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: "#1A1A2E" }}
      >
        <div className="px-5 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => setPage("home")}
            className="text-xs tracking-widest uppercase mb-0.5 hover:opacity-70 transition-opacity"
            style={{ color: GOLD, fontFamily: SANS }}
          >
            ← Storefront
          </button>
          <h2 className="text-lg font-normal mt-1" style={{ fontFamily: SERIF, color: "#E8E8F0" }}>
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-all"
              style={{
                background: section === id ? "rgba(201,162,39,0.12)" : "transparent",
                color: section === id ? GOLD : "rgba(232,232,240,0.55)",
                borderLeft: `2px solid ${section === id ? GOLD : "transparent"}`,
                fontFamily: SANS,
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(232,232,240,0.35)", fontFamily: SANS }}>
            Logged in as Admin
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div
          className="px-8 py-5 flex items-center justify-between"
          style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div>
            <h1 className="text-xl font-medium" style={{ color: "#1A1A2E", fontFamily: SERIF }}>
              {NAV.find((n) => n.id === section)?.label}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280", fontFamily: SANS }}>
              Monday, 23 June 2026
            </p>
          </div>
          {section === "products" && (
            <button
              className="px-4 py-2 text-xs tracking-wider uppercase"
              style={{ background: GOLD, color: IVORY, fontFamily: SANS }}
            >
              + Add Product
            </button>
          )}
        </div>

        <div className="p-8">
          {section === "dashboard" && (
            <div>
              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {METRICS.map((m) => (
                  <div
                    key={m.label}
                    className="p-5 rounded"
                    style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6B7280", fontFamily: SANS }}>
                        {m.label}
                      </p>
                      <m.icon size={15} style={{ color: GOLD }} />
                    </div>
                    <p className="text-2xl font-medium mb-1" style={{ color: "#1A1A2E", fontFamily: SERIF }}>
                      {m.value}
                    </p>
                    <p className="text-xs" style={{ color: m.up ? "#16a34a" : "#dc2626", fontFamily: SANS }}>
                      {m.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="md:col-span-2 p-5 rounded" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 className="text-sm font-medium mb-5" style={{ color: "#1A1A2E", fontFamily: SANS }}>
                    Revenue (₹ Lakhs) — 2026
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={REV_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontSize: 12, borderRadius: 4 }} />
                      <Line type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 3, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-5 rounded" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 className="text-sm font-medium mb-5" style={{ color: "#1A1A2E", fontFamily: SANS }}>
                    Orders This Week
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ORDERS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontSize: 12, borderRadius: 4 }} />
                      <Bar dataKey="orders" fill={GOLD} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent orders table */}
              <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <h3 className="text-sm font-medium" style={{ color: "#1A1A2E", fontFamily: SANS }}>Recent Orders</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                      {["Order ID", "Customer", "Item", "Amount", "Status", "Date"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#6B7280", fontFamily: SANS }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((o, i) => (
                      <tr
                        key={o.id}
                        style={{ borderBottom: i < RECENT_ORDERS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                      >
                        <td className="px-6 py-3.5 text-sm font-medium" style={{ color: GOLD, fontFamily: SANS }}>{o.id}</td>
                        <td className="px-6 py-3.5 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{o.customer}</td>
                        <td className="px-6 py-3.5 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{o.item}</td>
                        <td className="px-6 py-3.5 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS }}>{o.amount}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              background: o.status === "Delivered" ? "#dcfce7" : o.status === "Shipped" ? "#dbeafe" : "#fef9c3",
                              color:      o.status === "Delivered" ? "#16a34a" : o.status === "Shipped" ? "#2563eb" : "#ca8a04",
                              fontFamily: SANS,
                            }}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "products" && (
            <div className="rounded overflow-hidden" style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    {["", "Product", "Category", "Stock", "Price", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: "#6B7280", fontFamily: SANS }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_PRODUCTS.map((p, i) => (
                    <tr
                      key={p.name}
                      style={{ borderBottom: i < ADMIN_PRODUCTS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                    >
                      <td className="px-5 py-3">
                        <div className="w-10 h-12 overflow-hidden" style={{ background: MIST }}>
                          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium" style={{ color: "#374151", fontFamily: SANS, maxWidth: 200 }}>
                        {p.name}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#6B7280", fontFamily: SANS }}>{p.category}</td>
                      <td
                        className="px-5 py-3 text-sm font-medium"
                        style={{ color: p.stock <= 3 ? "#dc2626" : "#374151", fontFamily: SANS }}
                      >
                        {p.stock}
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#374151", fontFamily: SANS }}>{p.price}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-4.5 rounded-full relative cursor-pointer"
                            style={{ background: p.active ? GOLD : "#D1D5DB", height: "18px", width: "30px" }}
                          >
                            <div
                              className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all"
                              style={{ left: p.active ? "calc(100% - 14px)" : "2px" }}
                            />
                          </div>
                          <span className="text-xs" style={{ color: p.active ? GOLD : "#6B7280", fontFamily: SANS }}>
                            {p.active ? "Active" : "Draft"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 hover:opacity-60 transition-opacity" style={{ color: "#6B7280" }}>
                            <Edit size={13} />
                          </button>
                          <button className="p-1.5 hover:opacity-60 transition-opacity" style={{ color: "#dc2626" }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!["dashboard", "products"].includes(section) && (
            <div
              className="flex items-center justify-center rounded"
              style={{ height: 280, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="text-center">
                <p className="text-sm font-medium mb-1" style={{ color: "#374151", fontFamily: SANS }}>
                  {NAV.find((n) => n.id === section)?.label}
                </p>
                <p className="text-xs" style={{ color: "#6B7280", fontFamily: SANS }}>Coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          img: product.img,
          variant: `22KT Gold · 18"`,
        },
      ];
    });
  };

  const cartCount   = cart.reduce((s, i) => s + i.qty, 0);
  const isStorefront = page !== "admin";

  return (
    <>
      <style>{`
        @keyframes smTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: IVORY }}>
        {isStorefront && (
          <>
            <UtilityBar />
            <Header setPage={setPage} cartCount={cartCount} />
          </>
        )}

        {page === "home"     && <HomePage     setPage={setPage} onAddToCart={addToCart} />}
        {page === "category" && <CategoryPage setPage={setPage} onAddToCart={addToCart} />}
        {page === "product"  && <ProductPage  setPage={setPage} onAddToCart={addToCart} />}
        {page === "cart"     && <CartPage     cart={cart} setCart={setCart} setPage={setPage} />}
        {page === "admin"    && <AdminPage    setPage={setPage} />}

        {isStorefront && <Footer setPage={setPage} />}
      </div>
    </>
  );
}
