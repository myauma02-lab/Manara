"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fellowsApi } from "@/lib/api";
import FellowForm from "@/components/admin/FellowForm";

export default function EditFellowPage() {
  const { id } = useParams();
  const [fellow, setFellow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fellowsApi.all()
      .then(r => {
        const found = (r.data.data || []).find((f: any) => f.id === id);
        setFellow(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ padding: "40px", color: "#7A9AA5", fontFamily: "Georgia,serif", fontSize: "18px", fontWeight: 300 }}>
      Memuat data fellow...
    </div>
  );

  if (!fellow) return (
    <div style={{ padding: "40px" }}>
      <p style={{ fontFamily: "Georgia,serif", fontSize: "20px", color: "#7A9AA5", marginBottom: "12px" }}>
        Fellow tidak ditemukan.
      </p>
    </div>
  );

  return <FellowForm initialData={fellow} isEdit />;
}