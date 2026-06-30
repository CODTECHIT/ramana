"use client";

import { Constants } from "../../../lib/mock-data";

const { GOLD, IVORY, CHARCOAL, SMOKE, SANS, SERIF } = Constants;

export default function AboutPage() {
  return (
    <main style={{ background: IVORY, minHeight: "100vh" }} className="py-16">
      <div className="max-w-3xl mx-auto px-6" style={{ fontFamily: SANS }}>
        <h1 className="text-4xl font-normal mb-2 text-center" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Our Story & Craft
        </h1>
        <p className="text-xs uppercase tracking-widest text-center mb-12" style={{ color: GOLD }}>
          Ramana Jewells Legacy
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: SMOKE }}>
          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>Legacy of Craftsmanship</h2>
            <p>
              Ramana Jewells was founded with a singular mission: to bring the breathtaking elegance of heritage South Indian temple designs to modern jewellery lovers. Inspired by three generations of master artisans, each of our pieces captures the grandeur of royal wedding collections and temple motifs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>Premium Antique Gold Finish</h2>
            <p>
              We specialize in heirloom-quality designer replica jewellery. Our collection features premium plating finishes that look identical to solid antique gold but are made accessible and comfortable for long wedding events and celebrations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3" style={{ color: CHARCOAL }}>Empowering Local Karigars</h2>
            <p>
              Every piece in our shop represents hours of meticulous work by our skilled karigars (craftsmen) based in major temple carving hubs like Kancheepuram, Jaipur, and Coimbatore. We work directly with them to sustain local craftsmanship and ensure fair wages.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
