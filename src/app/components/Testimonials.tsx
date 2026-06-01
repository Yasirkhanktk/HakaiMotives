'use client'

import { useState, useEffect } from "react";
import { Star, CheckCircle, MessageSquare, PlusCircle } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  carModel: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  partBought: string;
}

const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Zain Ahmed",
    carModel: "Honda Civic X (2019)",
    location: "Lahore",
    rating: 5,
    date: "2 weeks ago",
    comment: "The RGB Ambient Lighting Kit is absolutely fantastic. Fits perfectly, and the phone app control works seamlessly. The installation was very straightforward thanks to Hassan's guidance over WhatsApp!",
    partBought: "RGB Ambient Lighting Kit",
  },
  {
    id: "2",
    name: "M. Bilal",
    carModel: "Toyota Corolla (2021)",
    location: "Karachi",
    rating: 5,
    date: "1 month ago",
    comment: "Ordered the Hakai Front Bumper Lip and Carbon Side Mirror Covers. The fitment is OEM-like and the paint finish matches the car perfectly. Delivery was super fast to Karachi. Recommended!",
    partBought: "Front Bumper Lip",
  },
  {
    id: "3",
    name: "Hamza Malik",
    carModel: "Toyota Yaris (2022)",
    location: "Islamabad",
    rating: 4,
    date: "1 month ago",
    comment: "Great quality spoiler. The carbon fiber weave looks premium under sunlight. Minor adjustment was needed during fitting but overall extremely pleased with the aggressive look.",
    partBought: "Trunk Lip Spoiler",
  },
];

const stats = [
  { value: "5,000+", label: "CARS MODIFIED" },
  { value: "4.9 / 5.0", label: "CUSTOMER RATING" },
  { value: "12,000+", label: "PARTS SHIPPED" },
  { value: "100%", label: "FITMENT ASSURANCE" },
];

interface TestimonialsProps {
  testimonials?: any[];
}

export function Testimonials({ testimonials: databaseReviews }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | "ALL">("ALL");
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCarModel, setNewCarModel] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newPart, setNewPart] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync database reviews on load
  useEffect(() => {
    if (databaseReviews && databaseReviews.length > 0) {
      setTestimonials(databaseReviews.map(r => ({
        id: r.id || r._id,
        name: r.name,
        carModel: r.carModel,
        location: r.location || "Pakistan",
        rating: r.rating,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently",
        comment: r.comment,
        partBought: r.partBought,
      })));
    } else {
      setTestimonials(STATIC_TESTIMONIALS);
    }
  }, [databaseReviews]);

  const filteredTestimonials = selectedRating === "ALL"
    ? testimonials
    : testimonials.filter(t => t.rating === selectedRating);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCarModel || !newComment) return;

    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          carModel: newCarModel,
          location: newLocation || "Pakistan",
          rating: newRating,
          comment: newComment,
          partBought: newPart || "Modified Part",
          verified: true // Auto verify
        })
      });

      if (response.ok) {
        const doc = await response.json();
        const newReview: Testimonial = {
          id: doc.id,
          name: doc.name,
          carModel: doc.carModel,
          location: doc.location || "Pakistan",
          rating: doc.rating,
          date: "Just now",
          comment: doc.comment,
          partBought: doc.partBought,
        };

        setTestimonials([newReview, ...testimonials]);
        setSubmitted(true);
        
        setTimeout(() => {
          setNewName("");
          setNewCarModel("");
          setNewLocation("");
          setNewRating(5);
          setNewPart("");
          setNewComment("");
          setSubmitted(false);
          setShowForm(false);
        }, 1800);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonials" className="py-20" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-0.5" style={{ background: "#e8192c" }} />
              <span style={{ fontFamily: "Inter, sans-serif", color: "#e8192c", fontSize: "11px", fontWeight: 600, letterSpacing: "3px" }}>REVIEWS</span>
            </div>
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px" }}>
              TESTIMONIALS & REVIEWS
            </h2>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded text-xs font-bold tracking-wider transition-colors self-start md:self-auto"
            style={{
              background: showForm ? "#1a1a1a" : "#e8192c",
              color: "#ffffff",
              border: showForm ? "1px solid #333" : "none",
              fontFamily: "Space Grotesk, sans-serif",
              cursor: "pointer",
            }}
          >
            {showForm ? "CANCEL REVIEW" : "WRITE A REVIEW"} <PlusCircle size={14} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-lg text-center"
              style={{
                background: "#111111",
                border: "1px solid #1a1a1a",
              }}
            >
              <div
                className="mb-1"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  color: "#ffffff",
                  fontSize: "clamp(24px, 3.2vw, 36px)",
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
                  color: "#e8192c",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "2.5px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Review Submission Form */}
        {showForm && (
          <div
            className="mb-16 p-6 sm:p-8 rounded-lg"
            style={{
              background: "#111111",
              border: "1px solid #e8192c",
              boxShadow: "0 0 30px rgba(232,25,44,0.05)",
            }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle size={48} color="#e8192c" className="mb-4 animate-bounce" />
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fff", fontWeight: 700, fontSize: "20px" }}>
                  REVIEW SUBMITTED SUCCESSFULLY!
                </h3>
                <p style={{ fontFamily: "Outfit, sans-serif", color: "#aaa", fontSize: "14px", marginTop: "8px" }}>
                  Thank you for sharing your experience with Hakai Motives.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <h3 className="mb-6" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fff", fontWeight: 700, fontSize: "18px" }}>
                  Submit Your Build Review
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Name *</label>
                    <input
                      required
                      type="text"
                      value={newName}
                      disabled={loading}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Zain Ahmed"
                      className="w-full px-4 py-2 rounded text-sm text-white"
                      style={{ background: "#181818", border: "1px solid #2a2a2a", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Car Model *</label>
                    <input
                      required
                      type="text"
                      value={newCarModel}
                      disabled={loading}
                      onChange={e => setNewCarModel(e.target.value)}
                      placeholder="e.g. Honda Civic 2021"
                      className="w-full px-4 py-2 rounded text-sm text-white"
                      style={{ background: "#181818", border: "1px solid #2a2a2a", outline: "none" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block mb-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={newLocation}
                      disabled={loading}
                      onChange={e => setNewLocation(e.target.value)}
                      placeholder="e.g. Lahore"
                      className="w-full px-4 py-2 rounded text-sm text-white"
                      style={{ background: "#181818", border: "1px solid #2a2a2a", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Part Purchased</label>
                    <input
                      type="text"
                      value={newPart}
                      disabled={loading}
                      onChange={e => setNewPart(e.target.value)}
                      placeholder="e.g. RGB Ambient Lights"
                      className="w-full px-4 py-2 rounded text-sm text-white"
                      style={{ background: "#181818", border: "1px solid #2a2a2a", outline: "none" }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Rating</label>
                    <div className="flex items-center h-10 gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          disabled={loading}
                          onClick={() => setNewRating(num)}
                          className="p-1 hover:scale-115 transition-transform"
                          style={{ cursor: "pointer", background: "none", border: "none" }}
                        >
                          <Star
                            size={18}
                            fill={num <= newRating ? "#e8192c" : "none"}
                            color={num <= newRating ? "#e8192c" : "#444"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Review Comments *</label>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    disabled={loading}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Tell us about the part build quality, fitment, and your overall experience..."
                    className="w-full px-4 py-2 rounded text-sm text-white resize-none"
                    style={{ background: "#181818", border: "1px solid #2a2a2a", outline: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded font-bold text-xs tracking-wider transition-colors disabled:opacity-50"
                  style={{ background: "#e8192c", color: "#fff", cursor: "pointer", fontFamily: "Space Grotesk, sans-serif", border: "none" }}
                >
                  {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Rating Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["ALL", 5, 4].map((rate) => (
            <button
              key={rate.toString()}
              onClick={() => setSelectedRating(rate as any)}
              className="px-4 py-1.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                background: selectedRating === rate ? "#e8192c" : "#141414",
                color: selectedRating === rate ? "#ffffff" : "#bbbbbb",
                border: `1px solid ${selectedRating === rate ? "#e8192c" : "#1e1e1e"}`,
                cursor: "pointer",
              }}
            >
              {rate === "ALL" ? "ALL REVIEWS" : `${rate} STAR`}
              {rate !== "ALL" && <Star size={10} fill={selectedRating === rate ? "#fff" : "#bbb"} stroke="none" />}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 rounded-lg flex flex-col justify-between transition-all duration-300"
              style={{
                background: "#111111",
                border: "1px solid #1a1a1a",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#e8192c")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a1a1a")}
            >
              <div>
                {/* User metadata */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{
                        background: "linear-gradient(135deg, #1d1d1d, #121212)",
                        border: "1px solid #2a2a2a",
                        color: "#e8192c",
                        fontFamily: "Space Grotesk, sans-serif",
                      }}
                    >
                      {testimonial.name ? testimonial.name.split(" ").map(w => w[0]).join("") : "U"}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontFamily: "Space Grotesk, sans-serif",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        {testimonial.name}
                      </h4>
                      <p
                        style={{
                          fontFamily: "Outfit, sans-serif",
                          color: "#888",
                          fontSize: "11px",
                        }}
                      >
                        {testimonial.carModel} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider" style={{ color: "#25D366", fontFamily: "Space Grotesk, sans-serif" }}>
                    <CheckCircle size={12} /> VERIFIED
                  </div>
                </div>

                {/* Stars and Date */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        fill={s <= testimonial.rating ? "#e8192c" : "none"}
                        color={s <= testimonial.rating ? "#e8192c" : "#444"}
                      />
                    ))}
                  </div>
                  <span style={{ fontFamily: "Outfit, sans-serif", color: "#888", fontSize: "11px" }}>
                    {testimonial.date}
                  </span>
                </div>

                {/* Comment Text */}
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    color: "#aaaaaa",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Bottom Tag */}
              {testimonial.partBought && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: "#1b1b1b" }}>
                  <MessageSquare size={12} color="#e8192c" />
                  <span
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      color: "#e8192c",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "1px",
                    }}
                  >
                    PURCHASED: {testimonial.partBought.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
