"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Constants } from "../../../../../lib/mock-data";

const { GOLD, SANS, SERIF } = Constants;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      // Successful login will set cookies via the backend
      router.push("/admin/ramana");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F6] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl" style={{ fontFamily: SERIF, color: "#1A1A2E" }}>Ramana Jewells</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280", fontFamily: SANS }}>Admin Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded" style={{ fontFamily: SANS }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] transition-colors"
              style={{ fontFamily: SANS }}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: "#374151", fontFamily: SANS }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#C9A227] transition-colors"
              style={{ fontFamily: SANS }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 text-white font-medium rounded transition-opacity hover:opacity-90 uppercase tracking-widest text-xs"
            style={{ background: GOLD, fontFamily: SANS }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
