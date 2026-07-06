"use client";
import { useEffect, useState } from "react";
import ServicePage from "./ServicePage";
import type { ServicePageData } from "./ServicePage";
import { settingsApi } from "@/lib/api";

interface Props {
  defaultData: ServicePageData;
}

export default function ServicePageWrapper({ defaultData }: Props) {
  const [data, setData] = useState<ServicePageData>(defaultData);

  useEffect(() => {
    settingsApi.get()
      .then(r => {
        const settings = r.data.data || {};
        const key = `service_${defaultData.slug}`;
        if (settings[key]) {
          try {
            const parsed = JSON.parse(settings[key]);
            setData(prev => ({ ...prev, ...parsed }));
          } catch { }
        }
      })
      .catch(() => {}); // Fallback ke defaultData kalau gagal
  }, [defaultData.slug]);

  return <ServicePage data={data} />;
}