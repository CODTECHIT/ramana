"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { UtilityBar } from "../../components/SharedUI";
import { CartProvider, useCart } from "../../components/CartProvider";
import { TICKER, Constants } from "../../lib/mock-data";

function StorefrontWrapper({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();
  return (
    <div style={{ minHeight: "100vh", background: Constants.IVORY }}>
      <UtilityBar ticker={TICKER} />
      <Header cartCount={cartCount} />
      {children}
      <Footer />
    </div>
  );
}

import { AuthProvider } from "../../components/AuthProvider";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <StorefrontWrapper>{children}</StorefrontWrapper>
      </CartProvider>
    </AuthProvider>
  );
}
