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

import { useEffect } from "react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, setCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name: "", phone: "", street: "", city: "", pin: "", state: "Tamil Nadu" });
  const [pay, setPay] = useState("upi");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccessNum, setOrderSuccessNum] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!addr.name || !addr.phone || !addr.street || !addr.city || !addr.pin) {
      alert("Please fill in all address details.");
      setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const itemsToPost = cart.map((item) => ({
        productId: item.productId || item.id,
        qty: item.qty,
        variant: item.variant || "",
      }));

      const payload = {
        items: itemsToPost,
        shippingAddress: {
          street: addr.street,
          city: addr.city,
          state: addr.state,
          pin: addr.pin,
        },
        paymentMethod: pay === "upi" ? "UPI" : pay === "netbanking" ? "Net Banking" : pay === "card" ? "Card" : "Cash on Delivery",
        guestInfo: !user ? {
          name: addr.name,
          email: `${addr.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
          phone: addr.phone,
        } : undefined,
      };

      let res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        
        if (refreshRes.ok) {
          res = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          });
        } else {
          alert("Session expired. Please log in again to complete your order.");
          window.location.href = "/login?redirect=/cart";
          return;
        }
      }

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Checkout failed");
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      
      if (pay !== "cod" && data.razorpayOrderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T73VG0BLmrdL7w",
          amount: data.total * 100,
          currency: "INR",
          name: "Ramana Jewells",
          description: "Jewellery Purchase",
          order_id: data.razorpayOrderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch("http://localhost:5000/api/orders/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              if (verifyRes.ok) {
                setOrderSuccessNum(data.orderNumber);
                setCart([]);
              } else {
                alert("Payment verification failed");
              }
            } catch (err) {
              alert("Error verifying payment");
            }
          },
          prefill: {
            name: addr.name,
            email: user?.email || `${addr.name.toLowerCase().replace(/\\s+/g, "")}@example.com`,
            contact: addr.phone,
          },
          theme: {
            color: "#C9A227",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function () {
           alert("Payment failed");
           setSubmitting(false);
        });
        rzp.open();
      } else {
        setOrderSuccessNum(data.orderNumber);
        setCart([]);
        setSubmitting(false);
      }
    } catch (error) {
      alert("Error placing order. Please try again.");
      setSubmitting(false);
    }
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = 0;
  const total     = subtotal + shipping;

  const STEPS = ["Cart", "Address", "Payment"];

  const PAY_METHODS = [
    { id: "upi",        label: "UPI (PhonePe, GPay, Paytm)", desc: "Instant transfer, no extra charges"    },
    { id: "netbanking", label: "Net Banking",                 desc: "All major banks supported"              },
    { id: "card",       label: "Credit / Debit Card",         desc: "Visa, Mastercard, RuPay — 0% EMI"      },
    { id: "cod",        label: "Cash on Delivery",            desc: "Pay when your jewellery arrives"        },
  ];



  if (orderSuccessNum) {
    return (
      <main style={{ background: IVORY, minHeight: "100vh" }} className="flex items-center justify-center py-20 px-6">
        <div className="bg-white max-w-md w-full p-8 rounded shadow-sm text-center border animate-fade-in" style={{ borderColor: "rgba(201,162,39,0.18)" }}>
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={24} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-normal mb-3" style={{ fontFamily: SERIF, color: CHARCOAL }}>Order Placed!</h2>
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: SANS }}>
            Thank you for shopping with Ramana Jewells. Your order has been placed successfully.
          </p>
          <div className="p-4 bg-[#FDF9F3] border rounded mb-8 text-left" style={{ borderColor: "rgba(201,162,39,0.15)" }}>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1" style={{ fontFamily: SANS }}>Order Number</p>
            <p className="text-base font-semibold text-gray-800" style={{ fontFamily: SANS }}>{orderSuccessNum}</p>
            <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: SANS }}>
              A confirmation receipt and shipping updates will be shared shortly.
            </p>
          </div>
          <GoldBtn onClick={() => router.push("/")} full>
            Back to Storefront
          </GoldBtn>
        </div>
      </main>
    );
  }

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
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={addr.state}
                      onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm outline-none"
                      style={{ border: `1px solid rgba(201,162,39,0.3)`, background: "#FDF9F3", color: CHARCOAL, fontFamily: SANS }}
                    />
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
                <GoldBtn onClick={handlePlaceOrder} disabled={submitting} full>
                  {submitting ? "Placing Order..." : "Place Order"}
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
