"use client";

// Prevent static export errors on platforms that attempt a full static export
// (e.g., `next export`). This forces the page to be rendered dynamically at
// runtime so client-only APIs and fetches don't run during build.
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../components/AuthProvider";
import { Constants } from "../../../lib/mock-data";
import Link from "next/link";

const { GOLD, IVORY, CHARCOAL, SANS, SERIF, SMOKE } = Constants;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/";
  const { checkAuth } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      if (res.ok) {
        await checkAuth(); // Re-fetch the user context
        router.push(redirectUrl);
      } else {
        const data = await res.json();
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: IVORY, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-full max-w-md p-8" style={{ border: `1px solid rgba(201,162,39,0.3)` }}>
        <h1 className="text-3xl font-normal text-center mb-2" style={{ fontFamily: SERIF, color: CHARCOAL }}>Sign In</h1>
        <p className="text-center text-sm mb-8" style={{ fontFamily: SANS, color: SMOKE }}>
          Access your Ramana Jewells account
        </p>

        {error && (
          <div className="mb-6 p-3 text-sm text-center" style={{ backgroundColor: "#fdf2f2", color: "#e53e3e", border: "1px solid #fc8181" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: CHARCOAL, fontFamily: SANS }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 outline-none"
              style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "transparent", color: CHARCOAL, fontFamily: SANS }}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: CHARCOAL, fontFamily: SANS }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 outline-none"
              style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "transparent", color: CHARCOAL, fontFamily: SANS }}
            />
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs" style={{ color: GOLD, fontFamily: SANS }}>
              Forgot Password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 text-xs uppercase tracking-[0.15em]"
            style={{ background: GOLD, color: CHARCOAL, fontFamily: SANS, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm" style={{ color: SMOKE, fontFamily: SANS }}>
          Don't have an account?{" "}
          <Link href={`/register?redirect=${encodeURIComponent(redirectUrl)}`} style={{ color: GOLD }}>
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}
