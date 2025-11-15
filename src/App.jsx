// src/App.jsx
import React, { useState, useEffect } from "react";
import { whiskyData } from "./data.js";

// Helper: image component with fallback
function WhiskyImage({ src, alt }) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
  }, [src]);

  if (ok) {
    return (
      <img
        src={src}
        alt={alt}
        style={{
          width: 96,
          height: 96,
          objectFit: "cover",
          borderRadius: 12,
          flexShrink: 0,
        }}
      />
    );
  }

  // SVG placeholder
  return (
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef2f7",
        flexShrink: 0,
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 7h16v10H4z"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 11h8"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [filterSmoke, setFilterSmoke] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fav_whiskies") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("fav_whiskies", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (id) => {
    setFavorites((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const list = whiskyData
    .filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
    .filter((w) => (filterSmoke === null ? true : w.smoke >= filterSmoke))
    .sort((a, b) => a.smoke - b.smoke);

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        background: "#f7fafc",
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              background: "#e6eefc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3v18"
                stroke="#1e3a8a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 7h8M6 11h12M7 15h10"
                stroke="#1e3a8a"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>
              Interactive Whisky Guide — Consultant Mode
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
              Tap a card to expand. Built for mobile — deploy to Vercel and share via QR.
            </p>
          </div>
        </header>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            aria-label="Search whiskies"
            placeholder="Search whiskies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "white",
            }}
          />
          <button
            onClick={() => setFilterSmoke(filterSmoke === null ? 6 : null)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #c7d2fe",
              background: filterSmoke === null ? "white" : "#e0e7ff",
            }}
          >
            {filterSmoke === null ? "All smoke" : "Peaty ≥6"}
          </button>
        </div>

        <main style={{ display: "grid", gap: 12 }}>
          {list.map((w) => (
            <article
              key={w.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                background: "white",
                padding: 12,
                borderRadius: 12,
                boxShadow: "0 6px 20px rgba(2,6,23,0.04)",
              }}
            >
              <WhiskyImage src={w.image} alt={w.name} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>{w.name}</h3>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                      {w.region} • ABV {w.abv}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => toggleFav(w.id)}
                      aria-label="Toggle favorite"
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                    >
                      {favorites.includes(w.id) ? "★" : "☆"}
                    </button>
                  </div>
                </div>

                <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#334155" }}>{w.short}</p>

                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: "pointer", color: "#0f172a" }}>Details</summary>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 13, color: "#475569" }}>
                      <strong>Scent:</strong> {w.scent}
                    </div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
                      <strong>Taste:</strong> {w.taste}
                    </div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
                      <strong>Formal description:</strong> {w.long}
                    </div>
                  </div>
                </details>
              </div>
            </article>
          ))}

          {list.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 24,
                color: "#64748b",
                background: "white",
                borderRadius: 12,
              }}
            >
              No whiskies match your search.
            </div>
          )}
        </main>

        <footer style={{ marginTop: 20, padding: 12, textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: 13 }}>Tip: mark favourites (★) and create your top 3 before the team pitches.</div>
          <div style={{ fontSize: 12, marginTop: 8 }}>Deploy instructions in README below.</div>
        </footer>
      </div>
    </div>
  );
}
