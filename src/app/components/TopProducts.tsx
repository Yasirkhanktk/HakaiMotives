'use client'

import { ChevronRight, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductCard, Product } from "./ProductCard";

const STATIC_FEATURED = {
  id: "8",
  name: "FULL BODY KIT",
  brand: "HAKAI MOTIVES",
  compatible: "Honda Civic 2022+",
  description: "Complete aerodynamic transformation — front lip, side skirts, rear diffuser & trunk spoiler. Precision-molded ABS plastic for perfect fitment.",
  price: 35000,
  originalPrice: 45000,
  rating: 4.9,
  reviews: 14,
  image: "https://images.unsplash.com/photo-1771979623985-760ea16186d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  features: ["ABS Plastic", "Primer Ready", "Direct Bolt-On", "OEM Fitment"],
  category: "bumpers",
};

const STATIC_TOP: Product[] = [
  {
    id: "9",
    name: "Front Bumper Grille Insert",
    brand: "HAKAI MOTIVES",
    compatible: "Toyota Corolla 2019+",
    price: 4500,
    originalPrice: 6000,
    rating: 4.6,
    reviews: 22,
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1611840973188-1329e9f2b8dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "bumpers",
  },
  {
    id: "10",
    name: "Chrome Delete Side Mirrors",
    brand: "HAKAI MOTIVES",
    compatible: "Honda Civic 2016-2021",
    price: 2500,
    originalPrice: 3500,
    rating: 4.8,
    reviews: 55,
    image: "https://images.unsplash.com/photo-1713096528010-e586cc4616fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "mirrors",
  },
  {
    id: "11",
    name: "Carbon Fiber Steering (Flat Bottom)",
    brand: "HAKAI MOTIVES",
    compatible: "Universal (with Adapter)",
    price: 22000,
    originalPrice: 28000,
    rating: 4.9,
    reviews: 18,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1779263449982-0e772238bc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "interior",
  },
  {
    id: "12",
    name: "Rear GT Spoiler Wing",
    brand: "HAKAI MOTIVES",
    compatible: "Toyota Corolla / Honda Civic",
    price: 11500,
    originalPrice: 15000,
    rating: 4.7,
    reviews: 29,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1762048935171-d6a2563fbb77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "spoilers",
  },
];

interface TopProductsProps {
  onAddToCart: (product: Product) => void;
  featuredProduct?: Product;
  topProducts?: Product[];
  whatsapp?: string;
}

export function TopProducts({ onAddToCart, featuredProduct, topProducts, whatsapp = "923001234567" }: TopProductsProps) {
  const activeFeatured = featuredProduct || (STATIC_FEATURED as any);
  const activeTopList = topProducts && topProducts.length > 0 ? topProducts : STATIC_TOP;

  const featuredImg = typeof activeFeatured.image === "object" && activeFeatured.image !== null
    ? activeFeatured.image.url
    : (activeFeatured.image || "");

  const featuredFeatures = activeFeatured.features || ["ABS Plastic", "Primer Ready", "Direct Bolt-On", "OEM Fitment"];

  return (
    <section id="top-products" className="py-20" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-0.5" style={{ background: "#e8192c" }} />
            <span style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "11px", fontWeight: 600, letterSpacing: "3px" }}>EDITOR'S PICK</span>
          </div>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "1px" }}>
            TOP PRODUCTS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Featured big card */}
          <div
            className="relative rounded-xl overflow-hidden group cursor-pointer"
            style={{ background: "#111", border: "1px solid #1e1e1e", minHeight: "400px" }}
            onClick={() => onAddToCart(activeFeatured)}
          >
            <ImageWithFallback
              src={featuredImg}
              alt={activeFeatured.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={12} color="#e8192c" />
                <span style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "10px", fontWeight: 600, letterSpacing: "2px" }}>FEATURED</span>
              </div>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "28px", letterSpacing: "2px" }}>
                {activeFeatured.name}
              </h3>
              <p style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "12px" }} className="mb-3">
                {activeFeatured.compatible}
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", color: "#aaa", fontSize: "13px", lineHeight: 1.6 }} className="mb-4">
                {activeFeatured.description || "Aggressive aerodynamics and customized visual configurations."}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {featuredFeatures.map((f: string) => (
                  <span
                    key={f}
                    className="px-2.5 py-1 rounded-full"
                    style={{ border: "1px solid rgba(232,25,44,0.4)", color: "#e8192c", fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600 }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "22px" }}>
                    PKR {activeFeatured.price.toLocaleString()}
                  </span>
                  {activeFeatured.originalPrice && activeFeatured.originalPrice > activeFeatured.price && (
                    <span className="ml-2" style={{ fontFamily: "Inter, sans-serif", color: "#555", fontSize: "13px", textDecoration: "line-through" }}>
                      {activeFeatured.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onAddToCart(activeFeatured)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded transition-all duration-200"
                  style={{ background: "#e8192c", color: "#fff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "2px", border: "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#c0000f")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#e8192c")}
                >
                  ADD TO CART <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 4 product cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTopList.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>

        {/* WhatsApp CTA Banner */}
        <div
          className="rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, #1a0000 0%, #111 50%, #0d0d0d 100%)", border: "1px solid rgba(232,25,44,0.2)" }}
        >
          <div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "24px", letterSpacing: "1px" }}>
              CUSTOM ORDER? LET'S TALK.
            </h3>
            <p style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "14px" }}>
              Contact us on WhatsApp for custom orders, bulk pricing & fitment queries.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-lg whitespace-nowrap transition-all duration-200"
            style={{ background: "#25D366", color: "#fff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "14px", letterSpacing: "2px", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#1eba57")}
            onMouseLeave={e => (e.currentTarget.style.background = "#25D366")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WHATSAPP US
          </a>
        </div>
      </div>
    </section>
  );
}
