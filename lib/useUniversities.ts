"use client";

import { useEffect, useState } from "react";
import { collection, db, onSnapshot, orderBy, query } from "@/lib/firebase";
import { University } from "@/lib/types";

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "universities"), orderBy("name", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: University[] = [];
        snap.forEach((doc) => next.push({ id: doc.id, ...(doc.data() as any) }));
        setUniversities(next);
        setLoading(false);
      },
      () => {
        setUniversities([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { universities, loading };
}
