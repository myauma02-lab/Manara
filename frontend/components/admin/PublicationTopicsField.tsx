"use client";

import { PUBLICATION_TOPICS } from "@/lib/publication-explorer";

export default function PublicationTopicsField({
  value,
  onChange,
  disabled = false,
}: {
  value: string[];
  onChange: (topics: string[]) => void;
  disabled?: boolean;
}) {
  const toggle = (topic: string) => {
    onChange(value.includes(topic)
      ? value.filter(item => item !== topic)
      : [...value, topic]);
  };

  return (
    <fieldset disabled={disabled} style={{ minWidth: 0, margin: 0, padding: 0, border: 0 }}>
      <legend style={{ display: "block", marginBottom: "7px", color: "#3A5560", fontSize: "13px", fontWeight: 600 }}>
        Topik publikasi
      </legend>
      <p style={{ margin: "0 0 10px", color: "#647780", fontSize: "12px", lineHeight: 1.5 }}>
        Pilih satu atau lebih topik. Pilihan ini menjadi filter di halaman Publikasi.
      </p>
      <div style={{ display: "grid", gap: "8px" }}>
        {PUBLICATION_TOPICS.map(topic => {
          const checked = value.includes(topic);
          return (
            <label key={topic} style={{
              display: "flex", alignItems: "flex-start", gap: "9px", padding: "9px 10px",
              border: `1px solid ${checked ? "#3D7C97" : "#D5DDE1"}`, borderRadius: "4px",
              background: checked ? "#E3EEF3" : "#fff", color: "#1B2A33", cursor: disabled ? "not-allowed" : "pointer",
              fontSize: "13px", lineHeight: 1.4,
            }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(topic)}
                style={{ width: "16px", height: "16px", margin: "1px 0 0", accentColor: "#2F6A83", flex: "0 0 auto" }}
              />
              <span>{topic}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
