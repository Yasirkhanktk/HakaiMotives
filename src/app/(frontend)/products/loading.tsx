export default function ProductsLoading() {
  return (
    <div style={{ background: "#080808", minHeight: "100vh", paddingTop: 80 }}>
      {/* Header Banner Skeleton */}
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px",
          marginBottom: 40,
          background: "linear-gradient(135deg, #120002 0%, #0a0a0a 50%, #0d0d0d 100%)",
          borderBottom: "1px solid rgba(232, 25, 44, 0.15)",
        }}
      >
        <div className="skeleton" style={{ width: 120, height: 10, margin: "0 auto 16px" }} />
        <div className="skeleton" style={{ width: "min(400px, 70%)", height: 42, margin: "0 auto 14px" }} />
        <div className="skeleton" style={{ width: "min(340px, 55%)", height: 14, margin: "0 auto" }} />
      </div>

      {/* Content Area */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", gap: 32 }}>
          {/* Sidebar Skeleton (desktop only) */}
          <aside
            style={{
              width: 256,
              flexShrink: 0,
              padding: 24,
              background: "#0d0d0d",
              border: "1px solid #1a1a1a",
              borderRadius: 8,
              height: "fit-content",
            }}
            className="hidden lg:block"
          >
            <div className="skeleton" style={{ width: "60%", height: 14, marginBottom: 24 }} />
            <div className="skeleton" style={{ width: "100%", height: 36, marginBottom: 24, borderRadius: 4 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ width: `${60 + Math.random() * 30}%`, height: 24, borderRadius: 4 }} />
              ))}
            </div>
          </aside>

          {/* Products Grid Skeleton */}
          <main style={{ flex: 1 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 24,
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="skeleton-card" style={{ height: 320 }}>
                  <div className="skeleton" style={{ height: 200, borderRadius: 0 }} />
                  <div style={{ padding: 16 }}>
                    <div className="skeleton-text" style={{ width: "50%", marginBottom: 10 }} />
                    <div className="skeleton-text" style={{ width: "80%", marginBottom: 10 }} />
                    <div className="skeleton-text" style={{ width: "35%" }} />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
