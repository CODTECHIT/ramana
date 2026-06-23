"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem } from "../lib/mock-data";

interface CartContextType {
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  addToCart: (product: any) => void;
  cartCount: number;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ramana_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ramana_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.slug);
      if (existing)
        return prev.map((i) =>
          i.id === product.slug ? { ...i, qty: i.qty + 1 } : i,
        );
      return [
        ...prev,
        {
          id: product.slug, // using slug as id
          name: product.name,
          price: product.price,
          qty: 1,
          img: product.images?.[0] || product.img || "",
          variant: `Premium Gold Finish · 18"`,
        },
      ];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item)),
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        cartCount,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
