'use client'

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, Calendar, Wrench, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Project {
  id: string;
  title: string;
  category: "TOYOTA COROLLA" | "HONDA CIVIC" | "TOYOTA YARIS" | "HONDA BRV";
  image: string;
  description: string;
  date: string;
  partsUsed: string[];
  specs: {
    wheels?: string;
    bodyKit?: string;
    interior?: string;
    lighting?: string;
  };
}

const STATIC_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Honda Civic 'Cyber Edition'",
    category: "HONDA CIVIC",
    image: "https://images.unsplash.com/photo-1617469767053-d3b508a0d7f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "A complete visual overhaul featuring carbon fiber aerodynamics, precise neon accent lighting, and track-ready wheels designed for a stealth presence.",
    date: "May 2026",
    partsUsed: ["Carbon Side Mirror Covers", "Rear Bumper Diffuser", "RGB Ambient Lighting Kit", "Carbon Fiber Steering Wheel"],
    specs: {
      wheels: "18\" Matte Black Sport Rims",
      bodyKit: "Hakai V2 Front Lip & Rear Diffuser",
      interior: "Custom Alcantara & Carbon Steering",
      lighting: "Full Underglow & Multi-zone Ambient Kit",
    },
  },
  {
    id: "2",
    title: "Toyota Corolla 'Stealth Shadow'",
    category: "TOYOTA COROLLA",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "A deep black aesthetic accented by bright red accents. Optimized with visual body expansions and premium lighting setups.",
    date: "April 2026",
    partsUsed: ["Front Bumper Lip", "Trunk Lip Spoiler", "RGB Ambient Lighting Kit"],
    specs: {
      wheels: "18\" Gloss Black Sport Rims",
      bodyKit: "Hakai Front Splitter & Trunk Spoiler",
      lighting: "Integrated Footwell Ambient Setup",
    },
  },
  {
    id: "3",
    title: "Toyota Yaris 'Track Edition'",
    category: "TOYOTA YARIS",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "A track-focused compact build optimized for minimal weight and aggressive looks. Perfect balance between aesthetics and functionality.",
    date: "March 2026",
    partsUsed: ["Carbon Side Mirror Covers", "Trunk Lip Spoiler"],
    specs: {
      wheels: "17\" Lightweight Bronze Wheels",
      bodyKit: "Carbon Spoiler and Side Extensions",
    },
  },
  {
    id: "4",
    title: "Honda BR-V 'Adventure Explorer'",
    category: "HONDA BRV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    description: "Taking an SUV to the next level with customized aesthetic components, enhanced LED ambient systems, and premium wheel packages.",
    date: "February 2026",
    partsUsed: ["RGB Ambient Lighting Kit", "Carbon Side Mirror Covers"],
    specs: {
      wheels: "18\" Off-Road Alloy Wheels",
      bodyKit: "Robust Hakai Bumper Guards",
      lighting: "Starlight Roof and Door Trim Kit",
    },
  },
];

const categories = ["ALL BUILDS", "TOYOTA COROLLA", "HONDA CIVIC", "TOYOTA YARIS", "HONDA BRV"];

interface ProjectGalleryProps {
  projects?: any[];
  whatsapp?: string;
}

export function ProjectGallery({ projects, whatsapp = "923490090074" }: ProjectGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL BUILDS");
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeProject) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setActiveProject(null);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [activeProject]);

  const galleryList = projects && projects.length > 0
    ? projects.map(p => {
        const imageUrl = typeof p.image === "object" && p.image !== null ? p.image.url : p.image;
        const parts = Array.isArray(p.partsUsed)
          ? p.partsUsed.map((x: any) => typeof x === "object" ? x.part : x)
          : [];
        return {
          id: p.id || p._id,
          title: p.title,
          category: p.category,
          image: imageUrl,
          description: p.description,
          date: p.date,
          partsUsed: parts,
          specs: {
            wheels: p.wheels,
            bodyKit: p.bodyKit,
            interior: p.interior,
            lighting: p.lighting
          }
        };
      })
    : STATIC_PROJECTS;

  const filteredProjects = selectedCategory === "ALL BUILDS"
    ? galleryList
    : galleryList.filter(p => p.category === selectedCategory);

  const handleWhatsAppInquiry = (projectTitle: string) => {
    const text = encodeURIComponent(`Hi Hakai Motives! I am interested in getting a custom build package similar to: "${projectTitle}". Please share pricing and details.`);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
  };

  return (
    <section id="gallery" className="py-20" style={{ background: "#0d0d0d" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-0.5" style={{ background: "#e8192c" }} />
              <span style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "11px", fontWeight: 600, letterSpacing: "3px" }}>OUR BUILDS</span>
            </div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px" }}>
              PROJECT GALLERY
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded text-xs font-semibold tracking-wider transition-all duration-300"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  background: selectedCategory === cat ? "#e8192c" : "#141414",
                  color: selectedCategory === cat ? "#ffffff" : "#888888",
                  border: `1px solid ${selectedCategory === cat ? "#e8192c" : "#1e1e1e"}`,
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  if (selectedCategory !== cat) {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "#e8192c";
                  }
                }}
                onMouseLeave={e => {
                  if (selectedCategory !== cat) {
                    e.currentTarget.style.color = "#888888";
                    e.currentTarget.style.borderColor = "#1e1e1e";
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer rounded-lg overflow-hidden relative transition-all duration-500"
              style={{
                background: "#111111",
                border: "1px solid #1a1a1a",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#e8192c";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(232,25,44,0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#1a1a1a";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => setActiveProject(project)}
            >
              {/* Image Frame */}
              <div className="relative overflow-hidden aspect-[16/10]">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "rgba(0, 0, 0, 0.4)" }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded text-xs font-bold tracking-wider"
                    style={{
                      background: "#e8192c",
                      color: "#ffffff",
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    VIEW BUILD DETAILS <ExternalLink size={12} />
                  </div>
                </div>

                {/* Badge Category */}
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
                  style={{
                    background: "rgba(0, 0, 0, 0.75)",
                    border: "1px solid rgba(232,25,44,0.4)",
                    color: "#e8192c",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  {project.category}
                </div>
              </div>

              {/* Description Info */}
              <div className="p-5">
                <h3
                  className="mb-2 transition-colors duration-300 group-hover:text-red-500"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "18px",
                  }}
                >
                  {project.title}
                </h3>
                <p
                  className="line-clamp-2"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    color: "#999999",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.partsUsed.slice(0, 2).map((part: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px]"
                      style={{
                        background: "#1a1a1a",
                        color: "#aaaaaa",
                        border: "1px solid #262626",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {part}
                    </span>
                  ))}
                  {project.partsUsed.length > 2 && (
                    <span
                      className="px-2 py-0.5 rounded text-[10px]"
                      style={{
                        background: "#1a1a1a",
                        color: "#e8192c",
                        border: "1px solid #262626",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      +{project.partsUsed.length - 2} MORE
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeProject && mounted && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 100 }}
          onClick={() => setActiveProject(null)}
        >
          {/* Modal Container */}
          <div
            className="w-full max-w-4xl rounded-lg overflow-hidden flex flex-col md:flex-row relative animate-fade-in"
            style={{
              background: "#0d0d0d",
              border: "1px solid #1e1e1e",
              boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid #2a2a2a",
                color: "#ffffff",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#e8192c")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              <X size={18} />
            </button>

            {/* Left Column: Big Image */}
            <div className="w-full md:w-1/2 relative bg-black flex items-center">
              <ImageWithFallback
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover aspect-video md:aspect-auto"
                style={{ minHeight: "260px", maxHeight: "100%" }}
              />
            </div>

            {/* Right Column: Build Details */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between" style={{ maxHeight: "calc(90vh - 50px)" }}>
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                    style={{
                      background: "rgba(232,25,44,0.1)",
                      border: "1px solid rgba(232,25,44,0.3)",
                      color: "#e8192c",
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    {activeProject.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#888", fontFamily: "Outfit, sans-serif" }}>
                    <Calendar size={12} />
                    {activeProject.date}
                  </div>
                </div>

                {/* Project Title */}
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 3vw, 26px)",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {activeProject.title}
                </h3>

                {/* Project Description */}
                <p
                  className="mb-6"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    color: "#888888",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {activeProject.description}
                </p>

                {/* Hakai Motives Parts Used */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 text-[12px] font-bold tracking-wider" style={{ color: "#e8192c", fontFamily: "Space Grotesk, sans-serif" }}>
                    <Wrench size={13} />
                    INSTALLED HAKAI MOTIVES PARTS:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.partsUsed.map((part: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded text-xs"
                        style={{
                          background: "#161616",
                          color: "#dddddd",
                          border: "1px solid #2a2a2a",
                          fontFamily: "Outfit, sans-serif",
                        }}
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Build Specifications Details */}
                <div className="mb-6 py-4 px-4 rounded" style={{ background: "#111111", border: "1px solid #1a1a1a" }}>
                  <div className="text-[11px] font-bold tracking-wider mb-2" style={{ color: "#888", fontFamily: "Space Grotesk, sans-serif" }}>
                    BUILD SPECS:
                  </div>
                  <ul className="flex flex-col gap-2 text-xs" style={{ fontFamily: "Outfit, sans-serif", color: "#aaaaaa" }}>
                    {activeProject.specs.wheels && (
                      <li><strong className="text-white">Wheels:</strong> {activeProject.specs.wheels}</li>
                    )}
                    {activeProject.specs.bodyKit && (
                      <li><strong className="text-white">Aero:</strong> {activeProject.specs.bodyKit}</li>
                    )}
                    {activeProject.specs.lighting && (
                      <li><strong className="text-white">Lighting:</strong> {activeProject.specs.lighting}</li>
                    )}
                    {activeProject.specs.interior && (
                      <li><strong className="text-white">Interior:</strong> {activeProject.specs.interior}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleWhatsAppInquiry(activeProject.title)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded font-bold tracking-wide transition-colors"
                style={{
                  background: "#e8192c",
                  color: "#ffffff",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "13px",
                  cursor: "pointer",
                  border: "none",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#c0000f")}
                onMouseLeave={e => (e.currentTarget.style.background = "#e8192c")}
              >
                <MessageCircle size={16} /> REQUEST CUSTOM BUILD PACKAGE
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </section>
  );
}
