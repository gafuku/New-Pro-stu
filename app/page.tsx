"use client";

import { useEffect, useMemo, useState } from "react";
import PostCard from "@/components/PostCard";
import FiltersBar from "../components/FiltersBar";
import { Post } from "@/lib/types";
import { db, collection, onSnapshot, orderBy, query, where } from "@/lib/firebase";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterState, setFilterState] = useState({
    topic: "",
    resourceType: "",
    school: "",
    campus: "",
    gradeLevel: "",
    tags: "",
  });
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "approved"),
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
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    const tagSet = filterState.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    return posts.filter((p) => {
      if (filterState.topic && p.topic !== filterState.topic) return false;
      if (filterState.resourceType && p.resourceType !== filterState.resourceType) return false;
      if (filterState.school && p.school !== filterState.school) return false;
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
      <FiltersBar
        filters={filterState}
        setFilters={handleFilterChange}
        search={search}
        setSearch={setSearch}
      />
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Approved Questions & Resources</h2>
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
