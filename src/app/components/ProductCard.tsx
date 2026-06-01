'use client'

import { ShoppingCart, Star, Heart } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: string;
  name: string;
  brand: { name: string } | string;
  compatible: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: { url: string } | string;
  category: { code: string } | string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const brandName = typeof product.brand === "object" && product.brand !== null
    ? product.brand.name
    : (product.brand || "HAKAI MOTIVES");

  const imageUrl = typeof product.image === "object" && product.image !== null
    ? product.image.url
    : (product.image || "");

  return (
    <div
      className="group rounded-lg overflow-hidden flex flex-col transition-all duration-300 cursor-pointer"
      style={{ background: "#111", border: "1px solid #1e1e1e" }}
      onClick={() => onAddToCart(product)}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#333")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      {/* Image wrapper */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <ImageWithFallback
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded transition-all duration-200"
            style={{ background: "#e8192c", color: "#fff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "2px", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c0000f")}
            onMouseLeave={e => (e.currentTarget.style.background = "#e8192c")}
          >
            <ShoppingCart size={14} /> QUICK ADD
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span className="px-2 py-0.5 rounded text-white" style={{ background: "#e8192c", fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "1px" }}>
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded text-white" style={{ background: "#222", fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWished(!wished);
          }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
          style={{ background: wished ? "#e8192c" : "rgba(0,0,0,0.5)", border: "none", cursor: "pointer" }}
        >
          <Heart size={12} color="#fff" fill={wished ? "#fff" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="mb-1" style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "9px", fontWeight: 600, letterSpacing: "2px" }}>
          {brandName}
        </div>
        <p className="mb-1 flex-1" style={{ fontFamily: "Rajdhani, sans-serif", color: "#ddd", fontWeight: 600, fontSize: "13px", lineHeight: 1.4 }}>
          {product.name}
        </p>
        <p className="mb-2" style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "10px" }}>
          {product.compatible}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                fill={s <= Math.floor(product.rating || 5) ? "#e8192c" : "none"}
                color={s <= Math.floor(product.rating || 5) ? "#e8192c" : "#444"}
              />
            ))}
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "10px" }}>({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "16px" }}>
              PKR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2" style={{ fontFamily: "Inter, sans-serif", color: "#777", fontSize: "11px", textDecoration: "line-through" }}>
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-8 h-8 flex items-center justify-center rounded transition-all duration-200"
            style={{ background: "#e8192c", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c0000f")}
            onMouseLeave={e => (e.currentTarget.style.background = "#e8192c")}
          >
            <ShoppingCart size={14} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
