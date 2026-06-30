"use client";

import { Constants } from "../../lib/mock-data";

const { GOLD, CHARCOAL, MIST, SMOKE, IVORY, SANS, SERIF } = Constants;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
  accent?: string;
}

export function StatCard({ label, value, icon, sub, accent = GOLD }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4 shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      style={{ background: IVORY, borderColor: MIST }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18` }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: CHARCOAL, fontFamily: SERIF }}>
          {value}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: SMOKE, fontFamily: SANS }}>
          {label}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: accent, fontFamily: SANS }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export function SkeletonCard({ height = "h-24" }: { height?: string }) {
  return (
    <div
      className={`rounded-2xl ${height} animate-pulse`}
      style={{ background: MIST }}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: `${GOLD}14` }}
      >
        <span style={{ color: GOLD, opacity: 0.7 }}>{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: CHARCOAL, fontFamily: SERIF }}>
        {title}
      </h3>
      <p className="text-sm max-w-xs mb-6" style={{ color: SMOKE, fontFamily: SANS }}>
        {description}
      </p>
      {action}
    </div>
  );
}

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Pending" | "Returned" | "Refunded" | "Confirmed";

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  Processing: { bg: "#FFF3CD", text: "#856404", label: "Processing" },
  Pending:    { bg: "#FFF3CD", text: "#856404", label: "Pending" },
  Confirmed:  { bg: "#D1ECF1", text: "#0C5460", label: "Confirmed" },
  Shipped:    { bg: "#CCE5FF", text: "#004085", label: "Shipped" },
  Delivered:  { bg: "#D4EDDA", text: "#155724", label: "Delivered" },
  Cancelled:  { bg: "#F8D7DA", text: "#721C24", label: "Cancelled" },
  Returned:   { bg: "#F5C6CB", text: "#721C24", label: "Returned" },
  Refunded:   { bg: "#E2E3E5", text: "#383D41", label: "Refunded" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as OrderStatus] ?? { bg: MIST, text: SMOKE, label: status };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text, fontFamily: SANS }}
    >
      {cfg.label}
    </span>
  );
}

interface TimelineStep {
  label: string;
  date?: string;
  done: boolean;
  active?: boolean;
}

export function OrderTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 items-start">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all"
              style={{
                borderColor: step.done || step.active ? GOLD : MIST,
                background: step.done ? GOLD : step.active ? `${GOLD}20` : "white",
              }}
            >
              {step.done && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IVORY} strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {step.active && !step.done && (
                <div className="w-3 h-3 rounded-full" style={{ background: GOLD }} />
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="w-0.5 h-8 mt-1" style={{ background: step.done ? GOLD : MIST }} />
            )}
          </div>
          <div className="pb-6 pt-1 min-w-0">
            <p
              className="text-sm font-semibold"
              style={{ color: step.done || step.active ? CHARCOAL : SMOKE, fontFamily: SANS }}
            >
              {step.label}
            </p>
            {step.date && (
              <p className="text-xs mt-0.5" style={{ color: SMOKE, fontFamily: SANS }}>
                {step.date}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-normal" style={{ color: CHARCOAL, fontFamily: SERIF }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: SMOKE, fontFamily: SANS }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
