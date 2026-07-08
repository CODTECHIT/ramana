"use client";

import { useState } from "react";
import { Constants } from "../../../lib/mock-data";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

const { GOLD, IVORY, CHARCOAL, SMOKE, SANS, SERIF } = Constants;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }} className="py-8 md:py-16 px-4 md:px-0">
      <div className="max-w-4xl mx-auto px-6" style={{ fontFamily: SANS }}>
        <h1 className="text-4xl font-normal mb-2 text-center" style={{ fontFamily: SERIF, color: CHARCOAL }}>
          Contact Us
        </h1>
        <p className="text-xs uppercase tracking-widest text-center mb-6 md:mb-12" style={{ color: GOLD }}>
          Get In Touch With Our Support Team
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-normal mb-4" style={{ fontFamily: SERIF, color: CHARCOAL }}>
              We'd Love to Hear From You
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: SMOKE }}>
              Have questions about order customization, sizing, or shipping? Reach out via any of the channels below. Our support agents are active Monday to Saturday, 10 AM to 7 PM IST.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C9A227]" />
                <span className="text-sm" style={{ color: CHARCOAL }}>+91 99999 99999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#C9A227]" />
                <span className="text-sm" style={{ color: CHARCOAL }}>support@ramanajewells.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#C9A227]" />
                <span className="text-sm leading-snug" style={{ color: CHARCOAL }}>
                  12/A Temple Road, Coimbatore, Tamil Nadu, 641001
                </span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#25D366] hover:bg-[#25D366]/90 transition-colors"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-6 border rounded shadow-sm" style={{ borderColor: "rgba(201,162,39,0.15)" }}>
            {sent ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2" style={{ color: CHARCOAL }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: SMOKE }}>Thank you for reaching out. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: SMOKE }}>Name</label>
                  <input required type="text" className="w-full p-2 border rounded outline-none focus:border-[#C9A227] text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: SMOKE }}>Email</label>
                  <input required type="email" className="w-full p-2 border rounded outline-none focus:border-[#C9A227] text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1" style={{ color: SMOKE }}>Message</label>
                  <textarea required rows={4} className="w-full p-2 border rounded outline-none focus:border-[#C9A227] text-sm" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs tracking-wider uppercase text-white hover:opacity-90 transition-opacity"
                  style={{ background: GOLD }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
