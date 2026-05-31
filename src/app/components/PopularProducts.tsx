import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard, Product } from "./ProductCard";

const popularProducts: Product[] = [
  {
    id: "1",
    name: "Front Bumper Lip",
    brand: "HAKAI MOTIVES",
    compatible: "Toyota Corolla 2014-2021",
    price: 12500,
    originalPrice: 16000,
    rating: 4.8,
    reviews: 42,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1714860098789-67680153a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "bumpers",
  },
  {
    id: "2",
    name: "Rear Bumper Diffuser",
    brand: "HAKAI MOTIVES",
    compatible: "Honda Civic 2016-2021",
    price: 14000,
    originalPrice: 18500,
    rating: 4.6,
    reviews: 28,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1565001151547-999ff6ccddd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "bumpers",
  },
  {
    id: "3",
    name: "Carbon Side Mirror Covers",
    brand: "HAKAI MOTIVES",
    compatible: "Toyota Corolla / Honda Civic",
    price: 3500,
    originalPrice: 5000,
    rating: 4.7,
    reviews: 64,
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1558556579-a8fef2bf1861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "mirrors",
  },
  {
    id: "4",
    name: "RGB Ambient Lighting Kit",
    brand: "HAKAI MOTIVES",
    compatible: "Universal Fit",
    price: 2800,
    originalPrice: 4000,
    rating: 4.9,
    reviews: 112,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1720929633046-f171051f30ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "lighting",
  },
  {
    id: "5",
    name: "Trunk Lip Spoiler",
    brand: "HAKAI MOTIVES",
    compatible: "Toyota Corolla 2017+",
    price: 8500,
    originalPrice: 11000,
    rating: 4.5,
    reviews: 37,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1777014586209-05ad0b7c5670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "spoilers",
  },
  {
    id: "6",
    name: "Sport Racing Rims (Set of 4)",
    brand: "HAKAI MOTIVES",
    compatible: "Toyota Corolla / Honda Civic",
    price: 45000,
    originalPrice: 58000,
    rating: 4.8,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1668639235092-301730d1b72e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "wheels",
  },
  {
    id: "7",
    name: "Carbon Fiber Steering Wheel",
    brand: "HAKAI MOTIVES",
    compatible: "Universal Fit (with adapter)",
    price: 18000,
    originalPrice: 24000,
    rating: 4.7,
    reviews: 31,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1779263724552-a859e99e8678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "interior",
  },
  {
    id: "8",
    name: "Full Body Kit",
    brand: "HAKAI MOTIVES",
    compatible: "Honda Civic 2022+",
    price: 35000,
    originalPrice: 45000,
    rating: 4.9,
    reviews: 14,
    badge: "LIMITED",
    image: "https://images.unsplash.com/photo-1771979623985-760ea16186d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500",
    category: "body",
  },
];

interface PopularProductsProps {
  onAddToCart: (product: Product) => void;
}

export function PopularProducts({ onAddToCart }: PopularProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section id="products" className="py-20" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-0.5" style={{ background: "#e8192c" }} />
              <span style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "11px", fontWeight: 600, letterSpacing: "3px" }}>CUSTOMER FAVORITES</span>
            </div>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "1px" }}>
              MOST POPULAR PRODUCTS
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 flex items-center justify-center rounded transition-all duration-200"
              style={{ border: "1px solid #2a2a2a", color: "#666" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8192c"; e.currentTarget.style.color = "#e8192c"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#666"; }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 flex items-center justify-center rounded transition-all duration-200"
              style={{ border: "1px solid #2a2a2a", color: "#666" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8192c"; e.currentTarget.style.color = "#e8192c"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#666"; }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {popularProducts.map((product) => (
            <div key={product.id} style={{ minWidth: "220px", maxWidth: "220px" }}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { popularProducts };
