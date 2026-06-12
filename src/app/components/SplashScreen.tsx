'use client'

import { useState, useEffect, useCallback } from 'react'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0) // 0=init, 1=logo-draw, 2=text-reveal, 3=tagline, 4=exit

  useEffect(() => {
    // Phase timeline
    const timers = [
      setTimeout(() => setPhase(1), 300),    // Start logo draw
      setTimeout(() => setPhase(2), 1400),   // Text reveal
      setTimeout(() => setPhase(3), 2200),   // Tagline
      setTimeout(() => setPhase(4), 3400),   // Begin exit
      setTimeout(() => onComplete(), 4200),  // Done
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#060606',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: phase >= 4 ? 1 : 1,
        transform: phase >= 4 ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)',
        pointerEvents: phase >= 4 ? 'none' : 'auto',
      }}
    >
      {/* Ambient background particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Floating ember particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              borderRadius: '50%',
              background: i % 3 === 0 ? '#e8192c' : 'rgba(255,255,255,0.3)',
              left: `${Math.random() * 100}%`,
              bottom: '-5%',
              opacity: 0,
              animation: `ember ${3 + Math.random() * 4}s ease-out ${Math.random() * 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Radial glow behind logo */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,25,44,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      />

      {/* Tachometer ring */}
      <svg
        viewBox="0 0 300 300"
        style={{
          position: 'absolute',
          width: 'min(280px, 80vw)',
          height: 'min(280px, 80vw)',
          opacity: phase >= 1 ? 0.08 : 0,
          transition: 'opacity 1s ease 0.3s',
        }}
      >
        <circle
          cx="150"
          cy="150"
          r="130"
          fill="none"
          stroke="#e8192c"
          strokeWidth="0.5"
          strokeDasharray="3 6"
          style={{
            animation: 'spinSlow 25s linear infinite',
            transformOrigin: 'center',
          }}
        />
        <circle
          cx="150"
          cy="150"
          r="110"
          fill="none"
          stroke="#e8192c"
          strokeWidth="0.3"
          strokeDasharray="1 10"
          style={{
            animation: 'spinSlow 18s linear infinite reverse',
            transformOrigin: 'center',
          }}
        />
        {/* Tick marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180
          const x1 = 150 + 120 * Math.cos(angle)
          const y1 = 150 + 120 * Math.sin(angle)
          const x2 = 150 + 126 * Math.cos(angle)
          const y2 = 150 + 126 * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e8192c"
              strokeWidth={i % 4 === 0 ? '1' : '0.3'}
              opacity={i % 4 === 0 ? '0.5' : '0.2'}
            />
          )
        })}
      </svg>

      {/* Horizontal accent lines */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '5%',
            width: phase >= 1 ? '18%' : '0%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(232,25,44,0.4), transparent)',
            transition: 'width 1s cubic-bezier(0.16,1,0.3,1) 0.5s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '5%',
            width: phase >= 1 ? '18%' : '0%',
            height: '1px',
            background: 'linear-gradient(to left, transparent, rgba(232,25,44,0.4), transparent)',
            transition: 'width 1s cubic-bezier(0.16,1,0.3,1) 0.5s',
          }}
        />
      </div>

      {/* Logo container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          position: 'relative',
          zIndex: 2,
          width: '90%',
          textAlign: 'center',
        }}
      >
        {/* SVG Logo with draw animation */}
        <div
          style={{
            width: 'min(80px, 20vw)',
            height: 'min(80px, 20vw)',
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.7)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Glow path (filled, fades in after stroke completes) */}
            <path
              d="M1.5 76.5L34.5 23.5H55.5L41 46.5L75 23.5H95.5L76.5 54L81.5 76.5H58.5L71.5 56.5L43 76.5H20.5L1.5 76.5Z"
              fill="#e8192c"
              style={{
                opacity: phase >= 2 ? 1 : 0,
                transition: 'opacity 0.6s ease 0.2s',
                filter: 'drop-shadow(0 0 20px rgba(232,25,44,0.6))',
              }}
            />
            {/* Stroke path (draws itself) */}
            <path
              d="M1.5 76.5L34.5 23.5H55.5L41 46.5L75 23.5H95.5L76.5 54L81.5 76.5H58.5L71.5 56.5L43 76.5H20.5L1.5 76.5Z"
              fill="none"
              stroke="#e8192c"
              strokeWidth="1.5"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 400,
                strokeDashoffset: phase >= 1 ? 0 : 400,
                transition: 'stroke-dashoffset 1s cubic-bezier(0.65, 0, 0.35, 1)',
                filter: 'drop-shadow(0 0 6px rgba(232,25,44,0.8))',
              }}
            />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {/* HAKAI */}
          {'HAKAI'.split('').map((letter, i) => (
            <span
              key={`h-${i}`}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(20px, 6vw, 42px)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#e8192c',
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? 'translateY(0)' : 'translateY(100%)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`,
                display: 'inline-block',
              }}
            >
              {letter}
            </span>
          ))}
          {/* Space */}
          <span
            style={{
              width: 'clamp(6px, 1.5vw, 14px)',
              display: 'inline-block',
            }}
          />
          {/* MOTIVES */}
          {'MOTIVES'.split('').map((letter, i) => (
            <span
              key={`m-${i}`}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(20px, 6vw, 42px)',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: '#ffffff',
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? 'translateY(0)' : 'translateY(100%)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(5 + i) * 0.06}s`,
                display: 'inline-block',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Thin divider line */}
        <div
          style={{
            width: phase >= 3 ? '60px' : '0px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(232,25,44,0.6), transparent)',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Tagline */}
        <span
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(9px, 2.5vw, 11px)',
            fontWeight: 400,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        >
          Premium Auto Upgrades
        </span>
      </div>

      {/* Bottom loading bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: phase >= 4 ? '100%' : phase >= 3 ? '80%' : phase >= 2 ? '50%' : phase >= 1 ? '20%' : '0%',
              height: '100%',
              background: 'linear-gradient(90deg, #e8192c, #ff4444)',
              borderRadius: '1px',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 0 8px rgba(232,25,44,0.5)',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '9px',
            fontWeight: 400,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
            opacity: phase >= 4 ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          Loading
        </span>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes ember {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
          15% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px);
          }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
