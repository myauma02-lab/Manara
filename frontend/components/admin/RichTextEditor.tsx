"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Mulai menulis konten artikel di sini...",
  minHeight = "400px",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    // Dinamis import Quill supaya tidak crash di server
    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default;

      // Import CSS Quill
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
      document.head.appendChild(link);

      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
      ];

      quillRef.current = new Quill(editorRef.current!, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: toolbarOptions,
        },
      });

      // Set nilai awal
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen perubahan
      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html === "<p><br></p>" ? "" : html);
      });

      setMounted(true);
    });

    return () => {
      quillRef.current = null;
    };
  }, []);

  // Sync value dari luar (saat edit artikel yang sudah ada)
  useEffect(() => {
    if (!quillRef.current || !mounted) return;
    const currentContent = quillRef.current.root.innerHTML;
    if (value !== currentContent && value !== undefined) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value, mounted]);

  return (
    <div style={{ border: "1px solid rgba(38,108,135,0.15)", borderRadius: "2px", overflow: "hidden" }}>
      {/* Toolbar akan di-inject Quill di sini */}
      <div ref={editorRef} style={{ minHeight, fontSize: "16px", fontFamily: "Georgia, serif", lineHeight: "1.8", color: "#1C3038" }} />

      {/* Custom styling untuk toolbar dan editor */}
      <style>{`
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(38,108,135,0.1) !important;
          background: rgba(38,108,135,0.02) !important;
          padding: 10px 14px !important;
          font-family: inherit !important;
        }
        .ql-toolbar .ql-formats {
          margin-right: 12px !important;
        }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #266c87 !important;
        }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: #266c87 !important;
        }
        .ql-toolbar .ql-picker-label:hover,
        .ql-toolbar .ql-picker-label.ql-active {
          color: #266c87 !important;
        }
        .ql-container {
          border: none !important;
          font-family: Georgia, serif !important;
          font-size: 16px !important;
        }
        .ql-editor {
          padding: 24px !important;
          line-height: 1.85 !important;
          color: #1C3038 !important;
          min-height: ${minHeight} !important;
        }
        .ql-editor p { margin-bottom: 1em; }
        .ql-editor h1 {
          font-size: 2em; font-weight: 300;
          color: #0F2830; margin: 1.5em 0 0.5em;
          font-family: Georgia, serif;
        }
        .ql-editor h2 {
          font-size: 1.5em; font-weight: 400;
          color: #0F2830; margin: 1.4em 0 0.4em;
          font-family: Georgia, serif;
        }
        .ql-editor h3 {
          font-size: 1.2em; font-weight: 500;
          color: #1C3038; margin: 1.3em 0 0.4em;
        }
        .ql-editor blockquote {
          border-left: 3px solid #266c87 !important;
          padding: 4px 20px !important;
          margin: 1.5em 0 !important;
          color: #3A5560 !important;
          font-style: italic !important;
          background: rgba(38,108,135,0.03) !important;
        }
        .ql-editor code, .ql-editor pre {
          background: rgba(38,108,135,0.05) !important;
          border-radius: 2px !important;
          font-family: monospace !important;
          font-size: 0.9em !important;
          color: #266c87 !important;
        }
        .ql-editor pre {
          padding: 16px !important;
          margin: 1em 0 !important;
        }
        .ql-editor a { color: #266c87 !important; }
        .ql-editor img {
          max-width: 100% !important;
          border-radius: 4px !important;
          margin: 1em 0 !important;
        }
        .ql-editor.ql-blank::before {
          color: #B8CDD2 !important;
          font-style: italic !important;
          font-family: Georgia, serif !important;
        }
      `}</style>
    </div>
  );
}