"use client";

import { useState, useEffect } from "react";
import { Instagram, Facebook, Twitter, Youtube, MessageCircle } from "lucide-react";
import { Constants } from "../lib/mock-data";
import Link from "next/link";

const { GOLD, CHARCOAL, SANS, SERIF, IVORY } = Constants;

export function Footer() {
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  const cols = [
    { 
      title: "Shop", 
      items: [
        { label: "Necklaces", href: "/collections/necklaces" },
        { label: "Long Harams", href: "/collections/long-harams" },
        { label: "Bangles", href: "/collections/bangles" },
        { label: "Bridal Sets", href: "/collections/bridal-sets" },
        { label: "Hipbelts", href: "/collections/hipbelts" },
        { label: "Tikkas", href: "/collections/tikkas" },
      ]
    },
    { 
      title: "Brand", 
      items: [
        { label: "Our Story", href: "/about" },
        { label: "Craftsmanship", href: "/about" },
        { label: "Blog", href: "/blog" },
      ]
    },
    { 
      title: "Support", 
      items: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Shipping & Returns", href: "/shipping-and-returns" },
        ...(whatsappNumber ? [{ label: "WhatsApp", href: `https://wa.me/${whatsappNumber}`, external: true }] : []),
      ]
    },
  ];

  return (
    <footer style={{ background: CHARCOAL }}>
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-6 mb-12">
          <div className="col-span-2 md:col-span-2">
            <h2 className="text-2xl font-normal mb-1" style={{ fontFamily: SERIF, color: IVORY }}>
              Ramana Jewells
            </h2>
            <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ color: GOLD, fontFamily: SANS }}>
              Premium Jewellery
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(250,247,242,0.55)", fontFamily: SANS }}>
              Exquisite South Indian temple jewellery designs. Premium gold finish, quality guaranteed.
            </p>
            <div className="flex gap-2 mb-6">
              <a
                href="https://www.instagram.com/ramana_jewells?igsh=MWxlN3h1c3Q0dTVuaA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-opacity hover:opacity-70"
                style={{ border: `1px solid rgba(201,162,39,0.3)`, color: GOLD }}
              >
                <Instagram size={14} />
              </a>
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 transition-opacity hover:opacity-70"
                  style={{ border: `1px solid rgba(201,162,39,0.3)`, color: GOLD }}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                style={{ background: "#25D366", color: "#fff", fontFamily: SANS }}
              >
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            )}
          </div>

          {cols.map((col) => (
            <div key={col.title} className="col-span-1">
              <h4
                className="text-xs tracking-[0.25em] uppercase mb-5"
                style={{ color: GOLD, fontFamily: SANS }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-left transition-opacity hover:opacity-80 block"
                        style={{ color: "rgba(250,247,242,0.55)", fontFamily: SANS }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-left transition-opacity hover:opacity-80 block"
                        style={{ color: "rgba(250,247,242,0.55)", fontFamily: SANS }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: `1px solid rgba(201,162,39,0.12)` }}
        >
          <p className="text-xs" style={{ color: "rgba(250,247,242,0.35)", fontFamily: SANS }}>
            © 2026 Ramana Jewells. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "rgba(250,247,242,0.35)", fontFamily: SANS }}>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>·</span>
            <span className="opacity-50">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
