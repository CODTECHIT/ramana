"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistContextType {
  wishlist: any[];
  toggleWishlist: (product: any) => void;
  inWishlist: (slug: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/user/wishlist`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
        } else {
          const saved = localStorage.getItem("ramana_wishlist");
          if (saved) setWishlist(JSON.parse(saved));
        }
      } catch (e) {
        const saved = localStorage.getItem("ramana_wishlist");
        if (saved) setWishlist(JSON.parse(saved));
      }
      setMounted(true);
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ramana_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const toggleWishlist = async (product: any) => {
    const exists = wishlist.some((p) => p.slug === product.slug);
    
    // Optimistic update
    setWishlist((prev) => exists ? prev.filter((p) => p.slug !== product.slug) : [...prev, product]);
    
    try {
      if (exists) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/user/wishlist/${product.slug}`, { method: "DELETE", credentials: "include" });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/user/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(product)
        });
      }
    } catch (e) {
      console.error("Failed to sync wishlist", e);
    }
  };

  const inWishlist = (slug: string) => {
    return wishlist.some((p) => p.slug === slug);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, inWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
