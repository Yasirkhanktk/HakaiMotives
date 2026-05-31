'use client'

import { useState, useEffect } from "react";
import { ChevronRight, ArrowDown } from "lucide-react";


const DEFAULT_TYPEWRITER = ["Bumpers", "Spoilers", "Rims", "Body Kits", "Carbon Fiber", "Ambient Lights"];
const TICKER_WORDS = ["Performance", "Aesthetics", "Precision", "Power", "Style", "Innovation"];

const TYPE_SPEED = 80;
const DELETE_SPEED = 45;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 400;

interface HeroProps {
  titleLine1?: string;
  titleLine2Static?: string;
  typewriterWords?: { word: string }[];
  subcopy?: string;
}

function useTypewriter(words: string[]) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting" | "waiting">("typing");

  useEffect(() => {
    if (!words.length) return;
    const currentWord = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing": {
        if (display.length < currentWord.length) {
          timeout = setTimeout(() => {
            setDisplay(currentWord.slice(0, display.length + 1));
          }, TYPE_SPEED + Math.random() * 40);
        } else {
          setPhase("pausing");
        }
        break;
      }
      case "pausing": {
        timeout = setTimeout(() => setPhase("deleting"), PAUSE_AFTER_TYPE);
        break;
      }
      case "deleting": {
        if (display.length > 0) {
          timeout = setTimeout(() => {
            setDisplay(display.slice(0, -1));
          }, DELETE_SPEED);
        } else {
          setPhase("waiting");
        }
        break;
      }
      case "waiting": {
        timeout = setTimeout(() => {
          setWordIdx((prev) => (prev + 1) % words.length);
          setPhase("typing");
        }, PAUSE_AFTER_DELETE);
        break;
      }
    }

    return () => clearTimeout(timeout);
  }, [display, wordIdx, phase, words]);

  return display;
}

export function Hero({
  titleLine1 = "Redefine Your Ride.",
  titleLine2Static = "Upgrade Your",
  typewriterWords,
  subcopy = "Premium modification parts — body kits, spoilers, ambient lighting & performance upgrades for Toyota, Honda & more."
}: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const typewriterList = typewriterWords && typewriterWords.length > 0
    ? typewriterWords.map(w => w.word)
    : DEFAULT_TYPEWRITER;

  const typedWord = useTypewriter(typewriterList);

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-16"
      style={{ background: "#080808", minHeight: "100vh" }}
    >
      {/* Background illustration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/hero-car.png)",
          backgroundSize: "clamp(600px, 52vw, 850px)",
          backgroundPosition: "center 55%",
          backgroundRepeat: "no-repeat",
          opacity: loaded ? 0.28 : 0,
          transform: loaded ? "scale(1)" : "scale(0.95)",
          transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 1,
        }}
      />

      {/* Vignette overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 50% at 50% 48%, transparent 0%, #080808 78%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, #080808 0%, transparent 15%, transparent 78%, #080808 100%)" }} />

      {/* SVG tachometer rings */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "520px", height: "520px",
          opacity: loaded ? 0.07 : 0, transition: "opacity 2s ease 0.5s",
        }}
      >
        <svg viewBox="0 0 520 520" fill="none">
          <circle cx="260" cy="260" r="240" stroke="#e8192c" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" values="0 260 260;360 260 260" dur="60s" repeatCount="indefinite" />
          </circle>
          <circle cx="260" cy="260" r="200" stroke="#e8192c" strokeWidth="0.3" strokeDasharray="2 12" opacity="0.4">
            <animateTransform attributeName="transform" type="rotate" values="360 260 260;0 260 260" dur="45s" repeatCount="indefinite" />
          </circle>
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const x1 = 260 + 218 * Math.cos(angle);
            const y1 = 260 + 218 * Math.sin(angle);
            const x2 = 260 + 225 * Math.cos(angle);
            const y2 = 260 + 225 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#e8192c" strokeWidth={i % 3 === 0 ? "1" : "0.3"} opacity={i % 3 === 0 ? "0.5" : "0.25"} />
            );
          })}
        </svg>
      </div>

      {/* Corner glows */}
      <div className="absolute pointer-events-none" style={{ top: "8%", left: "8%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,25,44,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "10%", right: "6%", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,25,44,0.05) 0%, transparent 70%)", filter: "blur(45px)" }} />

      {/* Racing stripes */}
      <div className="absolute pointer-events-none" style={{ top: "36%", left: 0, width: "100px", height: "1px", background: "linear-gradient(to right, transparent, rgba(232,25,44,0.3), transparent)" }} />
      <div className="absolute pointer-events-none" style={{ top: "38%", left: 0, width: "60px", height: "1px", background: "linear-gradient(to right, transparent, rgba(232,25,44,0.15), transparent)" }} />
      <div className="absolute pointer-events-none" style={{ top: "58%", right: 0, width: "80px", height: "1px", background: "linear-gradient(to left, transparent, rgba(232,25,44,0.2), transparent)" }} />
      <div className="absolute pointer-events-none" style={{ top: "60%", right: 0, width: "50px", height: "1px", background: "linear-gradient(to left, transparent, rgba(232,25,44,0.1), transparent)" }} />

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "calc(100vh - 64px)", paddingTop: "48px", paddingBottom: "48px" }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            marginBottom: "32px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e8192c", boxShadow: "0 0 8px rgba(232,25,44,0.6)", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "Outfit, sans-serif", color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase" }}>
            Hakai Motives
          </span>
          <span style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <span style={{ fontFamily: "Outfit, sans-serif", color: "rgba(255,255,255,0.2)", fontSize: "11px", fontWeight: 400, letterSpacing: "2px", textTransform: "uppercase" }}>
            Est. Pakistan
          </span>
        </div>

        {/* Headline with typewriter */}
        <h1
          style={{
            margin: "0 0 12px 0",
            maxWidth: "860px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(24px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.35s",
          }}
        >
          {/* Line 1 */}
          <span style={{
            display: "block",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(36px, 5.2vw, 64px)",
            fontWeight: 700, lineHeight: 1.08, letterSpacing: "-2px",
            color: "#ffffff",
          }}>
            {titleLine1}
          </span>

          {/* Line 2 */}
          <span style={{
            display: "flex", alignItems: "baseline", justifyContent: "center",
            gap: "clamp(6px, 1vw, 14px)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(36px, 5.2vw, 64px)",
            fontWeight: 700, lineHeight: 1.15, letterSpacing: "-2px",
            flexWrap: "wrap",
          }}>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>{titleLine2Static}</span>
            <span style={{
              display: "inline-flex", alignItems: "baseline",
              color: "#e8192c",
              minWidth: "clamp(120px, 18vw, 280px)",
              textAlign: "left",
              position: "relative",
            }}>
              {typedWord}
              {/* Blinking cursor */}
              <span style={{
                display: "inline-block",
                width: "3px",
                height: "clamp(30px, 4.5vw, 52px)",
                background: "#e8192c",
                marginLeft: "3px",
                borderRadius: "2px",
                animation: "blink 0.65s step-end infinite",
                verticalAlign: "baseline",
                position: "relative",
                top: "4px",
                boxShadow: "0 0 10px rgba(232,25,44,0.5)",
              }} />
            </span>
          </span>
        </h1>

        {/* Rotating ticker */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            margin: "14px 0 18px",
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease 0.6s",
          }}
        >
          <span style={{
            width: "28px", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(232,25,44,0.45))",
          }} />
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            height: "20px", overflow: "hidden",
          }}>
            <span style={{
              fontFamily: "Outfit, sans-serif", fontSize: "11px", fontWeight: 400,
              color: "rgba(255,255,255,0.28)", letterSpacing: "2px", textTransform: "uppercase",
            }}>
              We Build
            </span>
            <span
              key={tickerIndex}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 600,
                color: "#e8192c", letterSpacing: "1.5px", textTransform: "uppercase",
                animation: "tickerFade 2.2s ease", display: "inline-block",
              }}
            >
              {TICKER_WORDS[tickerIndex]}
            </span>
          </div>
          <span style={{
            width: "28px", height: "1px",
            background: "linear-gradient(90deg, rgba(232,25,44,0.45), transparent)",
          }} />
        </div>

        {/* Thin divider */}
        <div style={{
          width: "48px", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(232,25,44,0.5), transparent)",
          margin: "0 auto 22px",
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s ease 0.65s",
        }} />

        {/* Sub-copy */}
        <p
          style={{
            fontFamily: "Outfit, sans-serif",
            color: "rgba(255,255,255,0.32)",
            fontSize: "clamp(13px, 1.1vw, 14.5px)",
            lineHeight: 1.75, maxWidth: "420px", fontWeight: 400,
            margin: "0 0 36px 0",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.85s",
          }}
        >
          {subcopy}
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap",
            marginBottom: "52px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 1s",
          }}
        >
          <a
            href="#categories"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 32px",
              background: "linear-gradient(135deg, #e8192c 0%, #c0000f 100%)",
              color: "#fff",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: "12px", letterSpacing: "2px",
              textDecoration: "none", borderRadius: "4px",
              boxShadow: "0 4px 28px rgba(232,25,44,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              transition: "all 0.3s ease", textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 40px rgba(232,25,44,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 28px rgba(232,25,44,0.35), inset 0 1px 0 rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Explore Collection <ChevronRight size={14} />
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 32px",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 500, fontSize: "12px", letterSpacing: "2px",
              textDecoration: "none", borderRadius: "4px",
              background: "rgba(255,255,255,0.02)", transition: "all 0.3s ease",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(232,25,44,0.35)";
              e.currentTarget.style.color = "#e8192c";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "rgba(232,25,44,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            Follow Us
          </a>
        </div>

        {/* Scroll nudge */}
        <div
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "6px", color: "rgba(255,255,255,0.14)",
            animation: "nudge 2.4s ease-in-out infinite",
            opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1.2s",
          }}
        >
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase" }}>
            Explore
          </span>
          <ArrowDown size={12} />
        </div>
      </div>


      {/* Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(232,25,44,0.6); }
          50% { opacity: 0.5; box-shadow: 0 0 16px rgba(232,25,44,0.8); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes tickerFade {
          0% { opacity: 0; transform: translateY(8px); }
          12% { opacity: 1; transform: translateY(0); }
          88% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes nudge {
          0%, 100% { transform: translateY(0); opacity: 0.14; }
          50% { transform: translateY(5px); opacity: 0.28; }
        }
      `}</style>
    </section>
  );
}
