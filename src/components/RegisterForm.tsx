"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Constants } from "../lib/mock-data";

const { GOLD, IVORY, CHARCOAL, SANS, SERIF, SMOKE } = Constants;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md p-8 my-10"
      style={{ border: `1px solid rgba(201,162,39,0.3)` }}
    >
      <h1
        className="text-3xl font-normal text-center mb-2"
        style={{ fontFamily: SERIF, color: CHARCOAL }}
      >
        Create Account
      </h1>
      <p
        className="text-center text-sm mb-8"
        style={{ fontFamily: SANS, color: SMOKE }}
      >
        Join Ramana Jewells
      </p>

      {error && (
        <div
          className="mb-6 p-3 text-sm text-center"
          style={{
            backgroundColor: "#fdf2f2",
            color: "#e53e3e",
            border: "1px solid #fc8181",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block text-xs uppercase tracking-wider mb-2"
            style={{ color: CHARCOAL, fontFamily: SANS }}
          >
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 outline-none"
            style={{
              border: `1px solid rgba(201,162,39,0.3)`,
              background: "transparent",
              color: CHARCOAL,
              fontFamily: SANS,
            }}
          />
        </div>
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
            className="w-full p-3 outline-none"
            style={{
              border: `1px solid rgba(201,162,39,0.3)`,
              background: "transparent",
              color: CHARCOAL,
              fontFamily: SANS,
            }}
          />
        </div>
        <div>
          <label
            className="block text-xs uppercase tracking-wider mb-2"
            style={{ color: CHARCOAL, fontFamily: SANS }}
          >
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 outline-none"
            style={{
              border: `1px solid rgba(201,162,39,0.3)`,
              background: "transparent",
              color: CHARCOAL,
              fontFamily: SANS,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-4 text-xs uppercase tracking-[0.15em]"
          style={{
            background: GOLD,
            color: CHARCOAL,
            fontFamily: SANS,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div
        className="mt-8 text-center text-sm"
        style={{ color: SMOKE, fontFamily: SANS }}
      >
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
          style={{ color: GOLD }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
