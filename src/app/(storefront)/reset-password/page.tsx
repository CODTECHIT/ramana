"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const GOLD = "#C9A227";
const CHARCOAL = "#1A1A2E";
const IVORY = "#FDF9F3";
const SMOKE = "#6B6A69";
const SANS = "'Inter', sans-serif";
const SERIF = "'Playfair Display', serif";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3500);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-green-50">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-normal mb-3" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Password Reset!
        </h2>
        <p className="text-sm mb-6" style={{ color: SMOKE, fontFamily: SANS }}>
          Your password has been successfully updated. Redirecting you to the login page...
        </p>
        <Link
          href="/login"
          className="text-xs uppercase tracking-widest"
          style={{ color: GOLD, fontFamily: SANS }}
        >
          Go to Login →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-normal mb-2" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Reset Password
        </h1>
        <p className="text-sm" style={{ color: SMOKE, fontFamily: SANS }}>
          Enter your new password below.
        </p>
      </div>

      {error && (
        <div
          className="mb-5 px-4 py-3 rounded text-sm"
          style={{
            background: "rgba(220,38,38,0.08)",
            color: "#dc2626",
            border: "1px solid rgba(220,38,38,0.2)",
            fontFamily: SANS,
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
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            className="w-full px-3 py-3 text-sm outline-none"
            style={{
              border: "1px solid rgba(201,162,39,0.3)",
              background: IVORY,
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
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full px-3 py-3 text-sm outline-none"
            style={{
              border: "1px solid rgba(201,162,39,0.3)",
              background: IVORY,
              color: CHARCOAL,
              fontFamily: SANS,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full py-4 text-xs uppercase tracking-widest transition-opacity"
          style={{
            background: GOLD,
            color: CHARCOAL,
            fontFamily: SANS,
            opacity: loading || !token ? 0.6 : 1,
            cursor: loading || !token ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main
      style={{ background: IVORY, minHeight: "100vh" }}
      className="flex items-center justify-center py-20 px-6"
    >
      <div
        className="w-full max-w-md p-8 bg-white rounded shadow-sm border"
        style={{ borderColor: "rgba(201,162,39,0.18)" }}
      >
        <Suspense fallback={<p style={{ fontFamily: SANS, color: SMOKE }}>Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
