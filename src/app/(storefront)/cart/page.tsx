"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Shield } from "lucide-react";
import { GoldBtn } from "../../../components/SharedUI";
import { useCart } from "../../../components/CartProvider";
import { Constants, fmt } from "../../../lib/mock-data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/AuthProvider";

const { GOLD, CHARCOAL, IVORY, MIST, SMOKE, SANS, SERIF } = Constants;

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name: "", phone: "", street: "", city: "", pin: "", state: "Tamil Nadu" });
  const [pay, setPay] = useState("upi");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal > 500000 ? 0 : 299;
  const total     = subtotal + shipping;

  const STEPS = ["Cart", "Address", "Payment"];

  const PAY_METHODS = [
    { id: "upi",        label: "UPI (PhonePe, GPay, Paytm)", desc: "Instant transfer, no extra charges"    },
    { id: "netbanking", label: "Net Banking",                 desc: "All major banks supported"              },
    { id: "card",       label: "Credit / Debit Card",         desc: "Visa, Mastercard, RuPay — 0% EMI"      },
    { id: "cod",        label: "Cash on Delivery",            desc: "Pay when your jewellery arrives"        },
  ];

  const STATES = ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Kerala", "Maharashtra", "Delhi", "Telangana"];

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-14">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    background: i <= step ? GOLD : "transparent",
                    color: i <= step ? IVORY : SMOKE,
                    border: `1.5px solid ${i <= step ? GOLD : "rgba(201,162,39,0.3)"}`,
                    fontFamily: SANS,
                  }}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span
                  className="text-xs mt-1.5 tracking-wider uppercase"
                  style={{ color: i <= step ? GOLD : SMOKE, fontFamily: SANS }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="w-20 md:w-28 mx-3 mb-5"
                  style={{ height: 1, background: i < step ? GOLD : "rgba(201,162,39,0.2)" }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: SERIF, color: CHARCOAL }}>Your Cart</h2>
                {cart.length === 0 ? (
                  <div className="text-center py-24">
                    <ShoppingBag size={42} className="mx-auto mb-4" style={{ color: "rgba(201,162,39,0.3)" }} />
                    <p className="text-sm mb-6" style={{ color: SMOKE, fontFamily: SANS }}>Your cart is empty</p>
                    <GoldBtn onClick={() => router.push("/collections/all")}>Explore Jewellery</GoldBtn>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4"
                        style={{ background: "#FDF9F3", border: `1px solid rgba(201,162,39,0.15)` }}
                      >
                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden" style={{ background: MIST }}>
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm mb-1 truncate" style={{ fontFamily: SERIF, color: CHARCOAL }}>{item.name}</h3>
                          <p className="text-xs mb-1" style={{ color: SMOKE, fontFamily: SANS }}>{item.variant}</p>
                          <p className="text-sm font-medium mb-3" style={{ fontFamily: SANS, color: CHARCOAL }}>{fmt(item.price)}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center" style={{ border: `1px solid rgba(201,162,39,0.3)` }}>
                              <button className="px-2 py-1.5" onClick={() => updateQuantity(item.id, item.qty - 1)}><Minus size={11} style={{ color: CHARCOAL }} /></button>
                              <span className="px-3 text-xs" style={{ color: CHARCOAL, fontFamily: SANS }}>{item.qty}</span>
                              <button className="px-2 py-1.5" onClick={() => updateQuantity(item.id, item.qty + 1)}><Plus size={11} style={{ color: CHARCOAL }} /></button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs hover:opacity-60 transition-opacity"
                              style={{ color: SMOKE, fontFamily: SANS }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                            {fmt(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: SERIF, color: CHARCOAL }}>Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name",   label: "Full Name",       placeholder: "Priya Ramamurthy",      span: 1 },
                    { key: "phone",  label: "Mobile Number",   placeholder: "+91 98400 12345",        span: 1 },
                    { key: "street", label: "Street Address",  placeholder: "42, Anna Nagar Main Road", span: 2 },
                    { key: "city",   label: "City",            placeholder: "Chennai",                span: 1 },
                    { key: "pin",    label: "PIN Code",        placeholder: "600040",                 span: 1 },
                  ].map((f) => (
                    <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
                      <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: CHARCOAL, fontFamily: SANS }}>
                        {f.label}
                      </label>
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={addr[f.key as keyof typeof addr]}
                        onChange={(e) => setAddr({ ...addr, [f.key]: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm outline-none"
                        style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "#FDF9F3", color: CHARCOAL, fontFamily: SANS }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs tracking-wider uppercase mb-1.5" style={{ color: CHARCOAL, fontFamily: SANS }}>State</label>
                    <select
                      value={addr.state}
                      onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm outline-none"
                      style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "#FDF9F3", color: CHARCOAL, fontFamily: SANS }}
                    >
                      {STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-normal mb-6" style={{ fontFamily: SERIF, color: CHARCOAL }}>Payment</h2>
                <div className="space-y-3">
                  {PAY_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 p-4 cursor-pointer transition-all"
                      style={{
                        border: `1.5px solid ${pay === m.id ? GOLD : "rgba(201,162,39,0.2)"}`,
                        background: pay === m.id ? "rgba(201,162,39,0.04)" : "#FDF9F3",
                      }}
                      onClick={() => setPay(m.id)}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ border: `1.5px solid ${pay === m.id ? GOLD : "rgba(36,31,26,0.25)"}` }}
                      >
                        {pay === m.id && (
                          <div className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: CHARCOAL, fontFamily: SANS }}>{m.label}</p>
                        <p className="text-xs" style={{ color: SMOKE, fontFamily: SANS }}>{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div
              className="p-6 sticky top-6"
              style={{ background: "#FDF9F3", border: `1px solid rgba(201,162,39,0.18)` }}
            >
              <h3 className="text-lg font-normal mb-5" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                Order Summary
              </h3>

              <div className="space-y-2.5 pb-4 mb-4" style={{ borderBottom: `1px solid rgba(201,162,39,0.12)` }}>
                {cart.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm gap-2">
                    <span className="truncate flex-1" style={{ color: SMOKE, fontFamily: SANS }}>
                      {i.name} ×{i.qty}
                    </span>
                    <span className="flex-shrink-0" style={{ color: CHARCOAL, fontFamily: SANS }}>
                      {fmt(i.price * i.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pb-4 mb-4" style={{ borderBottom: `1px solid rgba(201,162,39,0.12)` }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: SMOKE, fontFamily: SANS }}>Subtotal</span>
                  <span style={{ color: CHARCOAL, fontFamily: SANS }}>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: SMOKE, fontFamily: SANS }}>Insured Shipping</span>
                  <span style={{ color: shipping === 0 ? GOLD : CHARCOAL, fontFamily: SANS }}>
                    {shipping === 0 ? "Free" : fmt(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-medium" style={{ fontFamily: SERIF, color: CHARCOAL }}>Total</span>
                <span className="text-xl font-normal" style={{ fontFamily: SERIF, color: CHARCOAL }}>{fmt(total)}</span>
              </div>

              {step < 2 ? (
                <GoldBtn 
                  onClick={() => {
                    if (step === 0 && !user) {
                      router.push("/login?redirect=/cart");
                    } else {
                      setStep((s) => s + 1);
                    }
                  }} 
                  full
                >
                  {step === 0 ? "Proceed to Checkout" : "Continue to Payment"}
                </GoldBtn>
              ) : (
                <GoldBtn onClick={() => alert("Order placed! Confirmation sent to WhatsApp.")} full>
                  Place Order
                </GoldBtn>
              )}

              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="w-full mt-3 text-xs tracking-wider uppercase text-center hover:opacity-60 transition-opacity py-2"
                  style={{ color: SMOKE, fontFamily: SANS }}
                >
                  ← Back
                </button>
              )}

              <div className="mt-5 flex items-center justify-center gap-2">
                <Shield size={12} style={{ color: GOLD }} />
                <span className="text-xs" style={{ color: SMOKE, fontFamily: SANS }}>256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
