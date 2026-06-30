"use client";

import { Constants } from "../../../lib/mock-data";

const { GOLD, IVORY, CHARCOAL, SMOKE, SANS, SERIF } = Constants;

export default function FAQPage() {
  const faqs = [
    {
      q: "Is your jewellery made of real gold?",
      a: "No. Ramana Jewells offers premium designer replica and imitation jewellery. Our products are crafted from alloy bases like copper and brass with high-quality gold plating. They look identical to antique solid gold but contain no real gold metal.",
    },
    {
      q: "How should I care for my premium finish jewellery?",
      a: "Keep your pieces stored in the velvet boxes we provide. Avoid exposing them to water, perfume, hairsprays, or chlorine. Wipe them gently with a soft dry cloth after use to clean sweat and oils.",
    },
    {
      q: "Do you offer cash on delivery (COD)?",
      a: "Yes! We support Cash on Delivery across most pin codes in India. You can select COD at the checkout page.",
    },
    {
      q: "What is your return policy?",
      a: "We offer a 7-day hassle-free return policy for unused items in their original packaging. Please reach out to our WhatsApp support or support email to initiate a return request.",
    },
  ];

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }} className="py-16">
      <div className="max-w-3xl mx-auto px-6" style={{ fontFamily: SANS }}>
        <h1 className="text-4xl font-normal mb-2 text-center" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Frequently Asked Questions
        </h1>
        <p className="text-xs uppercase tracking-widest text-center mb-12" style={{ color: GOLD }}>
          Quick Answers To Common Questions
        </p>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 border rounded shadow-sm" style={{ borderColor: "rgba(201,162,39,0.15)" }}>
              <h3 className="text-base font-semibold mb-2" style={{ color: CHARCOAL }}>
                {faq.q}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: SMOKE }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
