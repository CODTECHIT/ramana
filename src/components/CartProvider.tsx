"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem } from "../lib/mock-data";
import { toast } from "sonner";

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
      const cartItemId = product.selectedColor ? `${product.slug}-${product.selectedColor}` : product.slug;
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing)
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, qty: i.qty + 1 } : i,
        );

      let img = product.images?.[0] || product.img || "";
      if (product.selectedColor && product.colors) {
        const colorData = product.colors.find((c: any) => c.name === product.selectedColor);
        if (colorData && colorData.images?.length > 0) {
          img = colorData.images[0];
        }
      }

      const variantStr = [
        product.selectedColor ? `Color: ${product.selectedColor}` : "Premium Gold Finish",
        `18"` // Assuming 18" as default for now as it was before
      ].join(" · ");

      return [
        ...prev,
        {
          id: cartItemId,
          productId: product._id,
          name: product.name,
          price: product.price,
          qty: 1,
          img: img,
          variant: variantStr,
        },
      ];
    });

    toast.success("Added to Cart", {
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
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