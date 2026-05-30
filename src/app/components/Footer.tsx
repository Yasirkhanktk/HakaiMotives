import { Instagram, MessageCircle, Mail, MapPin, Phone, ChevronRight } from "lucide-react";

export function Footer() {
  const categories = ["Bumpers & Body Kits", "Mirror Covers", "Ambient Lighting", "Spoilers & Wings", "Rims & Wheels", "Carbon Interior"];
  const carModels = ["Toyota Corolla", "Honda Civic", "Toyota Yaris", "Honda BRV", "Honda City"];

  return (
    <footer id="footer" style={{ background: "#080808", borderTop: "1px solid #1a1a1a" }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg 
                className="w-9 h-9" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(0 0 8px rgba(232, 25, 44, 0.5))" }}
              >
                <path
                  d="M1.5 76.5L34.5 23.5H55.5L41 46.5L75 23.5H95.5L76.5 54L81.5 76.5H58.5L71.5 56.5L43 76.5H20.5L1.5 76.5Z"
                  fill="#e8192c"
                />
              </svg>
              <div>
                <span style={{ fontFamily: "Space Grotesk, sans-serif", color: "#e8192c", fontWeight: 700, fontSize: "18px", letterSpacing: "3px" }}>HAKAI</span>
                <span style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", fontWeight: 600, fontSize: "18px", letterSpacing: "3px" }}> MOTIVES</span>
              </div>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", color: "#555", fontSize: "13px", lineHeight: 1.8 }} className="mb-5">
              Premium automotive modification parts by Hassan Nawaz. Specializing in body kits, spoilers, rims & interior upgrades for Toyota & Honda vehicles.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded transition-all duration-200"
                style={{ background: "#141414", border: "1px solid #1e1e1e", color: "#666" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e8192c"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#e8192c"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#141414"; e.currentTarget.style.color = "#666"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded transition-all duration-200"
                style={{ background: "#141414", border: "1px solid #1e1e1e", color: "#666" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#25D366"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#25D366"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#141414"; e.currentTarget.style.color = "#666"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="mailto:info@hakaimotives.com"
                className="w-9 h-9 flex items-center justify-center rounded transition-all duration-200"
                style={{ background: "#141414", border: "1px solid #1e1e1e", color: "#666" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e8192c"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#e8192c"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#141414"; e.currentTarget.style.color = "#666"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "13px", letterSpacing: "2.5px", marginBottom: "16px" }}>
              CATEGORIES
            </h4>
            <ul className="flex flex-col gap-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <a
                    href="#categories"
                    className="flex items-center gap-2 transition-colors duration-200"
                    style={{ fontFamily: "Inter, sans-serif", color: "#555", fontSize: "13px", textDecoration: "none" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e8192c"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}
                  >
                    <ChevronRight size={12} />
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compatible Cars */}
          <div>
            <h4 style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "13px", letterSpacing: "2.5px", marginBottom: "16px" }}>
              COMPATIBLE MODELS
            </h4>
            <ul className="flex flex-col gap-2.5">
              {carModels.map((car) => (
                <li key={car}>
                  <a
                    href="#products"
                    className="flex items-center gap-2 transition-colors duration-200"
                    style={{ fontFamily: "Inter, sans-serif", color: "#555", fontSize: "13px", textDecoration: "none" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e8192c"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}
                  >
                    <ChevronRight size={12} />
                    {car}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "13px", letterSpacing: "2.5px", marginBottom: "16px" }}>
              CONTACT US
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Phone size={14} color="#e8192c" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "11px", letterSpacing: "1px", marginBottom: "2px" }}>WHATSAPP</p>
                  <a href="https://wa.me/923001234567" style={{ fontFamily: "Inter, sans-serif", color: "#aaa", fontSize: "13px", textDecoration: "none" }}>+92 300 1234567</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Instagram size={14} color="#e8192c" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "11px", letterSpacing: "1px", marginBottom: "2px" }}>INSTAGRAM</p>
                  <a href="https://www.instagram.com" target="_blank" rel="noreferrer" style={{ fontFamily: "Inter, sans-serif", color: "#aaa", fontSize: "13px", textDecoration: "none" }}>@hakaimotives</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={14} color="#e8192c" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "11px", letterSpacing: "1px", marginBottom: "2px" }}>LOCATION</p>
                  <p style={{ fontFamily: "Inter, sans-serif", color: "#aaa", fontSize: "13px" }}>Pakistan — Nationwide Delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={14} color="#e8192c" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "11px", letterSpacing: "1px", marginBottom: "2px" }}>EMAIL</p>
                  <a href="mailto:info@hakaimotives.com" style={{ fontFamily: "Inter, sans-serif", color: "#aaa", fontSize: "13px", textDecoration: "none" }}>info@hakaimotives.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "#111" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: "Inter, sans-serif", color: "#333", fontSize: "12px" }}>
            © 2026 Hakai Motives by Hassan Nawaz. All rights reserved.
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", color: "#333", fontSize: "12px" }}>
            Designed for car enthusiasts across Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
}
