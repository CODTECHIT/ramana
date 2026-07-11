import heroImage from "../../landing page.jpeg";

export const I = {
  hero: heroImage.src,
  bride1: "https://images.unsplash.com/photo-1756483560049-e7b2208f99a0?w=800&h=1000&fit=crop&auto=format",
  necklace: "https://images.unsplash.com/flagged/photo-1570055349452-29232699cc63?w=600&h=750&fit=crop&auto=format",
  bangles: "https://images.unsplash.com/photo-1587271511223-18b7ef9a327a?w=600&h=600&fit=crop&auto=format",
  tikka: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=600&h=750&fit=crop&auto=format",
  headdress: "https://images.unsplash.com/photo-1665960212625-3c6b274222ed?w=600&h=750&fit=crop&auto=format",
  greenSari: "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=600&h=750&fit=crop&auto=format",
  haaram: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=750&fit=crop&auto=format",
  goldChain: "https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=600&h=750&fit=crop&auto=format",
  rings: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600&h=600&fit=crop&auto=format",
  redBeads: "https://images.unsplash.com/photo-1617191880362-aac615de3c26?w=600&h=600&fit=crop&auto=format",
  snake: "https://images.unsplash.com/photo-1705326452395-1d35e6add570?w=600&h=600&fit=crop&auto=format",
  greenEar: "https://images.unsplash.com/photo-1594140700520-8afea3283e2c?w=600&h=750&fit=crop&auto=format",
  display: "https://images.unsplash.com/photo-1758995115857-2de1eb6283d0?w=600&h=600&fit=crop&auto=format",
  bride2: "https://images.unsplash.com/photo-1669257965114-225af79f3455?w=600&h=750&fit=crop&auto=format",
};



export const COLLECTIONS = [
  { title: "The Bridal Edit", desc: "Curated sets for the modern Indian bride. Temple-inspired motifs hand-crafted in premium gold finish.", img: I.bride1, cta: "Explore Collection" },
  { title: "Temple Jewellery", desc: "Sacred motifs from Kancheepuram and Thanjavur — Lakshmi, Gaja and peacock rendered in repousse style.", img: I.redBeads, cta: "View Collection" },
  { title: "Everyday Gold", desc: "Understated pieces for daily wear. Quality assured, built to last a lifetime.", img: I.goldChain, cta: "Shop Now" },
];

export const TICKER = [
  "25,000+ smiles delivered ❤️",
  "Secure Payments & Free Shipping",
];

export const REV_DATA = [
  { month: "Jan", revenue: 28.4 }, { month: "Feb", revenue: 31.2 },
  { month: "Mar", revenue: 45.6 }, { month: "Apr", revenue: 39.8 },
  { month: "May", revenue: 52.4 }, { month: "Jun", revenue: 61.8 },
];

export const ORDERS_DATA = [
  { day: "Mon", orders: 24 }, { day: "Tue", orders: 31 }, { day: "Wed", orders: 19 },
  { day: "Thu", orders: 42 }, { day: "Fri", orders: 58 }, { day: "Sat", orders: 67 }, { day: "Sun", orders: 38 },
];

export const RECENT_ORDERS = [
  { id: "#JW-8841", customer: "Priya Ramamurthy", item: "Complete Bridal Set", amount: "₹8,95,000", status: "Processing", date: "23 Jun 2026" },
  { id: "#JW-8840", customer: "Kavitha Subramanian", item: "Kancheepuram Necklace", amount: "₹2,84,500", status: "Shipped", date: "23 Jun 2026" },
  { id: "#JW-8839", customer: "Meenakshi Iyer", item: "Lakshmi Temple Haaram", amount: "₹1,56,800", status: "Delivered", date: "22 Jun 2026" },
  { id: "#JW-8838", customer: "Ananya Krishnan", item: "Panchaloha Bangles", amount: "₹74,600", status: "Delivered", date: "22 Jun 2026" },
  { id: "#JW-8837", customer: "Sowmya Venkatesh", item: "Maang Tikka Set", amount: "₹48,900", status: "Processing", date: "21 Jun 2026" },
];



export const Constants = {
  GOLD: "#C9A227",
  DARK_GOLD: "#B8860B",
  MAROON: "#5C1A1B",
  IVORY: "#FAF7F2",
  CHARCOAL: "#241F1A",
  MIST: "#EDE8DF",
  SMOKE: "#6B6158",
  SERIF: "'Playfair Display', Georgia, serif",
  SANS: "'Inter', system-ui, sans-serif"
};

export const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

export interface CartItem {
  id: string; // will use slug as id for now
  productId?: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  variant: string;
}
