"use client";

import { University } from "@/lib/types";

function normalize(value: number, min: number, max: number) {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

export default function SchoolMap({ schools }: { schools: University[] }) {
  const points = schools.filter((s) => typeof s.latitude === "number" && typeof s.longitude === "number");

  const lats = points.map((p) => p.latitude as number);
  const lons = points.map((p) => p.longitude as number);
  const minLat = Math.min(...lats, 0);
  const maxLat = Math.max(...lats, 1);
  const minLon = Math.min(...lons, 0);
  const maxLon = Math.max(...lons, 1);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Campus Map</h3>
      <svg viewBox="0 0 300 380" style={{ width: "100%", height: 380 }}>
        <rect x="0" y="0" width="300" height="380" fill="#f6f2ec" rx="18" />
        <text x="18" y="28" fill="#6c6a67" fontSize="12">
          Approximate locations
        </text>
        {points.map((s) => {
          const x = 40 + normalize((s.longitude as number), minLon, maxLon) * 220;
          const y = 40 + (1 - normalize((s.latitude as number), minLat, maxLat)) * 300;
          return (
            <g key={s.id}>
              <circle cx={x} cy={y} r={7} fill="#0b4f6c" />
              <text x={x + 10} y={y + 4} fontSize="11" fill="#1c1b1a">
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>
      <p style={{ color: "#6c6a67", fontSize: 13 }}>
        Tip: select a university below to enter its community.
      </p>
    </div>
  );
}
