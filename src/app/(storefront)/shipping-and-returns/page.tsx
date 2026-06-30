"use client";

import { Constants } from "../../../lib/mock-data";

const { GOLD, IVORY, CHARCOAL, SMOKE, SANS, SERIF } = Constants;

export default function ShippingAndReturnsPage() {
  return (
    <main style={{ background: IVORY, minHeight: "100vh" }} className="py-16">
      <div className="max-w-3xl mx-auto px-6" style={{ fontFamily: SANS }}>
        <h1 className="text-4xl font-normal mb-2 text-center" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Shipping & Returns
        </h1>
        <p className="text-xs uppercase tracking-widest text-center mb-12" style={{ color: GOLD }}>
          Deliveries, Exchanges & Returns Guide
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: SMOKE }}>
          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>1. Shipping Timelines</h2>
            <p>
              We ship orders within 24 to 48 hours of purchase. Standard delivery across India takes 3 to 5 business days. Express options are available during checkout for major metropolitan cities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>2. Tracking Your Shipment</h2>
            <p>
              Once your package leaves our warehouse, we send a tracking link to your registered email and phone number. Deliveries are handled by secure courier services like Blue Dart, Delhivery, and India Post.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>3. Return & Exchange Policy</h2>
            <p>
              We offer a 7-day hassle-free return policy on all unworn, unaltered, and tag-intact jewellery pieces in their original velvet boxes. 
            </p>
            <p className="mt-2">
              To initiate a return or exchange, please email us or contact us on WhatsApp with your Order ID and photos of the piece. Returns will be credited to your original payment mode or offered as store credits.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>4. Damage Claims</h2>
            <p>
              In the rare event that your product arrives damaged or defective, please contact us within 24 hours of delivery. An unboxing video is required for validating transit damage claims.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
