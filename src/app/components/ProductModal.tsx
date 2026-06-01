'use client'

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart, MessageCircle, Minus, Plus, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./ProductCard";
import { useCart } from "@/app/context/CartContext";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  whatsapp?: string;
}

const COLORS = [
  { name: "Glossy Black", value: "#000000", border: "#111" },
  { name: "Carbon Fiber", value: "#262626", border: "#444" },
  { name: "Matte Silver", value: "#8e9091", border: "#aaa" },
  { name: "Redline Edition", value: "#e8192c", border: "#900" }
];

export function ProductModal({ product, onClose, whatsapp = "923490090074" }: ProductModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const brandName = typeof product.brand === "object" && product.brand !== null
    ? product.brand.name
    : (product.brand || "HAKAI MOTIVES");

  const imageUrl = typeof product.image === "object" && product.image !== null
    ? product.image.url
    : (product.image || "");

  // Default inventory fallback to 10 if not defined
  const inventoryCount = typeof (product as any).inventory !== "undefined"
    ? (product as any).inventory
    : 10;
  
  const isOutOfStock = inventoryCount <= 0;

  const handleIncrement = () => setQuantity(q => (q < inventoryCount ? q + 1 : q));
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCartClick = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedColor);
    onClose();
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hi Hakai Motives! I want to inquire about "${product.name}" in "${selectedColor}" color option.\n\nQuantity: ${quantity}\nCompatible: ${product.compatible}\nPrice: PKR ${(product.price * quantity).toLocaleString()}`
    );
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 100 }}
      onClick={onClose}
    >
      {/* Modal Box */}
      <div
        className="w-full max-w-3xl rounded-lg overflow-hidden flex flex-col md:flex-row relative animate-fade-in"
        style={{
          background: "#0d0d0d",
          border: "1px solid #1e1e1e",
          boxShadow: "0 10px 50px rgba(0,0,0,0.6)",
          maxHeight: "92vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{
            background: "rgba(0,0,0,0.6)",
            border: "1px solid #2a2a2a",
            color: "#ffffff",
            cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#e8192c")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
        >
          <X size={16} />
        </button>

        {/* Left Column: Product Image */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden aspect-[4/3] md:aspect-auto">
          <ImageWithFallback
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ minHeight: "240px" }}
          />
          {product.badge && (
            <span
              className="absolute top-4 left-4 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
              style={{
                background: "#e8192c",
                color: "#ffffff",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {product.badge}
            </span>
          )}
          {isOutOfStock && (
            <span
              className="absolute top-4 right-4 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
              style={{
                background: "#555555",
                color: "#ffffff",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Right Column: Specifications and Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between" style={{ maxHeight: "calc(92vh - 40px)" }}>
          <div>
            {/* Brand */}
            <span
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                color: "#e8192c",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
              }}
            >
              {brandName}
            </span>

            {/* Product Name */}
            <h2
              className="mt-1 mb-2"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "24px",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h2>

            {/* Compatibility */}
            <p
              className="mb-4"
              style={{
                fontFamily: "Outfit, sans-serif",
                color: "#888888",
                fontSize: "12px",
              }}
            >
              Compatible with: <strong className="text-neutral-300">{product.compatible}</strong>
            </p>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    fill={s <= Math.floor(product.rating || 5) ? "#e8192c" : "none"}
                    color={s <= Math.floor(product.rating || 5) ? "#e8192c" : "#444"}
                  />
                ))}
              </div>
              <span style={{ fontFamily: "Outfit, sans-serif", color: "#888", fontSize: "11px" }}>
                {product.rating || 5} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price Preview */}
            <div className="mb-6">
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Price
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "22px",
                  }}
                >
                  PKR {(product.price * quantity).toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      color: "#777",
                      fontSize: "13px",
                      textDecoration: "line-through",
                    }}
                  >
                    PKR {(product.originalPrice * quantity).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Color Swatch Options */}
            <div className="mb-6">
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Color Option: <span className="text-white font-medium normal-case">{selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    title={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className="w-8 h-8 rounded-full transition-all duration-300 relative"
                    style={{
                      background: color.value,
                      border: `2px solid ${selectedColor === color.name ? "#e8192c" : color.border}`,
                      boxShadow: selectedColor === color.name ? "0 0 10px rgba(232, 25, 44, 0.4)" : "none",
                      cursor: "pointer",
                    }}
                  >
                    {selectedColor === color.name && (
                      <span
                        className="absolute inset-0.5 rounded-full border border-white opacity-40"
                        style={{ pointerEvents: "none" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2.5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Quantity {inventoryCount < 10 && !isOutOfStock && <span className="text-red-500 font-medium normal-case">(Only {inventoryCount} left!)</span>}
              </div>
              <div
                className="inline-flex items-center rounded"
                style={{ border: "1px solid #222", background: "#111" }}
              >
                <button
                  disabled={isOutOfStock}
                  onClick={handleDecrement}
                  className="px-3 py-2 text-neutral-400 hover:text-white transition-colors disabled:opacity-30"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <Minus size={14} />
                </button>
                <span
                  className="px-4 text-sm font-bold text-white min-w-[32px] text-center"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  disabled={isOutOfStock}
                  onClick={handleIncrement}
                  className="px-3 py-2 text-neutral-400 hover:text-white transition-colors disabled:opacity-30"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCartClick}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded font-bold tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isOutOfStock ? "#333333" : "#e8192c",
                color: isOutOfStock ? "#666666" : "#ffffff",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "13px",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                border: "none",
              }}
              onMouseEnter={e => { if (!isOutOfStock) e.currentTarget.style.background = "#c0000f"; }}
              onMouseLeave={e => { if (!isOutOfStock) e.currentTarget.style.background = "#e8192c"; }}
            >
              <ShoppingCart size={15} /> {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full flex items-center justify-center gap-2 py-3 rounded font-bold tracking-wide transition-colors"
              style={{
                background: "#161616",
                color: "#25D366",
                border: "1px solid #262626",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#25D366";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#25D366";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#161616";
                e.currentTarget.style.color = "#25D366";
                e.currentTarget.style.borderColor = "#262626";
              }}
            >
              <MessageCircle size={15} /> DISCUSS ON WHATSAPP
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
