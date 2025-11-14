// src/App.jsx

import React, { useState, useEffect } from "react";

// -------------------------
// Data import
// If you prefer a separate file, paste the contents of src/data.js into public or import it.
// For ease-of-use this file expects a relative import from ./data but falls back to an embedded array.
// -------------------------
import { whiskyData } from "./data";

const data = whiskyData || [];

// -------------------------
// Helper: image component with fallback
// -------------------------
function WhiskyImage({ src, alt }) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
  }, [src]);

  if (ok) return <img src={src} alt={alt} style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 12 }} />;

  // simple SVG placeholder
  return (
    <div style={{ width: 96, height: 96, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#eef2f7" }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7h16v10H4z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 11h8" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// -------------------------
// Main App
// -------------------------
export default function App() {
  const [query, setQuery] = useState("");
  const [filterSmoke, setFilterSmoke] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fav_whiskies") || "[]");
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem("fav_whiskies", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (id) => {
    setFavorites((s) => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  };

  const list = data
    .filter(w => w.name.toLowerCase().includes(query.toLowerCase()))
    .filter(w => filterSmoke === null ? true : w.smoke >= filterSmoke)
    .sort((a,b) => a.smoke - b.smoke); // lighter smoke first

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f7fafc", minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, background: "#e6eefc", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3v18" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 7h8M6 11h12M7 15h10" stroke="#1e3a8a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>Interactive Whisky Guide — Consultant Mode</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>Tap a card to expand. Built for mobile — deploy to Vercel and share via QR.</p>
          </div>
        </header>

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            aria-label="Search whiskies"
            placeholder="Search whiskies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #e2e8f0", background: "white" }}
          />
          <button
            onClick={() => setFilterSmoke(filterSmoke === null ? 6 : null)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #c7d2fe", background: filterSmoke === null ? "white" : "#e0e7ff" }}
          >
            {filterSmoke === null ? "All smoke" : "Peaty ≥6"}
          </button>
        </div>

        <main style={{ display: "grid", gap: 12 }}>
          {list.map(w => (
            <article key={w.id} style={{ display: "flex", gap: 12, alignItems: "center", background: "white", padding: 12, borderRadius: 12, boxShadow: "0 6px 20px rgba(2,6,23,0.04)" }}>
              <div style={{ flexShrink: 0 }}>
                <WhiskyImage src={w.image} alt={w.name} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>{w.name}</h3>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{w.region} • ABV {w.abv}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => toggleFav(w.id)} aria-label="Toggle favorite" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                      {favorites.includes(w.id) ? "★" : "☆"}
                    </button>
                  </div>
                </div>

                <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#334155" }}>{w.short}</p>

                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: "pointer", color: "#0f172a" }}>Details</summary>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 13, color: "#475569" }}><strong>Scent:</strong> {w.scent}</div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}><strong>Taste:</strong> {w.taste}</div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}><strong>Formal description:</strong> {w.long}</div>
                  </div>
                </details>
              </div>
            </article>
          ))}

          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: 24, color: "#64748b", background: "white", borderRadius: 12 }}>
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


// -------------------------
// src/data.js
// Paste this into src/data.js and export as named export `whiskyData`.
// -------------------------

export const whiskyData = [
  { id: 1, name: "Basil Hayden's", region: "Bourbon / Kentucky", scent: "Mild caramel, vanilla, light spice", taste: "Soft sweetness, honey, gentle oak", short: "A low-risk bourbon with high buy-in. Great for onboarding new taste stakeholders.", long: "A light, approachable bourbon focused on balance and softness. Ideal as an entry point for tasters of all levels.", image: "/images/basil_haydens.jpg", smoke: 1, abv: "40%" },
  { id: 2, name: "Eagle Rare", region: "Bourbon / Kentucky", scent: "Vanilla, candied fruit, light tobacco", taste: "Rich sweetness, orange peel, caramel, spiced oak", short: "Premium value proposition with clear caramel synergy and a strong finish pipeline.", long: "A characterful bourbon delivering depth and elegance in both nose and palate. Prominent fruit sweetness and well-integrated oak.", image: "/images/eagle_rare.jpg", smoke: 1, abv: "45%" },
  { id: 3, name: "Redbreast 21", region: "Irish / Single Pot Still", scent: "Tropical fruit, nuts, honey, warm spice", taste: "Silky, fruity sweetness, almonds, vanilla, spice", short: "Flagship whisky delivering an end-to-end luxury experience. Ultimate stakeholder satisfaction.", long: "One of the most celebrated Irish single pot still whiskies. Deep, complex and velvety with a long elegant finish.", image: "/images/redbreast_21.jpg", smoke: 1, abv: "46%" },
  { id: 4, name: "Craigellachie 2013/2025 (Lady of the Glen) 12", region: "Speyside", scent: "Green fruit, malt, citrus, vanilla", taste: "Powerful fruit, waxy notes, oak, malty sweetness", short: "High-impact Speyside with strong fruit bandwidth. Low change management required.", long: "An intense and aromatic Speyside whisky with a pronounced fruit profile and robust malt structure. Cask strength adds depth.", image: "/images/craigellachie_lady_of_the_glen.jpg", smoke: 2, abv: "60.5%" },
  { id: 5, name: "Yamazaki 12", region: "Japan / Single Malt", scent: "Ripe peach, honey, sandalwood", taste: "Soft fruit, sweet malt, floral notes", short: "Lean, elegant and extremely well-structured — like Japanese project management in liquid form.", long: "An iconic Japanese single malt known for its precision and nuanced fruit character. Harmonious and complex.", image: "/images/yamazaki_12.jpg", smoke: 1, abv: "43%" },
  { id: 6, name: "Nikka 12", region: "Japan / Blended", scent: "Dried fruit, light smoke, spiced oak", taste: "Balanced fruit, mellow sweetness, subtle dryness", short: "A balanced leadership blend — transparent governance, no silo thinking.", long: "A sophisticated blended whisky combining Japanese finesse with depth and structure. Harmonious and eminently drinkable.", image: "/images/nikka_12.jpg", smoke: 1, abv: "43%" },
  { id: 7, name: "The Observatory 20 (Signature Series)", region: "Single Grain", scent: "Vanilla, banana, cream toffee", taste: "Mild, creamy grain sweetness with light oak", short: "Soft as a slide deck: easy to drink, easy to implement.", long: "A mature grain whisky with a light, creamy texture and delicate sweetness. Approachable and polished.", image: "/images/observatory_20.jpg", smoke: 1, abv: "40%" },
  { id: 8, name: "Old Particular Cambus 35", region: "Single Grain (35 years)", scent: "Fudge, vanilla, tropical fruit, creme brulee", taste: "Silky caramel, coconut, mature sweetness", short: "A 35-year grain offering maximum ROI on sweetness and maturity. Zero technical debt.", long: "A luxurious old grain whisky with remarkable silkiness and depth. Sweet, complex and long on the finish.", image: "/images/cambus_35.jpg", smoke: 1, abv: "~48%" },
  { id: 9, name: "Caol Ila 12", region: "Islay", scent: "Light smoke, citrus, sea air, green apple", taste: "Mild peat, lemon zest, malty sweetness, mineral finish", short: "Entry-level Islay peat with low friction and high adoption rate.", long: "An elegant Islay malt with balanced peat and fresh citrus notes. Accessible yet complex.", image: "/images/caol_ila_12.jpg", smoke: 6, abv: "43%" },
  { id: 10, name: "Ardbeg An Oa (Monsters of Smoke)", region: "Islay", scent: "Rounded smoke, chocolate, spicy sweetness", taste: "Creamy smoke, toffee, licorice", short: "Rounded stakeholder experience — smooth peaty balance.", long: "A softer, more rounded Ardbeg produced by vatting various cask types. Harmonious and user-friendly peat.", image: "/images/ardbeg_an_oa.jpg", smoke: 8, abv: "46%" },
  { id: 11, name: "Ardbeg 10 (Monsters of Smoke)", region: "Islay", scent: "Classic Ardbeg smoke, lime, tar, sea spray", taste: "Intense peat, citrus, black pepper", short: "The classic baseline: peat with clear KPIs — citrus and tar.", long: "One of Islay's iconic peated malts. Intense and clean peat balanced by citrus and malt.", image: "/images/ardbeg_10.jpg", smoke: 9, abv: "46%" },
  { id: 12, name: "Ardbeg Wee Beastie 5 (Monsters of Smoke)", region: "Islay", scent: "Raw peat, black pepper, fresh lime", taste: "Aggressive peat, peppery, sharp citrus", short: "Aggressive, young, \"move fast and break things\" whisky. Pure disruption.", long: "A young, high-energy Ardbeg with pronounced peat and a lively citrus backbone. Designed for maximum impact.", image: "/images/ardbeg_wee_beastie.jpg", smoke: 10, abv: "47.4%" },
  { id: 13, name: "Lagavulin 16", region: "Islay", scent: "Tar, peat, dried fruit", taste: "Deep rounded smoke, raisins, caramel, sea salt", short: "The legacy system that still outperforms: tar, deep smoke and enterprise stability.", long: "A world-class classic. Deep, complex smoke complemented by sweet dark fruits and an exceptionally long finish.", image: "/images/lagavulin_16.jpg", smoke: 10, abv: "43%" },
  { id: 14, name: "MacNair's Lum Reek 10", region: "Blended Malt", scent: "Hearty smoke, fruit compote, oak", taste: "Peated drive, fruit and spice", short: "Peated blended malt with high-octane smoke and layered complexity. Great for agile taste sprints.", long: "A blended malt with assertive peat and a rounded fruit character. Robust and flavorful.", image: "/images/macnairs_lum_reek.jpg", smoke: 8, abv: "55.4%" },
  { id: 15, name: "Laphroaig 10", region: "Islay", scent: "Medicinal smoke, iodine, seaweed", taste: "Powerful peat, vanilla, salt", short: "Not all stakeholders will be aligned — but those who are will love it.", long: "A highly characterful Islay malt known for its medicinal peat and maritime-sweet balance. Bold and distinctive.", image: "/images/laphroaig_10.jpg", smoke: 10, abv: "40%" },
  { id: 16, name: "Laphroaig 10 Cask Strength 2023", region: "Islay / Cask Strength", scent: "Brutal peat, warm spices, concentrated smoke", taste: "Explosive peat, pepper, deep sweetness", short: "Nuclear-grade peat. A whisky that defines the roadmap.", long: "A powerful cask-strength release offering maximal peat intensity and depth. Robust, uncompromising and complex.", image: "/images/laphroaig_10_cs_2023.jpg", smoke: 11, abv: "58.3%" }
];


// -------------------------
// README (quick deploy)
// -------------------------

/*
1) Create a Vite React project:
   npm create vite@latest whisky-app --template react
   cd whisky-app
   Replace src/App.jsx with this file.
   Create src/data.js and paste the `whiskyData` export above.
   Create public/images/ and add your image files using the filenames shown in the data array.

2) Install and run locally:
   npm install
   npm run dev

3) Build and deploy to Vercel:
   - Create a GitHub repo and push your project.
   - In Vercel, click "New Project" -> Import Git Repository -> select the repo.
   - Vercel will auto-build and provide a URL (set a custom domain if desired).

4) Generate a QR code for the Vercel URL (many free QR generators exist). Print or share digitally.

Optional enhancements I can add for you (tell me which and I'll implement right here):
- Tailwind + responsive tweaks (mobile-first, a11y improvements)
- Advanced filters: region, ABV range, smoke slider, sort options
- Favorites view + top-3 picker UI
- Export favourites to CSV/PDF and printable tasting cards
- Live scoring and collaborative ranking (Google Sheets / Forms integration)
- Admin panel for re-ordering and editing data in-app
*/
