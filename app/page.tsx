"use client";

import { useRouter } from "next/navigation";
import { useUniversities } from "@/lib/useUniversities";
import UniversityMap from "@/components/SchoolMap";
import { setSelectedSchool } from "@/components/Header";

export default function LandingPage() {
  const router = useRouter();
  const { universities } = useUniversities();

  return (
    <>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Our Mission</h2>
        <p>
          We connect high school students with real insights from university students. Ask questions, share
          resources, and learn how to join clubs, programs, and communities across top universities.
        </p>
      </div>

      <div className="grid">
        <UniversityMap schools={universities} />

        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Select Your University</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {universities.map((uni) => (
              <button
                key={uni.id}
                className="button secondary"
                onClick={() => {
                  const slug = uni.slug || uni.id;
                  setSelectedSchool(slug);
                  router.push(`/university/${slug}`);
                }}
              >
                {uni.name}
                {uni.locationLabel ? ` · ${uni.locationLabel}` : ""}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 12, color: "#6c6a67" }}>
            Each university has its own Q&A feed and resources.
          </p>
        </div>
      </div>
    </>
  );
}
