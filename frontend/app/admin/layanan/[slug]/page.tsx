"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { settingsApi } from "@/lib/api";
import Link from "next/link";

// Import data default sebagai fallback
import {
  RESEARCH_DATA, POLICY_BRIEF_DATA, TRAINING_DATA,
  CONSULTING_DATA, EVENT_DATA, MEDIA_SERVICE_DATA,
} from "@/lib/services-data";
import type { ServicePageData, ServiceFeature, ServiceStep, ServiceDeliverable, ServiceFAQ } from "@/components/shared/ServicePage";

const DATA_MAP: Record<string, ServicePageData> = {
  research: RESEARCH_DATA,
  "policy-brief": POLICY_BRIEF_DATA,
  training: TRAINING_DATA,
  consulting: CONSULTING_DATA,
  event: EVENT_DATA,
  media: MEDIA_SERVICE_DATA,
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  overview: "Overview",
  features: "What We Do",
  process: "Proses",
  deliverables: "Deliverables",
  clients: "Target Klien",
  why: "Mengapa Manara",
  faq: "FAQ",
  cta: "Contact CTA",
};

type ActiveSection = keyof typeof SECTION_LABELS;

export default function EditLayananPage() {
  const { slug } = useParams();
  const router = useRouter();
  const slugStr = String(slug);
  const defaultData = DATA_MAP[slugStr];

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const [data, setData] = useState<ServicePageData>(defaultData);

  // Load saved data dari settings
  useEffect(() => {
    if (!defaultData) { setLoading(false); return; }
    settingsApi.get()
      .then(r => {
        const settings = r.data.data || {};
        const key = `service_${slugStr}`;
        if (settings[key]) {
          try {
            const parsed = JSON.parse(settings[key]);
            setData(prev => ({ ...prev, ...parsed }));
          } catch { }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slugStr]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(`service_${slugStr}`, JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const updateData = (field: keyof ServicePageData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px",
    border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px",
    fontSize: "14px", outline: "none", color: "#1C3038",
    fontFamily: "inherit", background: "#fff", boxSizing: