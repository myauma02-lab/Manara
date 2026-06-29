'use client';
// components/admin/QuillEditor.tsx
import { useEffect, useRef } from 'react';

interface Props { value: string; onChange: (val: string) => void; }

export default function QuillEditor({ value, onChange }: Props) {
  const editorRef = useRef<any>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || quillRef.current) return;

    const loadQuill = async () => {
      const { default: Quill } = await import('quill');
      // @ts-ignore
      await import('quill/dist/quill.snow.css');

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Mulai menulis konten artikel...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      });

      quillRef.current.on('text-change', () => {
        onChange(quillRef.current.root.innerHTML);
      });

      if (value) quillRef.current.root.innerHTML = value;
    };

    loadQuill();
  }, []);

  return (
    <div style={{ minHeight: 400 }}>
      <div ref={editorRef} style={{ minHeight: 350, fontFamily: 'DM Sans, sans-serif', fontSize: '16px' }} />
    </div>
  );
}
