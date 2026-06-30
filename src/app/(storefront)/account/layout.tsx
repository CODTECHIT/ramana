"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthProvider";
import { DashboardSidebar } from "../../../components/dashboard/DashboardSidebar";
import { Constants } from "../../../lib/mock-data";

const { IVORY, MIST, SANS } = Constants;

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login?redirect=/account");
      } else if (user.role === "admin") {
        router.replace("/admin/ramana/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: IVORY }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: Constants.GOLD, borderTopColor: "transparent" }}
          />
          <p className="text-sm" style={{ color: Constants.SMOKE, fontFamily: SANS }}>
            Loading your account…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: IVORY, fontFamily: SANS }}
    >
      <DashboardSidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
