'use client'

import { useState } from "react";
import { ShoppingCart, Search, Menu, X, Instagram } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  whatsapp?: string;
  instagram?: string;
}

export function Navbar({ whatsapp = "923490090074", instagram = "https://www.instagram.com" }: NavbarProps) {
  const { cartCount, setCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "PRODUCTS", targetId: "products", href: "/products" },
    { label: "GALLERY", targetId: "gallery", href: "/#gallery" },
    { label: "TESTIMONIALS", targetId: "testimonials", href: "/#testimonials" },
    { label: "CONTACT", targetId: "footer", href: "/#footer" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    setMobileOpen(false);
    if (link.targetId === "products") {
      // Products page navigation
      return;
    }

    // Scroll handlers
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(link.targetId);
      if (element) {
        const offset = element.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(232,25,44,0.2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="flex items-center gap-1 transition-colors duration-200"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#aaa", fontSize: "13px", fontWeight: 600, letterSpacing: "1.5px", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")}
                onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded px-3 py-1.5" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                <Search size={14} color="#888" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent outline-none text-white text-xs bg-none"
                  style={{ width: "160px" }}
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                  <X size={14} color="#888" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded transition-colors"
                style={{ color: "#888", border: "none", background: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")}
                onMouseLeave={e => (e.currentTarget.style.color = "#888")}
              >
                <Search size={18} />
              </button>
            )}

            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded transition-colors hidden sm:flex"
              style={{ color: "#888" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}
            >
              <Instagram size={18} />
            </a>

            <button
              onClick={() => setCartOpen(true)}
              className="p-2 rounded relative transition-colors"
              style={{ color: "#888", border: "none", background: "none", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e8192c")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-white"
                  style={{ background: "#e8192c", fontSize: "10px", fontWeight: 700 }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2"
              style={{ color: "#888", border: "none", background: "none", cursor: "pointer" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: "#1a1a1a" }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="block py-3 px-2 transition-colors"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#aaa", fontSize: "14px", fontWeight: 600, letterSpacing: "1.5px", textDecoration: "none" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
