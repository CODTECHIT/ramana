"use client";

import { useState } from "react";
import Link from "next/link";

const GOLD = "#C9A227";
const CHARCOAL = "#1A1A2E";
const IVORY = "#FDF9F3";
const SMOKE = "#6B6A69";
const SANS = "'Inter', sans-serif";
const SERIF = "'Playfair Display', serif";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.message || "Something went wrong. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{ background: IVORY, minHeight: "100vh" }}
      className="flex items-center justify-center py-20 px-6"
    >
      <div
        className="w-full max-w-md p-8 bg-white rounded shadow-sm border"
        style={{ borderColor: "rgba(201,162,39,0.18)" }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-normal mb-2"
            style={{ fontFamily: SERIF, color: CHARCOAL }}
          >
            Forgot Password
          </h1>
          <p className="text-sm" style={{ color: SMOKE, fontFamily: SANS }}>
            Enter your registered email address and we&apos;ll send you a password reset link.
          </p>
        </div>

        {message && (
          <div
            className="mb-5 px-4 py-3 rounded text-sm"
            style={{
              background: message.type === "success" ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
              color: message.type === "success" ? "#16a34a" : "#dc2626",
              border: `1px solid ${message.type === "success" ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
              fontFamily: SANS,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: CHARCOAL, fontFamily: SANS }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              className="w-full px-3 py-3 text-sm outline-none"
              style={{
                border: `1px solid rgba(201,162,39,0.3)`,
                background: IVORY,
                color: CHARCOAL,
                fontFamily: SANS,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs uppercase tracking-widest transition-opacity"
            style={{
              background: GOLD,
              color: CHARCOAL,
              fontFamily: SANS,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p
          className="mt-6 text-center text-xs"
          style={{ color: SMOKE, fontFamily: SANS }}
        >
          Remembered your password?{" "}
          <Link href="/login" style={{ color: GOLD }}>
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
