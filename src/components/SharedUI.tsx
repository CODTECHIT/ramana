"use client";

import { useState } from "react";
import { Constants } from "../lib/mock-data";

const { GOLD, DARK_GOLD, IVORY, CHARCOAL, SANS, SERIF } = Constants;

export function GoldDivider() {
  return (
    <div className="flex items-center justify-center my-14 opacity-90 max-w-2xl mx-auto w-full px-4">
      <div className="h-[2px] flex-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD} 80%, ${GOLD})` }} />
      <div className="mx-5 flex flex-col items-center justify-center relative" style={{ color: GOLD }}>
        <svg width="48" height="48" viewBox="0 0 64 64" fill="currentColor">
          {/* Coconut */}
          <path d="M32 4 C28 4 24 10 24 14 C24 14 28 16 32 16 C36 16 40 14 40 14 C40 10 36 4 32 4 Z"/>
          {/* Mango Leaves */}
          <path d="M24 14 C16 10 8 12 8 12 C8 12 12 20 20 22 C22 23 24 22 24 22 Z"/>
          <path d="M40 14 C48 10 56 12 56 12 C56 12 52 20 44 22 C42 23 40 22 40 22 Z"/>
          <path d="M21 16 C12 15 4 20 4 20 C4 20 10 27 18 26 C20 25 21 24 21 24 Z"/>
          <path d="M43 16 C52 15 60 20 60 20 C60 20 54 27 46 26 C44 25 43 24 43 24 Z"/>
          {/* Kalash Pot Body */}
          <path d="M22 22 C12 22 10 36 10 42 C10 52 20 56 32 56 C44 56 54 52 54 42 C54 36 52 22 42 22 L22 22 Z" />
          {/* Intricate Swastika / Pattern inside the pot */}
          <path d="M32 28 V46 M24 37 H40" stroke={IVORY} strokeWidth="2" strokeLinecap="round" />
          <path d="M24 37 V28 H28 M40 37 V46 H36 M32 28 H40 V32 M32 46 H24 V42" stroke={IVORY} strokeWidth="2" fill="none" />
          {/* Base / Stand */}
          <path d="M24 56 L18 62 H46 L40 56 Z" />
          {/* Dots */}
          <circle cx="28" cy="33" r="1.5" fill={IVORY} />
          <circle cx="36" cy="33" r="1.5" fill={IVORY} />
          <circle cx="28" cy="41" r="1.5" fill={IVORY} />
          <circle cx="36" cy="41" r="1.5" fill={IVORY} />
        </svg>
      </div>
      <div className="h-[2px] flex-1" style={{ background: `linear-gradient(270deg, transparent, ${GOLD} 80%, ${GOLD})` }} />
    </div>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-[0.3em] uppercase mb-2 font-medium" style={{ color: GOLD, fontFamily: SANS }}>
      {children}
    </p>
  );
}

export function SectionHeading({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2
      className={`text-4xl font-normal leading-tight ${center ? "text-center" : ""}`}
      style={{ fontFamily: SERIF, color: CHARCOAL }}
    >
      {children}
    </h2>
  );
}

export function GoldBtn({
  children,
  onClick,
  outline = false,
  full = false,
  sm = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  outline?: boolean;
  full?: boolean;
  sm?: boolean;
  disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`${full ? "w-full" : ""} ${sm ? "px-5 py-2 text-xs" : "px-8 py-3 text-xs"} tracking-[0.18em] uppercase font-medium transition-all duration-300 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{
        fontFamily: SANS,
        background: outline ? "transparent" : hov ? DARK_GOLD : GOLD,
        color: outline ? (hov ? GOLD : IVORY) : IVORY,
        border: `1px solid ${GOLD}`,
      }}
    >
      {children}
    </button>
  );
}

export function UtilityBar({ ticker }: { ticker: string[] }) {
  const doubled = [...ticker, ...ticker, ...ticker];
  return (
    <div className="overflow-hidden py-2" style={{ background: CHARCOAL }}>
      <div
        style={{
          display: "flex",
          animation: "smTicker 35s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center text-xs tracking-[0.2em] uppercase"
            style={{ color: GOLD, fontFamily: SANS, paddingRight: "3rem" }}
          >
            {item}
            <span style={{ marginLeft: "3rem", opacity: 0.3 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
