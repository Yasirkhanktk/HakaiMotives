export default function HomeLoading() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Hero Skeleton */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d0d0d 100%)",
        }}
      >
        <div className="skeleton" style={{ width: 120, height: 10, marginBottom: 24 }} />
        <div className="skeleton" style={{ width: "min(500px, 80%)", height: 44, marginBottom: 16 }} />
        <div className="skeleton" style={{ width: "min(360px, 60%)", height: 44, marginBottom: 28 }} />
        <div className="skeleton" style={{ width: "min(400px, 70%)", height: 14, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: "min(300px, 50%)", height: 14, marginBottom: 40 }} />
        <div className="skeleton" style={{ width: 160, height: 44, borderRadius: 8 }} />
      </div>

      {/* Categories Skeleton */}
      <div style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="skeleton" style={{ width: 100, height: 10, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: 220, height: 32, marginBottom: 40 }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ height: 200 }}>
              <div className="skeleton" style={{ height: 140, borderRadius: 0 }} />
              <div style={{ padding: 12 }}>
                <div className="skeleton-text" style={{ width: "75%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Skeleton */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="skeleton" style={{ width: 90, height: 10, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: 200, height: 32, marginBottom: 40 }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ height: 320 }}>
              <div className="skeleton" style={{ height: 200, borderRadius: 0 }} />
              <div style={{ padding: 16 }}>
                <div className="skeleton-text" style={{ width: "60%", marginBottom: 10 }} />
                <div className="skeleton-text" style={{ width: "85%", marginBottom: 10 }} />
                <div className="skeleton-text" style={{ width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
