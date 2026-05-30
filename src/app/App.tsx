import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Categories } from "./components/Categories";
import { TopProducts } from "./components/TopProducts";
import { ProjectGallery } from "./components/ProjectGallery";
import { Testimonials } from "./components/Testimonials";
import { ProductsPage } from "./components/ProductsPage";
import { ProductModal } from "./components/ProductModal";
import { Cart, CartItem } from "./components/Cart";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Footer } from "./components/Footer";
import { products, Product } from "./data/products";

export default function App() {
  const [currentPage, setCurrentPage] = useState<{ name: string; category?: string; query?: string }>({ name: "home" });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Scroll to top when switching pages/categories
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  // Open modal handler when a product card's CTA is clicked
  const handleOpenProductModal = (product: { id: number; name: string; price: number; image: string }) => {
    const fullProduct = products.find(p => p.id === product.id);
    if (fullProduct) {
      setSelectedProduct(fullProduct);
    }
  };

  // Add to cart from the details modal (with selected quantity and color)
  const handleModalAddToCart = (prod: Product, qty: number, color: string) => {
    const colorIndex = ["Glossy Black", "Carbon Fiber", "Matte Silver", "Redline Edition"].indexOf(color);
    const compoundId = prod.id * 10 + (colorIndex >= 0 ? colorIndex : 0);

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === compoundId);
      if (existing) {
        return prev.map((item) =>
          item.id === compoundId ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: compoundId,
          name: `${prod.name} (${color})`,
          price: prod.price,
          image: prod.image,
          quantity: qty,
        },
      ];
    });
    setSelectedProduct(null); // Close modal
    setCartOpen(true); // Open cart panel
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", backgroundColor: "#0a0a0a", color: "#ffffff", minHeight: "100vh" }}>
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setCartOpen(true)} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {currentPage.name === "home" ? (
        <div key="home" className="animate-page">
          <Hero />
          <Categories onCategorySelect={(code) => setCurrentPage({ name: "products", category: code })} />
          <TopProducts onAddToCart={handleOpenProductModal} />
          <ProjectGallery />
          <Testimonials />
        </div>
      ) : (
        <div key="products" className="animate-page">
          <ProductsPage
            initialCategory={currentPage.category || "all"}
            initialQuery={currentPage.query || ""}
            onAddToCart={handleOpenProductModal}
            onBackToHome={() => setCurrentPage({ name: "home" })}
          />
        </div>
      )}

      <Footer />
      
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleModalAddToCart}
        />
      )}
      
      <WhatsAppButton />
    </div>
  );
}
