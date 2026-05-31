'use client'

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight, CornerDownLeft, RotateCcw } from "lucide-react";
import { ProductCard, Product } from "@/app/components/ProductCard";
import { ProductModal } from "@/app/components/ProductModal";
import { useRouter } from "next/navigation";

interface ProductsClientProps {
  initialCategory?: string;
  initialQuery?: string;
  products: any[];
  categories: any[];
  whatsapp?: string;
}

export function ProductsClient({
  initialCategory = "all",
  initialQuery = "",
  products: databaseProducts,
  categories: databaseCategories,
  whatsapp = "923001234567"
}: ProductsClientProps) {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [compatibility, setCompatibility] = useState("ALL");
  const [sortOption, setSortOption] = useState("popularity");
  const [priceRange, setPriceRange] = useState<number>(60000);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(window.location.search);
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    const queryStr = params.toString();
    router.push(queryStr ? `/products?${queryStr}` : `/products`, { scroll: false });
  };

  // Sync state if initial values change externally
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Scroll to top when category changes inside the filter bar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [selectedCategory]);

  // Map dynamic categories
  const categoryMap = useMemo(() => {
    const defaultMap = [
      { id: "all", label: "ALL PRODUCTS", desc: "Browse our complete catalog of premium visual upgrades." }
    ];
    const dbMap = databaseCategories.map(c => ({
      id: c.code,
      label: c.name,
      desc: c.desc || "Browse our premium upgrades."
    }));
    return [...defaultMap, ...dbMap];
  }, [databaseCategories]);

  // Find active category description
  const activeCategoryInfo = useMemo(() => {
    return categoryMap.find(c => c.id === selectedCategory) || categoryMap[0];
  }, [selectedCategory, categoryMap]);

  // Map database products to the frontend Product structure
  const mappedProducts = useMemo(() => {
    return databaseProducts.map(p => {
      const brandName = typeof p.brand === "object" && p.brand !== null ? p.brand.name : (p.brand || "HAKAI MOTIVES");
      const imageUrl = typeof p.image === "object" && p.image !== null ? p.image.url : (p.image || "");
      const categoryCode = typeof p.category === "object" && p.category !== null ? p.category.code : (p.category || "");

      return {
        id: p.id || p._id,
        name: p.name,
        brand: brandName,
        compatible: p.compatible,
        price: p.price,
        originalPrice: p.originalPrice || p.price,
        rating: p.rating || 5,
        reviews: p.reviews || 0,
        badge: p.badge,
        image: imageUrl,
        category: categoryCode,
        inventory: typeof p.inventory !== "undefined" ? p.inventory : 10
      };
    });
  }, [databaseProducts]);

  // Compute filtered & sorted products
  const processedProducts = useMemo(() => {
    let result = [...mappedProducts];

    // 1. Category Filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 2. Compatibility Filter
    if (compatibility !== "ALL") {
      const query = compatibility.toLowerCase();
      result = result.filter(p => p.compatible.toLowerCase().includes(query) || p.compatible.toLowerCase().includes("universal"));
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.compatible.toLowerCase().includes(q)
      );
    }

    // 4. Price Filter
    result = result.filter(p => p.price <= priceRange);

    // 5. Sorting
    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [mappedProducts, selectedCategory, compatibility, searchQuery, priceRange, sortOption]);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setCompatibility("ALL");
    setPriceRange(60000);
    setSortOption("popularity");
    router.push("/products", { scroll: false });
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", paddingTop: "80px" }}>
      {/* Page Header Banner */}
      <div 
        className="relative overflow-hidden py-16 mb-10 px-6 text-center border-b"
        style={{
          background: "linear-gradient(135deg, #120002 0%, #0a0a0a 50%, #0d0d0d 100%)",
          borderColor: "rgba(232, 25, 44, 0.15)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(232, 25, 44, 0.05) 0%, transparent 60%)" }} />
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={handleBackToHome}>Home</span>
          <ChevronRight size={10} />
          <span className="text-red-500">Products</span>
        </div>

        <h1 
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "clamp(30px, 4.5vw, 54px)",
            letterSpacing: "-1.5px",
            marginBottom: "12px",
          }}
        >
          {activeCategoryInfo.label}
        </h1>
        <p 
          className="max-w-2xl mx-auto"
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "#888888",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            lineHeight: 1.6
          }}
        >
          {activeCategoryInfo.desc}
        </p>

        {/* Back Button floating */}
        <button
          onClick={handleBackToHome}
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold tracking-wider text-neutral-400 hover:text-white transition-colors"
          style={{ border: "none", background: "none", cursor: "pointer" }}
        >
          <CornerDownLeft size={14} /> BACK TO HOME
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 p-6 rounded-lg" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
                <h3 className="text-sm font-bold tracking-wider text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  FILTERS
                </h3>
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors"
                  style={{ border: "none", background: "none", cursor: "pointer" }}
                >
                  <RotateCcw size={10} /> RESET ALL
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Search Keywords</label>
                <div className="relative flex items-center rounded" style={{ background: "#151515", border: "1px solid #222" }}>
                  <Search size={14} className="absolute left-3 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search model, parts..."
                    className="w-full pl-9 pr-4 py-2 rounded text-xs text-white bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block mb-2.5 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Categories</label>
                <div className="flex flex-col gap-1.5">
                  {categoryMap.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.id)}
                      className="w-full text-left py-1 px-2.5 rounded text-xs transition-colors flex items-center justify-between"
                      style={{
                        background: selectedCategory === c.id ? "rgba(232, 25, 44, 0.08)" : "transparent",
                        color: selectedCategory === c.id ? "#e8192c" : "#888888",
                        border: selectedCategory === c.id ? "1px solid rgba(232,25,44,0.2)" : "1px solid transparent",
                        cursor: "pointer",
                        fontWeight: selectedCategory === c.id ? 700 : 500,
                      }}
                    >
                      <span>{c.id === "all" ? "All Upgrades" : c.label.replace(" & BODY KITS", "").replace(" COVERS", "").replace(" & WINGS", "").replace(" & WHEELS", "")}</span>
                      <span className="text-[10px] opacity-60">
                        {c.id === "all" 
                          ? mappedProducts.length 
                          : mappedProducts.filter(p => p.category === c.id).length
                        }
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compatible Vehicle */}
              <div className="mb-6">
                <label className="block mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Vehicle Compatibility</label>
                <div className="flex flex-col gap-2 text-xs" style={{ color: "#888" }}>
                  {["ALL", "Civic", "Corolla", "Yaris", "BRV"].map((model) => (
                    <label key={model} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="radio"
                        name="compatibility"
                        checked={compatibility === model}
                        onChange={() => setCompatibility(model)}
                        className="accent-red-500"
                      />
                      <span>{model === "ALL" ? "All Cars" : (model === "Civic" ? "Honda Civic" : model === "Corolla" ? "Toyota Corolla" : model === "Yaris" ? "Toyota Yaris" : `Honda ${model}`)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Max Budget</label>
                  <span className="text-xs font-bold text-white">PKR {priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="60000"
                  step="500"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Sort order</label>
                <div className="relative flex items-center rounded" style={{ background: "#151515", border: "1px solid #222" }}>
                  <ArrowUpDown size={12} className="absolute left-3 text-neutral-500" />
                  <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded text-xs text-white bg-transparent outline-none cursor-pointer"
                  >
                    <option value="popularity">Most Reviews</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

            </div>
          </aside>

          {/* Mobile Filters Action Bar */}
          <div className="lg:hidden flex items-center gap-3 mb-6 w-full">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-xs font-bold text-white"
              style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
            >
              <SlidersHorizontal size={14} /> FILTER & SORT
            </button>
            <button
              onClick={resetAllFilters}
              className="py-2.5 px-4 rounded text-xs font-bold text-neutral-400"
              style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
            >
              RESET
            </button>
          </div>

          {/* Mobile Filters Modal Drawer */}
          {showFiltersMobile && (
            <div 
              className="lg:hidden fixed inset-0 z-50 flex justify-end"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <div 
                className="w-80 h-full p-6 overflow-y-auto flex flex-col justify-between"
                style={{ background: "#0d0d0d", borderLeft: "1px solid #1a1a1a" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
                    <h3 className="text-sm font-bold text-white uppercase">Filter Upgrades</h3>
                    <button onClick={() => setShowFiltersMobile(false)} className="text-neutral-500 font-bold text-sm bg-none border-none cursor-pointer">CLOSE</button>
                  </div>

                  {/* Mobile Search */}
                  <div className="mb-6">
                    <label className="block mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Search Keywords</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search parts..."
                      className="w-full px-4 py-2 rounded text-xs text-white"
                      style={{ background: "#151515", border: "1px solid #222", outline: "none" }}
                    />
                  </div>

                  {/* Mobile Category Select */}
                  <div className="mb-6">
                    <label className="block mb-2.5 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Categories</label>
                    <select
                      value={selectedCategory}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded text-xs text-white"
                      style={{ background: "#151515", border: "1px solid #222", outline: "none" }}
                    >
                      {categoryMap.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Compatibility */}
                  <div className="mb-6">
                    <label className="block mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Compatibility</label>
                    <select
                      value={compatibility}
                      onChange={e => setCompatibility(e.target.value)}
                      className="w-full px-4 py-2.5 rounded text-xs text-white"
                      style={{ background: "#151515", border: "1px solid #222", outline: "none" }}
                    >
                      <option value="ALL">All Vehicles</option>
                      <option value="Civic">Honda Civic</option>
                      <option value="Corolla">Toyota Corolla</option>
                      <option value="Yaris">Toyota Yaris</option>
                      <option value="BRV">Honda BR-V</option>
                    </select>
                  </div>

                  {/* Mobile Price */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Max Budget</label>
                      <span className="text-xs font-bold text-white">PKR {priceRange.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="60000"
                      step="500"
                      value={priceRange}
                      onChange={e => setPriceRange(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                  </div>

                  {/* Mobile Sorting */}
                  <div className="mb-6">
                    <label className="block mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Sort Order</label>
                    <select
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                      className="w-full px-4 py-2.5 rounded text-xs text-white"
                      style={{ background: "#151515", border: "1px solid #222", outline: "none" }}
                    >
                      <option value="popularity">Most Reviews</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-full py-3 rounded font-bold text-xs text-white tracking-wider border-none cursor-pointer"
                  style={{ background: "#e8192c" }}
                >
                  APPLY FILTERS
                </button>
              </div>
            </div>
          )}

          {/* Main Products Grid */}
          <main className="flex-1 animate-page">
            {/* Active Filters Display */}
            {(selectedCategory !== "all" || compatibility !== "ALL" || searchQuery.trim() || priceRange < 60000) && (
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-neutral-400">
                <span>Active Filters:</span>
                {selectedCategory !== "all" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-500" style={{ background: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)" }}>
                    Category: {selectedCategory.toUpperCase()}
                  </span>
                )}
                {compatibility !== "ALL" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-500" style={{ background: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)" }}>
                    Vehicle: {compatibility.toUpperCase()}
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-500" style={{ background: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)" }}>
                    Keyword: "{searchQuery}"
                  </span>
                )}
                {priceRange < 60000 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-500" style={{ background: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)" }}>
                    Max: {priceRange.toLocaleString()} PKR
                  </span>
                )}
                <button
                  onClick={resetAllFilters}
                  className="text-[10px] text-neutral-500 hover:text-white transition-colors underline font-bold"
                  style={{ border: "none", background: "none", cursor: "pointer" }}
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products grid */}
            {processedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={setSelectedProduct} />
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-20 rounded-lg"
                style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }}
              >
                <Search size={36} color="#444" className="mx-auto mb-4" />
                <h3 className="mb-2 text-sm font-bold text-white uppercase" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  No Products Found
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  We couldn't find any modification parts matching your filters. Try search keywords or reset filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 rounded text-xs font-bold text-white transition-colors border-none cursor-pointer"
                  style={{ background: "#e8192c" }}
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          whatsapp={whatsapp}
        />
      )}
    </div>
  );
}
