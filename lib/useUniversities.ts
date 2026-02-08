"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { University } from "@/lib/types";

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      setUniversities([]);
    } else {
      setUniversities((data || []).map((u) => ({ ...u, id: u.id })));
    }
    setLoading(false);
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
