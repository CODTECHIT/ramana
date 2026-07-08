"use client";

import { Constants } from "../../../lib/mock-data";

const { GOLD, IVORY, CHARCOAL, SMOKE, SANS, SERIF } = Constants;

export default function PrivacyPolicyPage() {
  return (
    <main style={{ background: IVORY, minHeight: "100vh" }} className="py-8 md:py-16 px-4 md:px-0">
      <div className="max-w-3xl mx-auto px-6" style={{ fontFamily: SANS }}>
        <h1 className="text-4xl font-normal mb-2 text-center" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Privacy Policy
        </h1>
        <p className="text-xs uppercase tracking-widest text-center mb-6 md:mb-12" style={{ color: GOLD }}>
          Last Updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: SMOKE }}>
          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when registering an account, placing an order, subscribing to our newsletter, or contacting customer support. This includes name, email address, billing and shipping address, phone number, and payment preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>2. How We Use Your Information</h2>
            <p>
              We use your information to process transactions, deliver orders, send tracking notifications, optimize website speed, and improve customer service. If you opt-in, we may also send email marketing notifications about new product releases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>3. Data Security & Encryption</h2>
            <p>
              We prioritize customer safety. Payment transactions are encrypted via SSL protocol and processed through secure tokenized third-party platforms. We do not store raw credit card numbers or banking passwords on our local databases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>4. Cookies & Analytics</h2>
            <p>
              We use cookies to remember cart items, user preferences, and analyze user interactions to refine site layout. You may disable cookies in your browser settings, though doing so might affect checkout functionality.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
