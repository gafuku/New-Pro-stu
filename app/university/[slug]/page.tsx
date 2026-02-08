"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import FiltersBar from "@/components/FiltersBar";
import { Post, University } from "@/lib/types";
import { db, collection, onSnapshot, orderBy, query, where } from "@/lib/firebase";
import { useUniversities } from "@/lib/useUniversities";
import { setSelectedSchool } from "@/components/Header";

export default function UniversityPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { universities } = useUniversities();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState({
    topic: "",
    resourceType: "",
    college: "",
    campus: "",
    gradeLevel: "",
    tags: "",
  });

  const university: University | undefined = useMemo(
    () => universities.find((s) => (s.slug || s.id) === slug),
    [universities, slug]
  );

  useEffect(() => {
    if (slug) {
      setSelectedSchool(slug);
    }
    const q = query(
      collection(db, "posts"),
      where("status", "==", "approved"),
      where("universitySlug", "==", slug),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const next: Post[] = [];
      snap.forEach((doc) => {
        next.push({ id: doc.id, ...(doc.data() as any) });
      });
      setPosts(next);
    });
    return () => unsub();
  }, [slug]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const tagSet = filterState.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    return posts.filter((p) => {
      if (filterState.topic && p.topic !== filterState.topic) return false;
      if (filterState.resourceType && p.resourceType !== filterState.resourceType) return false;
      if (filterState.college && p.college !== filterState.college) return false;
      if (filterState.campus && p.campus !== filterState.campus) return false;
      if (filterState.gradeLevel && p.gradeLevel !== filterState.gradeLevel) return false;
      if (tagSet.length) {
        const pTags = (p.tags || []).map((t) => t.toLowerCase());
        const matches = tagSet.every((t) => pTags.includes(t));
        if (!matches) return false;
      }
      if (term) {
        const hay = `${p.title} ${p.body}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [posts, filterState, search]);

  const handleFilterChange = (next: Record<string, string>) => {
    setFilterState((prev) => ({ ...prev, ...next }));
  };

  return (
    <>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>{university?.name || "University"} Community</h2>
        <p style={{ color: "#6c6a67" }}>{university?.info || "Questions, answers, and resources."}</p>
        {university?.websiteUrl && (
          <a className="button secondary" href={university.websiteUrl} target="_blank" rel="noreferrer">
            Visit University Website
          </a>
        )}
      </div>

      <FiltersBar
        filters={filterState}
        setFilters={handleFilterChange}
        search={search}
        setSearch={setSearch}
        colleges={university?.colleges || []}
      />

      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Questions & Resources</h2>
          <a className="button" href="/ask">
            Ask / Share
          </a>
        </div>
        <p style={{ color: "#6c6a67" }}>{filtered.length} results</p>
        <div className="grid">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
