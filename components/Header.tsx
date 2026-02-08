"use client";

import { useEffect, useMemo, useState } from "react";
import { useUniversities } from "@/lib/useUniversities";
import { University } from "@/lib/types";

const STORAGE_KEY = "selected_university_slug";

function loadSaved(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) || "";
}

function saveSelected(value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, value);
}

export default function Header() {
  const { universities } = useUniversities();
  const [selectedSlug, setSelectedSlug] = useState("");

  useEffect(() => {
    const saved = loadSaved();
    if (saved) setSelectedSlug(saved);
  }, []);

  useEffect(() => {
    if (!selectedSlug && universities.length) {
      setSelectedSlug(universities[0].slug || "");
    }
  }, [universities, selectedSlug]);

  const uni: University | undefined = useMemo(
    () => universities.find((s) => (s.slug || "") === selectedSlug),
    [universities, selectedSlug]
  );

  const headerTitle = uni?.headerTitle || "College Q&A Hub";
  const subtitle = uni?.info || "Ask, answer, and share resources";

  return (
    <header className="header">
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {uni?.logoUrl ? (
          <img src={uni.logoUrl} alt={`${uni.name} logo`} style={{ height: 46 }} />
        ) : (
          <div style={{ width: 46, height: 46, borderRadius: 10, background: "#e6e1d9" }} />
        )}
        <div>
          <div className="title">{headerTitle}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <select
          className="select"
          value={selectedSlug}
          onChange={(e) => {
            setSelectedSlug(e.target.value);
            saveSelected(e.target.value);
          }}
        >
          <option value="">Select a university</option>
          {universities.map((s) => (
            <option key={s.id} value={s.slug || ""}>
              {s.name}
            </option>
          ))}
        </select>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/ask">Ask / Share</a>
          <a href="/admin">Admin</a>
        </nav>
      </div>
    </header>
  );
}

export function getSelectedSchool(): string {
  return loadSaved();
}

export function setSelectedSchool(value: string) {
  saveSelected(value);
}
