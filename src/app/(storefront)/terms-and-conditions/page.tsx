"use client";

import { Constants } from "../../../lib/mock-data";

const { GOLD, IVORY, CHARCOAL, SMOKE, SANS, SERIF } = Constants;

export default function TermsAndConditionsPage() {
  return (
    <main style={{ background: IVORY, minHeight: "100vh" }} className="py-8 md:py-16 px-4 md:px-0">
      <div className="max-w-3xl mx-auto px-6" style={{ fontFamily: SANS }}>
        <h1 className="text-4xl font-normal mb-2 text-center" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Terms & Conditions
        </h1>
        <p className="text-xs uppercase tracking-widest text-center mb-6 md:mb-12" style={{ color: GOLD }}>
          Last Updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: SMOKE }}>
          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>1. Acceptance of Terms</h2>
            <p>
              Welcome to Ramana Jewells. By accessing or using our website, purchasing our premium finish jewellery, or engaging with our customer support channels, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>2. Product Information & Disclaimers</h2>
            <p>
              All products listed on this website are premium-quality imitation and designer fashion jewellery. Our pieces are crafted using brass, copper, or mixed alloy bases with gold-toned plating and artificial stones (synthetic rubies, emeralds, and uncut synthetic diamonds). 
            </p>
            <p className="mt-2 font-medium" style={{ color: GOLD }}>
              Please Note: Ramana Jewells does not sell real, solid gold or precious gemstone jewellery. None of our products contain solid 22KT, 18KT, or 24KT precious gold metal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>3. Pricing & Payments</h2>
            <p>
              Prices listed on our site are in Indian Rupees (INR) and are inclusive of standard local taxes unless stated otherwise. We accept major credit cards, debit cards, UPI, and bank transfers through secure payment gateways. Ramana Jewells reserves the right to modify pricing or refuse orders in case of typographical errors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>4. Order Cancellation & Edits</h2>
            <p>
              Orders can only be cancelled or modified within 2 hours of placement. Once an order has entered our processing line or shipped via our delivery partners, it cannot be modified.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>5. Limitation of Liability</h2>
            <p>
              Ramana Jewells shall not be held liable for any indirect, incidental, or consequential damages resulting from the use of our products, skin sensitivities, or delivery delays out of our immediate control.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
