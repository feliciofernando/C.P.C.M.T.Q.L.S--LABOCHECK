"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useCallback, useEffect } from "react";

interface RichTextEditorProps {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
}

export default function RichTextEditor({ onChange, value, placeholder }: RichTextEditorProps) {
  const currentTextColor = "#000000";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-500 underline cursor-pointer" },
      }),
      Placeholder.configure({ placeholder: placeholder || "Comece a escrever..." }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg focus:outline-none max-w-none min-h-[200px] p-4",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="border rounded-md p-4 bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  const btnClass = (active: boolean) =>
    `p-1.5 rounded text-sm hover:bg-gray-200 transition-colors ${active ? "bg-gray-300" : ""}`;

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btnClass(editor.isActive("bold"))} font-bold`} title="Negrito">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btnClass(editor.isActive("italic"))} italic`} title="Itálico">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${btnClass(editor.isActive("underline"))} underline`} title="Sublinhado">U</button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`${btnClass(editor.isActive("strike"))} line-through`} title="Riscado">S</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btnClass(editor.isActive("heading", { level: 1 }))} font-bold text-xs`} title="H1">H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btnClass(editor.isActive("heading", { level: 2 }))} font-bold text-xs`} title="H2">H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btnClass(editor.isActive("heading", { level: 3 }))} font-bold text-xs`} title="H3">H3</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btnClass(editor.isActive({ textAlign: "left" }))} title="Esquerda">◀</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btnClass(editor.isActive({ textAlign: "center" }))} title="Centrar">◼</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btnClass(editor.isActive({ textAlign: "right" }))} title="Direita">▶</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="Lista">•</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="Numerada">1.</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))} title="Citação">❝</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive("codeBlock"))} title="Código">{"</>"}</button>
        <button type="button" onClick={setLink} className={btnClass(editor.isActive("link"))} title="Link">🔗</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={btnClass(editor.isActive("highlight"))} title="Destacar">🖍</button>
        <button type="button" onClick={() => editor.chain().focus().setColor(currentTextColor).run()} className={btnClass(false)} title="Cor">🎨</button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="Linha">―</button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Desfazer">↩</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Refazer">↪</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
