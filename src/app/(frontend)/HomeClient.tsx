'use client'

import { useState, useEffect, useCallback } from "react";
import { Hero } from "@/app/components/Hero";
import { Categories } from "@/app/components/Categories";
import { TopProducts } from "@/app/components/TopProducts";
import { ProjectGallery } from "@/app/components/ProjectGallery";
import { Testimonials } from "@/app/components/Testimonials";
import { ProductModal } from "@/app/components/ProductModal";
import { Product } from "@/app/components/ProductCard";
import { SplashScreen } from "@/app/components/SplashScreen";

interface HomeClientProps {
  siteContent: any;
  categories: any[];
  topProducts: any[];
  featuredProduct: any;
  projects: any[];
  testimonials: any[];
}

export function HomeClient({
  siteContent,
  categories,
  topProducts,
  featuredProduct,
  projects,
  testimonials
}: HomeClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = element.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="animate-page">
      <Hero
        titleLine1={siteContent?.heroTitleLine1}
        titleLine2Static={siteContent?.heroTitleLine2Static}
        typewriterWords={siteContent?.heroTypewriterWords}
        subcopy={siteContent?.heroSubcopy}
      />
      
      <Categories 
        categories={categories} 
      />
      
      <TopProducts
        onAddToCart={setSelectedProduct}
        featuredProduct={featuredProduct}
        topProducts={topProducts}
        whatsapp={siteContent?.whatsappNumber}
      />
      
      <ProjectGallery 
        projects={projects}
        whatsapp={siteContent?.whatsappNumber}
      />
      
      <Testimonials 
        testimonials={testimonials} 
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          whatsapp={siteContent?.whatsappNumber}
        />
      )}
    </div>
  );
}
