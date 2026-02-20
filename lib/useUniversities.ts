"use client";

import { useCallback, useEffect, useState } from "react";
import { University } from "@/lib/types";
import { apiGet } from "@/lib/api";

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiGet<University[]>("/api/universities");
      setUniversities((data || []).map((u) => ({ ...u, id: u.id })));
    } catch {
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!mounted) return;
      await refresh();
    };
    load();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  return { universities, loading, refresh };
}
