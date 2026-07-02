"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi
      .get()
      .then((res) => {
        setSettings(res.data.data || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}