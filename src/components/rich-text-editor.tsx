"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  codeBlockPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  ListsToggle,
  BlockTypeSelect,
  CreateLink,
  InsertThematicBreak,
  UndoRedo,
  HighlightToggle,
  CodeToggle,
  InsertCodeBlock,
  Separator,
} from "@mdxeditor/editor";
import type { MDXEditorMethods } from "@mdxeditor/editor";

import "@/components/rich-text-editor.css";

interface RichTextEditorProps {
  onChange: (markdown: string) => void;
  value: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  contentEditableClassName?: string;
  height?: string;
}

export default function RichTextEditor({
  onChange,
  value,
  placeholder = "Comece a escrever...",
  readOnly = false,
  className = "",
  contentEditableClassName = "",
  height = "min-h-[250px]",
}: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      <MDXEditor
        markdown={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        contentEditableClassName={`rich-text-editor-content ${height} ${contentEditableClassName}`}
        placeholder={placeholder}
        plugins={[
          headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: "plaintext",
          }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap items-center gap-0.5 p-1.5">
                {/* Historico: Desfazer / Refazer */}
                <UndoRedo />

                <Separator />

                {/* Formatacao de texto */}
                <BoldItalicUnderlineToggles />
                <StrikeThroughSupSubToggles />
                <CodeToggle />
                <HighlightToggle />

                <Separator />

                {/* Tipo de bloco: Titulos, paragrafo, citacao */}
                <BlockTypeSelect />

                <Separator />

                {/* Listas */}
                <ListsToggle />

                <Separator />

                {/* Link e linha horizontal */}
                <CreateLink />
                <InsertThematicBreak />

                <Separator />

                {/* Bloco de codigo */}
                <InsertCodeBlock />
              </div>
            ),
          }),
        ]}
      />
    </div>
  );
}

/* Tipo auxiliar para referenciar a instancia do editor via ref */
export type { MDXEditorMethods };
