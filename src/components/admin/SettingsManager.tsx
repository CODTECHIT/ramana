"use client";

import { useState, useEffect } from "react";
import { Constants } from "../../lib/mock-data";
import { Save } from "lucide-react";

const { GOLD, SANS } = Constants;

export default function SettingsManager() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then(res => res.json())
      .then(data => {
        setWhatsappNumber(data.whatsappNumber || "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber }),
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to save settings");
      
      setMessage({ text: "Settings saved successfully", type: "success" });
    } catch (err) {
      setMessage({ text: "Error saving settings", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ fontFamily: SANS }}>Loading settings...</div>;

  return (
    <div style={{ fontFamily: SANS }} className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium" style={{ color: "#1A1A2E" }}>Global Settings</h2>
      </div>

      <div className="bg-white rounded p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {message.text && (
          <div className={`mb-6 p-3 text-sm rounded ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-4 text-base border-b pb-2">Contact Integrations</h3>
            
            <label className="block text-xs uppercase tracking-wider mb-2 text-gray-600">
              WhatsApp Number
            </label>
            <input 
              type="text" 
              value={whatsappNumber} 
              onChange={e => setWhatsappNumber(e.target.value)} 
              placeholder="e.g. 919876543210"
              className="w-full p-2.5 border rounded text-sm outline-none focus:border-[#C9A227] transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter your WhatsApp number including the country code (e.g., 91 for India), without the '+' sign or any spaces. Leave empty to disable WhatsApp buttons on the storefront.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-xs tracking-wider uppercase text-white rounded transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: GOLD }}
            >
              <Save size={14} /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
