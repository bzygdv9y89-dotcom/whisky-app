import React from "react";
import { whiskyData } from "./data.js";

function WhiskyCard({ w }) {
  return (
    <div style={{ padding: 12, border: "1px solid #e6e6e6", borderRadius: 8 }}>
      <div style={{ fontWeight: 700 }}>{w.name}</div>
      <div style={{ fontSize: 12, color: "#555" }}>{w.region} • ABV {w.abv}</div>
      <div style={{ marginTop: 8, fontSize: 13 }}>{w.short}</div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>Whisky App</h1>
      <div style={{ display: "grid", gap: 12 }}>
        {whiskyData.map((w) => (
          <WhiskyCard key={w.id} w={w} />
        ))}
      </div>
    </div>
  );
}
