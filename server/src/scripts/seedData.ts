import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../models/Category.js";
import { Collection } from "../models/Collection.js";
import { Product } from "../models/Product.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ramana-jewells";

const seedCategories = [
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Chokers, collar sets, and delicate neckwear.",
    heroImage: "https://images.unsplash.com/flagged/photo-1570055349452-29232699cc63?w=600&h=750&fit=crop&auto=format",
    active: true,
  },
  {
    name: "Long Harams",
    slug: "long-harams",
    description: "Traditional haaram necklaces cascading in gold layers.",
    heroImage: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=750&fit=crop&auto=format",
    active: true,
  },
  {
    name: "Hipbelts",
    slug: "hipbelts",
    description: "Exquisite vaddanams / oddiyanam belts to drape the waist.",
    heroImage: "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=600&h=750&fit=crop&auto=format",
    active: true,
  },
  {
    name: "Tikkas",
    slug: "tikkas",
    description: "Premium maang tikkas for bridal forehead adornment.",
    heroImage: "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=600&h=750&fit=crop&auto=format",
    active: true,
  },
  {
    name: "Hair Accessories",
    slug: "hair-accessories",
    description: "Jada billis, headbands, and antique hairpins.",
    heroImage: "https://images.unsplash.com/photo-1665960212625-3c6b274222ed?w=600&h=750&fit=crop&auto=format",
    active: true,
  },
  {
    name: "Bangles",
    slug: "bangles",
    description: "Solid kadas, matching sets, and stackable kangan bangles.",
    heroImage: "https://images.unsplash.com/photo-1587271511223-18b7ef9a327a?w=600&h=600&fit=crop&auto=format",
    active: true,
  },
  {
    name: "Bridal Sets",
    slug: "bridal-sets",
    description: "Complete ceremonial packages for the wedding day.",
    heroImage: "https://images.unsplash.com/photo-1756483560049-e7b2208f99a0?w=800&h=1000&fit=crop&auto=format",
    active: true,
  },
];

const seedCollections = [
  {
    title: "The Bridal Edit",
    description: "Curated sets for the modern Indian bride. Temple-inspired motifs hand-crafted in premium gold finish.",
    image: "https://images.unsplash.com/photo-1756483560049-e7b2208f99a0?w=800&h=1000&fit=crop&auto=format",
    cta: "Explore Collection",
    link: "/collections/bridal-sets",
    displayOrder: 1,
    active: true,
  },
  {
    title: "Temple Jewellery",
    description: "Traditional South Indian antique designs featuring deities and exquisite filigree detailing.",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=1000&fit=crop&auto=format",
    cta: "Explore Collection",
    link: "/collections/long-harams",
    displayOrder: 2,
    active: true,
  },
  {
    title: "Everyday Classics",
    description: "Lightweight premium finish pieces designed for daily luxury and comfort.",
    image: "https://images.unsplash.com/photo-1587271511223-18b7ef9a327a?w=800&h=1000&fit=crop&auto=format",
    cta: "Explore Collection",
    link: "/collections/bangles",
    displayOrder: 3,
    active: true,
  },
];

async function seed() {
  try {
    console.log("Connecting to database at:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // Seed Categories
    console.log("Cleaning and seeding categories...");
    await Category.deleteMany({});
    const insertedCats = await Category.insertMany(seedCategories);
    console.log(`Seeded ${insertedCats.length} categories.`);

    // Map names to ObjectIds for products
    const catMap = new Map(insertedCats.map((c) => [c.slug, c._id]));

    // Seed Collections
    console.log("Cleaning and seeding collections...");
    await Collection.deleteMany({});
    const insertedCols = await Collection.insertMany(seedCollections);
    console.log(`Seeded ${insertedCols.length} collections.`);

    // Seed Products
    console.log("Seeding sample products...");
    await Product.deleteMany({});
    
    const seedProducts = [
      {
        name: "Mayur Antique Collar Choker",
        slug: "mayur-antique-collar-choker",
        price: 245000,
        stock: 5,
        description: "Exquisite premium finish choker displaying detailed peacock carvings with premium ruby and emerald drops.",
        details: "Weight: 42g | Material: Premium Gold Finish | Stones: Rubies, Emeralds, Uncut Diamonds",
        category: catMap.get("necklaces"),
        images: ["https://images.unsplash.com/flagged/photo-1570055349452-29232699cc63?w=600&h=750&fit=crop"],
        tags: ["Choker", "Ruby", "Peacock", "Best Seller"],
        active: true,
      },
      {
        name: "Laxmi Kasu Long Haram",
        slug: "laxmi-kasu-long-haram",
        price: 489000,
        stock: 3,
        description: "Classic South Indian Kasulaperu long haaram depicting Goddess Lakshmi coins aligned gracefully in dual rows.",
        details: "Weight: 86g | Material: Antique Gold Finish | Stones: Spinel Cabochons, South Sea Pearls",
        category: catMap.get("long-harams"),
        images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=750&fit=crop"],
        tags: ["Kasu Haram", "Lakshmi", "Traditional"],
        active: true,
      },
      {
        name: "Kalyani Temple Vaddanam Hipbelt",
        slug: "kalyani-temple-vaddanam-hipbelt",
        price: 675000,
        stock: 2,
        description: "A majestic temple-carved waist belt (oddiyanam) outlining royal wedding processions in relief work.",
        details: "Weight: 120g | Material: Premium Gold Finish | Custom sizing available upon request",
        category: catMap.get("hipbelts"),
        images: ["https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=600&h=750&fit=crop"],
        tags: ["Hipbelt", "Vaddanam", "Wedding"],
        active: true,
      },
      {
        name: "Devi Antique Maang Tikka",
        slug: "devi-antique-maang-tikka",
        price: 78000,
        stock: 12,
        description: "Elegant floral patterns and goddess central motif maang tikka with dangling gold beads and tiny seed pearls.",
        details: "Weight: 14g | Material: Premium Gold Finish | Fitting: Adjustable hook",
        category: catMap.get("tikkas"),
        images: ["https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=600&h=750&fit=crop"],
        tags: ["Maang Tikka", "Forehead", "Bridal"],
        active: true,
      },
      {
        name: "Brahma Royal Jada Billis Set",
        slug: "brahma-royal-jada-billis-set",
        price: 185000,
        stock: 4,
        description: "Set of 9 graduated temple jada billis hair accessories with intricate filigree designs for standard wedding braids.",
        details: "Weight: 35g combined | Material: Premium Gold Finish | Stones: Ruby Doublets",
        category: catMap.get("hair-accessories"),
        images: ["https://images.unsplash.com/photo-1665960212625-3c6b274222ed?w=600&h=750&fit=crop"],
        tags: ["Jada Billi", "Hair", "Kemp"],
        active: true,
      },
      {
        name: "Navaratna Broad Antique Kada Bangles",
        slug: "navaratna-broad-antique-kada-bangles",
        price: 320000,
        stock: 6,
        description: "Broad kangan style kada bangles inlaid with the nine celestial gemstones (Navaratna) set in heavy antique gold finish framework.",
        details: "Weight: 58g pair | Sizing: 2.6 (Fits 2.4 - 2.8 due to hidden side latch mechanism)",
        category: catMap.get("bangles"),
        images: ["https://images.unsplash.com/photo-1587271511223-18b7ef9a327a?w=600&h=600&fit=crop"],
        tags: ["Kada", "Navaratna", "Bangles"],
        active: true,
      },
      {
        name: "Rajkumari Complete Heritage Bridal Set",
        slug: "rajkumari-complete-heritage-bridal-set",
        price: 1250000,
        stock: 1,
        description: "A breathtaking full wedding trousseau compilation containing: choker, long haram, jhumkas, tikkas, and side passas.",
        details: "Weight: 260g total | Comes in premium velvet presentation chest",
        category: catMap.get("bridal-sets"),
        images: ["https://images.unsplash.com/photo-1756483560049-e7b2208f99a0?w=800&h=1000&fit=crop"],
        tags: ["Full Set", "Bridal", "Heritage"],
        active: true,
      },
    ];

    const insertedProds = await Product.insertMany(productsData);
    console.log(`Seeded ${insertedProds.length} products.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
