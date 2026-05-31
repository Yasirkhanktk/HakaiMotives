'use client'

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsapp?: string;
}

export function WhatsAppButton({ whatsapp = "923490090074" }: WhatsAppButtonProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded bubble */}
      {expanded && (
        <div
          className="rounded-xl p-4 mb-1 shadow-2xl animate-fade-in"
          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", width: "260px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "14px" }}>Hassan Nawaz</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: "#25D366" }} />
                <p style={{ fontFamily: "Inter, sans-serif", color: "#25D366", fontSize: "11px" }}>Online Now</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-3 mb-3" style={{ background: "#111", border: "1px solid #222" }}>
            <p style={{ fontFamily: "Inter, sans-serif", color: "#bbb", fontSize: "12px", lineHeight: 1.6 }}>
              Hi! 👋 Welcome to <strong style={{ color: "#e8192c" }}>Hakai Motives</strong>. Chat with us for product queries, custom orders & prices!
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsapp}?text=Hi%20Hakai%20Motives!%20I'm%20interested%20in%20inquiring%20about%20car%20modification%20parts.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg transition-all duration-200"
            style={{ background: "#25D366", color: "#fff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "1.5px", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1eba57")}
            onMouseLeave={e => (e.currentTarget.style.background = "#25D366")}
          >
            <MessageCircle size={15} />
            START CHAT
          </a>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
        style={{ background: "#25D366", transform: expanded ? "scale(0.95)" : "scale(1)", border: "none", cursor: "pointer" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#1eba57")}
        onMouseLeave={e => (e.currentTarget.style.background = "#25D366")}
      >
        {expanded ? (
          <X size={22} color="white" />
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>

      {/* Pulse ring */}
      {!expanded && (
        <div
          className="absolute bottom-0 right-0 w-14 h-14 rounded-full pointer-events-none"
          style={{ border: "2px solid #25D366", animation: "whatsapp-pulse 2s infinite", opacity: 0.5 }}
        />
      )}

      <style>{`
        @keyframes whatsapp-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
