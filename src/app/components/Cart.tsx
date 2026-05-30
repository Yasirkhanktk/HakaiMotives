import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

type CheckoutStep = "cart" | "address" | "payment" | "confirmed";

interface AddressForm {
  name: string;
  phone: string;
  address: string;
  city: string;
}

export function Cart({ isOpen, onClose, items, onRemove, onUpdateQuantity }: CartProps) {
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [address, setAddress] = useState<AddressForm>({ name: "", phone: "", address: "", city: "" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    setStep("confirmed");
  };

  const handleClose = () => {
    if (step === "confirmed") setStep("cart");
    onClose();
  };

  const cartStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) ${isOpen ? "scale(1)" : "scale(0.95)"}`,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        width: "calc(100vw - 32px)",
        height: "80vh",
        maxHeight: "620px",
        background: "#0f0f0f",
        border: "1px solid #1e1e1e",
        borderRadius: "16px",
        boxShadow: "0 15px 50px rgba(0,0,0,0.6)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 50,
      }
    : {
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "420px",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        background: "#0f0f0f",
        borderLeft: "1px solid #1e1e1e",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 50,
      };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.7)", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={handleClose}
      />

      {/* Cart Container (Sidebar on desktop, Modal on mobile) */}
      <div className="flex flex-col overflow-hidden" style={cartStyle}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #1e1e1e" }}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} color="#e8192c" />
            <span style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "16px", letterSpacing: "2px" }}>
              {step === "cart" ? "YOUR CART" : step === "address" ? "DELIVERY INFO" : step === "payment" ? "PAYMENT" : "ORDER PLACED!"}
            </span>
            {itemCount > 0 && step === "cart" && (
              <span className="px-2 py-0.5 rounded-full" style={{ background: "#e8192c", color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700 }}>
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={handleClose} className="p-1.5 rounded transition-colors" style={{ color: "#666" }} onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        {step !== "confirmed" && (
          <div className="flex px-5 py-3 gap-2" style={{ borderBottom: "1px solid #1a1a1a" }}>
            {(["cart", "address", "payment"] as CheckoutStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background: step === s ? "#e8192c" : (["cart", "address", "payment"].indexOf(step) > i ? "#e8192c" : "#1e1e1e"),
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 700,
                    fontFamily: "Inter, sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", color: step === s ? "#fff" : "#555", fontSize: "10px", letterSpacing: "1px" }}>
                  {s === "cart" ? "CART" : s === "address" ? "ADDRESS" : "PAYMENT"}
                </span>
                {i < 2 && <div className="flex-1 h-px" style={{ background: "#1e1e1e" }} />}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === "cart" && (
            <div className="p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <ShoppingBag size={48} color="#222" />
                  <p style={{ fontFamily: "Rajdhani, sans-serif", color: "#444", fontWeight: 600, fontSize: "16px", letterSpacing: "1px" }}>YOUR CART IS EMPTY</p>
                  <button onClick={handleClose} className="px-5 py-2 rounded" style={{ background: "#e8192c", color: "#fff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "12px", letterSpacing: "2px" }}>
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-lg" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: "Rajdhani, sans-serif", color: "#ddd", fontWeight: 600, fontSize: "13px", lineHeight: 1.4 }} className="mb-1">
                          {item.name}
                        </p>
                        <p style={{ fontFamily: "Rajdhani, sans-serif", color: "#e8192c", fontWeight: 700, fontSize: "14px" }}>
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 rounded" style={{ border: "1px solid #2a2a2a" }}>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1" style={{ color: "#666" }} onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                              <Minus size={12} />
                            </button>
                            <span style={{ fontFamily: "Inter, sans-serif", color: "#fff", fontSize: "12px", fontWeight: 600, minWidth: "16px", textAlign: "center" }}>
                              {item.quantity}
                            </span>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1" style={{ color: "#666" }} onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => onRemove(item.id)} className="p-1" style={{ color: "#444" }} onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")} onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "address" && (
            <div className="p-5 flex flex-col gap-4">
              {[
                { key: "name", label: "Full Name", placeholder: "Your full name" },
                { key: "phone", label: "Phone / WhatsApp", placeholder: "03XX XXXXXXX" },
                { key: "address", label: "Delivery Address", placeholder: "Street, Area, City" },
                { key: "city", label: "City", placeholder: "Karachi, Lahore, Islamabad..." },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "11px", letterSpacing: "1.5px", display: "block", marginBottom: "6px" }}>
                    {field.label}
                  </label>
                  <input
                    value={address[field.key as keyof AddressForm]}
                    onChange={e => setAddress({ ...address, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded outline-none"
                    style={{ background: "#141414", border: "1px solid #2a2a2a", color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "13px" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#e8192c")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                  />
                </div>
              ))}
            </div>
          )}

          {step === "payment" && (
            <div className="p-5 flex flex-col gap-4">
              <p style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "13px" }}>Select your payment method:</p>
              {[
                { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order" },
                { id: "easypaisa", label: "Easypaisa / JazzCash", desc: "Send to: 0300-1234567 (Hassan Nawaz)" },
                { id: "bank", label: "Bank Transfer", desc: "Account details shared via WhatsApp" },
              ].map((method) => (
                <div
                  key={method.id}
                  className="p-4 rounded-lg cursor-pointer transition-all duration-200"
                  style={{ background: "#141414", border: "1px solid #2a2a2a" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#e8192c")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  <p style={{ fontFamily: "Rajdhani, sans-serif", color: "#ddd", fontWeight: 600, fontSize: "14px" }}>{method.label}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", color: "#666", fontSize: "12px" }}>{method.desc}</p>
                </div>
              ))}

              {/* Order summary */}
              <div className="mt-4 p-4 rounded-lg" style={{ background: "#141414", border: "1px solid #1e1e1e" }}>
                <p style={{ fontFamily: "Rajdhani, sans-serif", color: "#aaa", fontWeight: 600, fontSize: "12px", letterSpacing: "2px", marginBottom: "12px" }}>ORDER SUMMARY</p>
                {items.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span style={{ fontFamily: "Inter, sans-serif", color: "#777", fontSize: "12px" }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", color: "#aaa", fontSize: "12px" }}>PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3 flex justify-between" style={{ borderColor: "#1e1e1e" }}>
                  <span style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700 }}>TOTAL</span>
                  <span style={{ fontFamily: "Rajdhani, sans-serif", color: "#e8192c", fontWeight: 700, fontSize: "18px" }}>PKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {step === "confirmed" && (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(232,25,44,0.1)", border: "2px solid #e8192c" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8192c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "24px", letterSpacing: "2px" }}>ORDER PLACED!</h3>
              <p style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "14px", lineHeight: 1.7 }}>
                Thank you! Hassan will confirm your order via WhatsApp shortly at the number you provided.
              </p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded"
                style={{ background: "#25D366", color: "#fff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "13px", letterSpacing: "2px", textDecoration: "none" }}
              >
                TRACK ON WHATSAPP
              </a>
              <button onClick={handleClose} style={{ fontFamily: "Inter, sans-serif", color: "#555", fontSize: "13px", background: "none", border: "none", cursor: "pointer" }}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== "confirmed" && items.length > 0 && (
          <div className="p-5" style={{ borderTop: "1px solid #1e1e1e" }}>
            {step === "cart" && (
              <div className="flex justify-between mb-4">
                <span style={{ fontFamily: "Inter, sans-serif", color: "#888", fontSize: "14px" }}>Subtotal</span>
                <span style={{ fontFamily: "Rajdhani, sans-serif", color: "#fff", fontWeight: 700, fontSize: "18px" }}>PKR {total.toLocaleString()}</span>
              </div>
            )}
            <button
              onClick={() => {
                if (step === "cart") setStep("address");
                else if (step === "address") setStep("payment");
                else if (step === "payment") handlePlaceOrder();
              }}
              className="w-full py-3.5 rounded flex items-center justify-center gap-2 transition-all duration-200"
              style={{ background: "#e8192c", color: "#fff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "14px", letterSpacing: "2px" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#c0000f")}
              onMouseLeave={e => (e.currentTarget.style.background = "#e8192c")}
            >
              {step === "cart" ? "PROCEED TO CHECKOUT" : step === "address" ? "CONTINUE TO PAYMENT" : "PLACE ORDER"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
