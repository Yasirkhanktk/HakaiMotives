import { ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const categories = [
  {
    id: 1,
    name: "BUMPERS & BODY KITS",
    code: "bumpers",
    image: "https://images.unsplash.com/photo-1714860098789-67680153a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    count: 48,
    accent: "#e8192c",
  },
  {
    id: 2,
    name: "MIRROR COVERS",
    code: "mirrors",
    image: "https://images.unsplash.com/photo-1565001151547-999ff6ccddd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    count: 32,
    accent: "#e8192c",
  },
  {
    id: 3,
    name: "AMBIENT LIGHTING",
    code: "lighting",
    image: "https://images.unsplash.com/photo-1720929633046-f171051f30ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    count: 24,
    accent: "#e8192c",
  },
  {
    id: 4,
    name: "SPOILERS & WINGS",
    code: "spoilers",
    image: "https://images.unsplash.com/photo-1777014586209-05ad0b7c5670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    count: 36,
    accent: "#e8192c",
  },
  {
    id: 5,
    name: "RIMS & WHEELS",
    code: "wheels",
    image: "https://images.unsplash.com/photo-1558556579-a8fef2bf1861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    count: 60,
    accent: "#e8192c",
  },
  {
    id: 6,
    name: "CARBON INTERIOR",
    code: "interior",
    image: "https://images.unsplash.com/photo-1779263724552-a859e99e8678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    count: 18,
    accent: "#e8192c",
  },
];

interface CategoriesProps {
  onCategorySelect: (categoryCode: string) => void;
}

export function Categories({ onCategorySelect }: CategoriesProps) {
  return (
    <section id="categories" className="py-20" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-0.5" style={{ background: "#e8192c" }} />
              <span style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "11px", fontWeight: 600, letterSpacing: "3px" }}>BROWSE BY TYPE</span>
            </div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px" }}>
              CATEGORIES
            </h2>
          </div>
          <button
            onClick={() => onCategorySelect("all")}
            className="hidden sm:flex items-center gap-2 transition-colors duration-200"
            style={{ border: "none", background: "none", fontFamily: "Space Grotesk, sans-serif", color: "#666", fontWeight: 600, fontSize: "12px", letterSpacing: "2px", textDecoration: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")}
            onMouseLeave={e => (e.currentTarget.style.color = "#666")}
          >
            VIEW ALL <ChevronRight size={14} />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onClick={() => onCategorySelect(cat.code)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, onClick }: { category: typeof categories[0]; onClick: () => void }) {
  return (
    <div
      className="group cursor-pointer rounded-lg overflow-hidden relative"
      style={{ background: "#141414", border: "1px solid #1e1e1e" }}
      onMouseEnter={e => { (e.currentTarget.style.borderColor = "#e8192c"); }}
      onMouseLeave={e => { (e.currentTarget.style.borderColor = "#1e1e1e"); }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-36">
        <ImageWithFallback
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
        {/* Count badge */}
        <div
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full"
          style={{ background: "rgba(232,25,44,0.9)", fontFamily: "Inter, sans-serif", color: "#fff", fontSize: "9px", fontWeight: 600 }}
        >
          {category.count}+
        </div>
      </div>

      {/* Name */}
      <div className="px-3 py-3">
        <p style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ddd", fontWeight: 600, fontSize: "11px", letterSpacing: "1px" }}>
          {category.name}
        </p>
        <div
          className="mt-1.5 h-0.5 w-0 group-hover:w-full transition-all duration-300"
          style={{ background: "#e8192c" }}
        />
      </div>
    </div>
  );
}
