"use client";

import { useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Constants } from "../lib/mock-data";
import { useAuth } from "./AuthProvider";
import Link from "next/link";

const { GOLD, CHARCOAL, SMOKE, MAROON, SANS, SERIF, IVORY } = Constants;

export function Header({ cartCount }: { cartCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLeft = ["Necklaces", "Long Harams", "Hipbelts", "Tikkas"];
  const { user } = useAuth();
  const navRight = ["Hair Accessories", "Bangles", "Bridal Sets"];

  return (
    <header style={{ background: IVORY, borderBottom: `1px solid rgba(201,162,39,0.18)` }} className="relative z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between relative">

        {/* Mobile Hamburger (Left on mobile, hidden on desktop) */}
        <div className="lg:hidden flex-1 flex justify-start">
          <button className="p-2 -ml-2" style={{ color: CHARCOAL }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Left nav (Desktop) */}
        <nav className="hidden lg:flex gap-6 flex-1">
          {navLeft.map((item) => (
            <Link
              key={item}
              href={`/collections/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-colors hover:opacity-100"
              style={{ color: SMOKE, fontFamily: SANS }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = SMOKE)}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Logo (Centered) */}
        <Link
          href="/"
          className="flex-shrink-0 text-center cursor-pointer block mx-2"
        >
          <h1 className="text-2xl md:text-3xl font-normal tracking-wide whitespace-nowrap" style={{ fontFamily: SERIF, color: CHARCOAL }}>
            Ramana Jewells
          </h1>
          <p
            className="text-[9px] md:text-xs tracking-[0.3em] uppercase mt-0.5"
            style={{ color: MAROON, fontFamily: SANS }}
          >
            Premium Jewellery
          </p>
        </Link>

        {/* Right nav + icons (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
          <nav className="flex gap-6 items-center">
            {navRight.map((item) => (
              <Link
                key={item}
                href={`/collections/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-colors hover:opacity-100"
                style={{ color: SMOKE, fontFamily: SANS }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = SMOKE)}
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-2" style={{ borderLeft: `1px solid rgba(201,162,39,0.2)`, paddingLeft: "1rem" }}>
            <button className="p-1 transition-opacity hover:opacity-60" style={{ color: CHARCOAL }}><Search size={17} /></button>
            <Link href={user ? "/account" : "/login"} className="p-1 transition-opacity hover:opacity-60" style={{ color: CHARCOAL }}><User size={17} /></Link>
            <button className="p-1 transition-opacity hover:opacity-60" style={{ color: CHARCOAL }}><Heart size={17} /></button>
            <Link
              href="/cart"
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
            </Link>
          </div>
        </div>

        {/* Mobile Icons (Right on mobile, hidden on desktop) */}
        <div className="lg:hidden flex-1 flex justify-end items-center gap-2">
          <button className="p-2 transition-opacity hover:opacity-60" style={{ color: CHARCOAL }}><Search size={20} /></button>
          <Link
            href="/cart"
            className="relative p-2 transition-opacity hover:opacity-60"
            style={{ color: CHARCOAL }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ background: MAROON, fontSize: "9px", fontFamily: SANS }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="lg:hidden absolute left-0 right-0 w-full shadow-lg overflow-y-auto" style={{ background: IVORY, borderTop: `1px solid rgba(201,162,39,0.12)`, maxHeight: "calc(100vh - 70px)" }}>
          <div className="px-6 py-4">
            <Link href={user ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 mb-6 text-sm" style={{ color: CHARCOAL, fontFamily: SANS }}>
              <User size={16} /> {user ? "My Account" : "Sign In"}
            </Link>
            {[...navLeft, ...navRight].map((item) => (
              <Link
                key={item}
                href={`/collections/${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left py-4 text-xs tracking-[0.2em] uppercase"
                style={{ color: CHARCOAL, fontFamily: SANS, borderBottom: `1px solid rgba(201,162,39,0.1)` }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
