"use client";

import { useState, useEffect } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, Trash2, ShoppingCart, ChevronDown } from "lucide-react";
import { Constants, fmt, I } from "../lib/mock-data";
import { useAuth } from "./AuthProvider";
import { useWishlist } from "./WishlistProvider";
import { useCart } from "./CartProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { GOLD, CHARCOAL, SMOKE, MAROON, SANS, SERIF, IVORY } = Constants;

export function Header({ cartCount }: { cartCount: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const { user, logout } = useAuth();
  const { wishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const navRight = ["Bangles", "Bridal Sets"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/collections/all?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    router.push("/");
  };

  return (
    <header style={{ background: IVORY, borderBottom: `1px solid rgba(201,162,39,0.18)` }} className="relative z-50">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between relative">

        {/* Mobile Hamburger (Left on mobile, hidden on desktop) */}
        <div className="lg:hidden flex-1 flex justify-start">
          <button aria-label="Toggle menu" className="p-2 -ml-2" style={{ color: CHARCOAL }} onClick={() => setMobileOpen(!mobileOpen)}>
            <span className="sr-only">Toggle menu</span>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Left nav (Desktop) */}
        <nav className="hidden lg:flex gap-6 flex-1 items-center">
          <Link
            href="/collections/all"
            className="text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-colors hover:opacity-100"
            style={{ color: SMOKE, fontFamily: SANS }}
            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={(e) => (e.currentTarget.style.color = SMOKE)}
          >
            Shop All
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              className="text-xs tracking-[0.18em] uppercase whitespace-nowrap transition-colors hover:opacity-100 flex items-center gap-1 cursor-pointer"
              style={{ color: SMOKE, fontFamily: SANS, background: "none", border: "none" }}
            >
              Categories <ChevronDown size={12} className={`transition-transform duration-300 ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div
                className="absolute left-0 pt-2 w-56 z-50 animate-fade-in"
                style={{ fontFamily: SANS }}
              >
                <div
                  className="bg-white border rounded shadow-md py-2"
                  style={{ borderColor: "rgba(201,162,39,0.15)" }}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/collections/${cat.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#FDF9F3] hover:text-[#C9A227] transition-colors uppercase tracking-wider"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      href="/collections/all"
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-[#C9A227] hover:bg-[#FDF9F3] transition-colors uppercase tracking-wider"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Logo (Centered) */}
        <Link
          href="/"
          className="flex-shrink-0 text-center cursor-pointer block mx-2 animate-fade-in"
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
            {/* Search Icon */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 transition-opacity hover:opacity-60 cursor-pointer"
              style={{ color: CHARCOAL }}
            >
              <span className="sr-only">Search</span>
              <Search size={17} />
            </button>

            {/* Profile User Icon with Dropdown */}
            <div className="relative">
              <button
                aria-label="User profile"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-1 transition-opacity hover:opacity-60 cursor-pointer block"
                style={{ color: CHARCOAL }}
              >
                <span className="sr-only">User profile</span>
                <User size={17} />
              </button>
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-48 bg-white border rounded shadow-md py-2 z-50 animate-fade-in"
                  style={{ borderColor: "rgba(201,162,39,0.15)", fontFamily: SANS }}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-50 text-xs text-gray-500 truncate">
                        Signed in as <p className="font-semibold text-gray-800 mt-0.5 truncate">{user.name}</p>
                      </div>
                      <Link
                          href="/account"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#FDF9F3] hover:text-[#C9A227] transition-colors font-medium"
                        >
                          My Account
                        </Link>
                      <Link
                          href="/account/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#FDF9F3] hover:text-[#C9A227] transition-colors"
                        >
                          My Orders
                        </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin/ramana"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#FDF9F3] hover:text-[#C9A227] transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-xs text-gray-700 hover:bg-[#FDF9F3] hover:text-red-600 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#FDF9F3] hover:text-[#C9A227] transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-[#FDF9F3] hover:text-[#C9A227] transition-colors"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Heart Icon */}
            <button
              aria-label="Wishlist"
              onClick={() => setWishlistOpen(true)}
              className="p-1 transition-opacity hover:opacity-60 cursor-pointer relative"
              style={{ color: CHARCOAL }}
            >
              <span className="sr-only">Wishlist</span>
              <Heart size={17} />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                  style={{ background: MAROON, fontSize: "8px", fontFamily: SANS }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-1 transition-opacity hover:opacity-60"
              style={{ color: CHARCOAL }}
            >
              <span className="sr-only">Cart</span>
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
          <button
            aria-label="Search mobile"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 transition-opacity hover:opacity-60"
            style={{ color: CHARCOAL }}
          >
            <span className="sr-only">Search mobile</span>
            <Search size={20} />
          </button>
          <button
            aria-label="Wishlist mobile"
            onClick={() => setWishlistOpen(true)}
            className="p-2 transition-opacity hover:opacity-60 relative"
            style={{ color: CHARCOAL }}
          >
            <span className="sr-only">Wishlist mobile</span>
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span
                className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                style={{ background: MAROON, fontSize: "8px", fontFamily: SANS }}
              >
                {wishlistCount}
              </span>
            )}
          </button>
          <Link
            href="/cart"
            aria-label="Cart mobile"
            className="relative p-2 transition-opacity hover:opacity-60"
            style={{ color: CHARCOAL }}
          >
            <span className="sr-only">Cart mobile</span>
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

      {/* Slide-down Search Bar */}
      {searchOpen && (
        <div
          className="border-b animate-slide-down py-3 px-6"
          style={{ background: "#FDF9F3", borderColor: "rgba(201,162,39,0.12)" }}
        >
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search bridal necklaces, antique bangles, harams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none py-1 text-gray-800"
              style={{ fontFamily: SANS }}
            />
            <button type="button" onClick={() => setSearchOpen(false)}>
              <X size={16} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="lg:hidden absolute left-0 right-0 w-full shadow-lg overflow-y-auto" style={{ background: IVORY, borderTop: `1px solid rgba(201,162,39,0.12)`, maxHeight: "calc(100vh - 70px)" }}>
          <div className="px-6 py-4">
            {user ? (
              <div className="flex flex-col gap-2 mb-6" style={{ fontFamily: SANS }}>
                <p className="text-xs text-gray-400">Signed in as <span className="font-semibold text-gray-800">{user.name}</span></p>
                {user.role === "admin" && (
                  <Link href="/admin/ramana" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-[#C9A227]">
                    Admin Dashboard →
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left text-sm text-red-500 font-medium mt-1">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 mb-6 text-sm" style={{ color: CHARCOAL, fontFamily: SANS }}>
                <User size={16} /> Sign In
              </Link>
            )}
            <Link
              href="/collections/all"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-left py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A227]"
              style={{ fontFamily: SANS, borderBottom: `1px solid rgba(201,162,39,0.15)` }}
            >
              Shop All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left py-4 text-xs tracking-[0.2em] uppercase"
                style={{ color: CHARCOAL, fontFamily: SANS, borderBottom: `1px solid rgba(201,162,39,0.1)` }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Slide-out Wishlist Drawer */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.4)" }}>
          {/* Backdrop closer */}
          <div className="flex-1" onClick={() => setWishlistOpen(false)} />
          
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#C9A227]" />
                <h3 className="text-base font-semibold" style={{ fontFamily: SANS, color: CHARCOAL }}>Your Wishlist</h3>
              </div>
              <button onClick={() => setWishlistOpen(false)} className="p-1 cursor-pointer"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-20">
                  <Heart size={36} className="mx-auto mb-3 text-gray-200" />
                  <p className="text-sm text-gray-400" style={{ fontFamily: SANS }}>Your wishlist is empty.</p>
                </div>
              ) : (
                wishlist.map((p) => (
                  <div key={p.slug} className="flex gap-4 p-3 border rounded-sm" style={{ borderColor: "rgba(201,162,39,0.12)", background: "#FDF9F3" }}>
                    <div className="w-16 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
                      <img src={p.images?.[0] || p.img || I.display} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0" style={{ fontFamily: SANS }}>
                      <h4 className="text-xs font-semibold text-gray-800 truncate mb-0.5">{p.name}</h4>
                      <p className="text-xs text-[#C9A227] font-semibold mb-2">{fmt(p.price)}</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            addToCart(p);
                            alert("Added to cart!");
                          }}
                          className="flex items-center gap-1 bg-[#C9A227] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm hover:opacity-90"
                        >
                          <ShoppingCart size={10} /> Add
                        </button>
                        <button
                          onClick={() => toggleWishlist(p)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
