import React, { useCallback, useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

const COLORS = ["#000000", "#1e293b", "#475569", "#dc2626", "#ea580c", "#d97706", "#16a34a", "#0891b2", "#2563eb", "#7c3aed", "#db2777", "#9ca3af"];

const BTN = "px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors";
const ACTIVE = "bg-blue-50 text-blue-600";

function TB({ onClick, isActive, children, title }) {
  return (
    <button type="button" onClick={onClick} title={title} className={`${BTN} ${isActive ? ACTIVE : "text-gray-600"}`}>
      {children}
    </button>
  );
}

function ColorPicker({ editor, type = "color" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const apply = (c) => {
    if (type === "color") editor.chain().focus().setColor(c).run();
    else editor.chain().focus().toggleHighlight({ color: c }).run();
    setOpen(false);
  };
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} className={`${BTN} text-gray-600`} title={type === "color" ? "Text color" : "Highlight"}>
        {type === "color" ? <span className="font-bold">A</span> : <span className="px-1 bg-yellow-200">H</span>}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-[160px]">
          <div className="grid grid-cols-6 gap-1">
            {COLORS.map((c) => (
              <button key={c} type="button" onClick={() => apply(c)} className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform" style={{ background: c }} title={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Toolbar({ editor, onImageUpload }) {
  if (!editor) return null;
  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
      <TB onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="H1">H1</TB>
      <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="H2">H2</TB>
      <TB onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="H3">H3</TB>
      <span className="w-px h-6 bg-gray-200 mx-1" />
      <TB onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold"><strong>B</strong></TB>
      <TB onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic"><em>I</em></TB>
      <TB onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} title="Underline"><span className="underline">U</span></TB>
      <TB onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strike"><s>S</s></TB>
      <ColorPicker editor={editor} type="color" />
      <ColorPicker editor={editor} type="highlight" />
      <span className="w-px h-6 bg-gray-200 mx-1" />
      <TB onClick={() => editor.chain().focus().setTextAlign("left").run()} isActive={editor.isActive({ textAlign: "left" })} title="Left">⯇</TB>
      <TB onClick={() => editor.chain().focus().setTextAlign("center").run()} isActive={editor.isActive({ textAlign: "center" })} title="Center">≡</TB>
      <TB onClick={() => editor.chain().focus().setTextAlign("right").run()} isActive={editor.isActive({ textAlign: "right" })} title="Right">⯈</TB>
      <span className="w-px h-6 bg-gray-200 mx-1" />
      <TB onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Bullets">•</TB>
      <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Numbered">1.</TB>
      <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote">❝</TB>
      <TB onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} title="Code">{"</>"}</TB>
      <span className="w-px h-6 bg-gray-200 mx-1" />
      <TB onClick={addLink} isActive={editor.isActive("link")} title="Link">🔗</TB>
      <TB onClick={onImageUpload} title="Image">🖼</TB>
      <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">―</TB>
      <div className="ml-auto flex items-center gap-0.5">
        <TB onClick={() => editor.chain().focus().undo().run()} title="Undo">↶</TB>
        <TB onClick={() => editor.chain().focus().redo().run()} title="Redo">↷</TB>
      </div>
    </div>
  );
}

export default function RichTextEditor({ content, onChange, onImageUpload }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full h-auto" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline" } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content || "<p></p>",
    editorProps: { attributes: { class: "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[400px] px-4 py-3" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file || !onImageUpload) return;
      const url = await onImageUpload(file);
      if (url && editor) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    };
    input.click();
  }, [editor, onImageUpload]);

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden max-h-[75vh] overflow-y-auto relative">
      <Toolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
}
