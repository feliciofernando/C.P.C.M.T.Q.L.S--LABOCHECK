'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  ImageIcon,
  Undo2,
  Redo2,
  RemoveFormatting,
  Palette,
  Highlighter,
  ChevronDown,
  Type,
} from 'lucide-react'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*  Interface                                                                  */
/* -------------------------------------------------------------------------- */

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
  maxHeight?: string
}

/* -------------------------------------------------------------------------- */
/*  Toolbar Button                                                             */
/* -------------------------------------------------------------------------- */

function ToolbarButton({
  active,
  onClick,
  title,
  children,
  disabled,
}: {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'h-7 w-7 flex items-center justify-center rounded text-sm transition-colors shrink-0',
        active
          ? 'bg-[#1a5c2e]/10 text-[#1a5c2e]'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Toolbar Separator                                                          */
/* -------------------------------------------------------------------------- */

function ToolbarSeparator() {
  return <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />
}

/* -------------------------------------------------------------------------- */
/*  Color Picker                                                               */
/* -------------------------------------------------------------------------- */

const TEXT_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Gray', value: '#6b7280' },
]

const HIGHLIGHT_COLORS = [
  { name: 'None', value: '' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Pink', value: '#fecdd3' },
  { name: 'Orange', value: '#fed7aa' },
]

function ColorPickerButton({
  icon: Icon,
  title,
  colors,
  currentColor,
  onPick,
}: {
  icon: React.ElementType
  title: string
  colors: { name: string; value: string }[]
  currentColor: string
  onPick: (color: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative shrink-0" ref={ref}>
      <ToolbarButton
        active={!!currentColor}
        onClick={() => setOpen((o) => !o)}
        title={title}
      >
        <Icon className="h-4 w-4" />
      </ToolbarButton>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[160px]">
          <div className="grid grid-cols-4 gap-1">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                onClick={() => {
                  onPick(c.value)
                  setOpen(false)
                }}
                className={cn(
                  'h-6 w-6 rounded-md border transition-all hover:scale-110',
                  !c.value && 'border-gray-300',
                  c.value && 'border-gray-200',
                  currentColor === c.value && 'ring-2 ring-[#1a5c2e] ring-offset-1',
                )}
                style={
                  c.value
                    ? { backgroundColor: c.value }
                    : {
                        background:
                          'repeating-conic-gradient(#d1d5db 0% 25%, white 0% 50%) 50% / 8px 8px',
                      }
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Heading Selector                                                           */
/* -------------------------------------------------------------------------- */

const HEADING_OPTIONS = [
  { label: 'Paragraph', value: 0 },
  { label: 'Heading 1', value: 1 },
  { label: 'Heading 2', value: 2 },
  { label: 'Heading 3', value: 3 },
]

function HeadingSelector({
  currentLevel,
  onPick,
}: {
  currentLevel: number
  onPick: (level: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentLabel =
    HEADING_OPTIONS.find((o) => o.value === currentLevel)?.label ?? 'Paragraph'

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'h-7 px-2 flex items-center gap-1 rounded text-sm transition-colors',
          currentLevel > 0
            ? 'bg-[#1a5c2e]/10 text-[#1a5c2e]'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )}
      >
        <Type className="h-3.5 w-3.5" />
        <span className="text-xs font-medium max-w-[80px] truncate">
          {currentLabel}
        </span>
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
          {HEADING_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onPick(o.value)
                setOpen(false)
              }}
              className={cn(
                'w-full text-left px-3 py-1.5 text-sm transition-colors',
                currentLevel === o.value
                  ? 'bg-[#1a5c2e]/10 text-[#1a5c2e] font-medium'
                  : 'text-gray-700 hover:bg-gray-100',
                o.value === 1 && 'font-bold',
                o.value === 2 && 'font-semibold',
                o.value === 3 && 'font-medium',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Rich Text Editor                                                      */
/* -------------------------------------------------------------------------- */

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Comece a escrever...',
  minHeight = '200px',
  maxHeight,
}: RichTextEditorProps) {
  const isExternalUpdate = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor: ed }) => {
      if (!isExternalUpdate.current) {
        onChange(ed.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'prose-mirror-content focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  /* Sync external content changes */
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const currentHTML = editor.getHTML()
    // Only update if content actually differs to avoid cursor reset
    if (content !== currentHTML) {
      isExternalUpdate.current = true
      editor.commands.setContent(content || '<p></p>')
      isExternalUpdate.current = false
    }
  }, [content, editor])

  /* Clear formatting */
  const handleClearFormatting = useCallback(() => {
    if (!editor) return
    editor.chain().focus()
      .unsetAllMarks()
      .setParagraph()
      .run()
  }, [editor])

  /* Set link */
  const handleSetLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL:', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  /* Set image */
  const handleSetImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL:', 'https://')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  /* Undo / Redo */
  const handleUndo = useCallback(() => {
    editor?.chain().focus().undo().run()
  }, [editor])

  const handleRedo = useCallback(() => {
    editor?.chain().focus().redo().run()
  }, [editor])

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg animate-pulse" style={{ minHeight }}>
        <div className="h-16 bg-gray-100 rounded-t-lg" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    )
  }

  const currentHeadingLevel = (() => {
    for (const level of [1, 2, 3] as const) {
      if (editor.isActive('heading', { level })) return level
    }
    return 0
  })()

  const currentTextColor = (editor.getAttributes('textStyle').color as string) || ''
  const currentHighlight = (editor.getAttributes('highlight').color as string) || ''

  return (
    <div className="border border-[#d1d1cc] rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-[#d1d1cc]">
        {/* Row 1 — Text Formatting */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 overflow-x-auto">
          {/* Bold / Italic / Underline / Strikethrough */}
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Text Color */}
          <ColorPickerButton
            icon={Palette}
            title="Text Color"
            colors={TEXT_COLORS}
            currentColor={currentColor}
            onPick={(color) => {
              if (!color) {
                editor.chain().focus().unsetColor().run()
              } else {
                editor.chain().focus().setColor(color).run()
              }
            }}
          />

          {/* Highlight Color */}
          <ColorPickerButton
            icon={Highlighter}
            title="Highlight Color"
            colors={HIGHLIGHT_COLORS}
            currentColor={currentHighlight}
            onPick={(color) => {
              if (!color) {
                editor.chain().focus().unsetHighlight().run()
              } else {
                editor.chain().focus().toggleHighlight({ color }).run()
              }
            }}
          />

          <ToolbarSeparator />

          {/* Heading Selector */}
          <HeadingSelector
            currentLevel={currentHeadingLevel}
            onPick={(level) => {
              if (level === 0) {
                editor.chain().focus().setParagraph().run()
              } else {
                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
              }
            }}
          />

          <ToolbarSeparator />

          {/* Alignment */}
          <ToolbarButton
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'justify' })}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Row 2 — Structure & Insert */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-t border-gray-200/60 overflow-x-auto">
          {/* Lists */}
          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Link */}
          <ToolbarButton
            active={editor.isActive('link')}
            onClick={handleSetLink}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={false}
            onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
            title="Remove Link"
            disabled={!editor.isActive('link')}
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>

          {/* Image */}
          <ToolbarButton
            active={false}
            onClick={handleSetImage}
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Undo / Redo */}
          <ToolbarButton
            active={false}
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
            disabled={!editor.can().undo()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={false}
            onClick={handleRedo}
            title="Redo (Ctrl+Shift+Z)"
            disabled={!editor.can().redo()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Clear formatting */}
          <ToolbarButton
            active={false}
            onClick={handleClearFormatting}
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Area */}
      <div
        className="bg-white rounded-b-lg"
        style={{
          minHeight,
          maxHeight,
          overflowY: maxHeight ? 'auto' : undefined,
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* ProseMirror styles */}
      <style jsx global>{`
        /* Editor content base */
        .ProseMirror {
          font-size: 14px;
          line-height: 1.7;
          padding: 0.75rem 1rem;
          outline: none;
          min-height: 100%;
        }

        /* Paragraphs */
        .ProseMirror p {
          margin-bottom: 0.5em;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        /* Headings */
        .ProseMirror h1 {
          font-size: 1.5em;
          font-weight: 700;
          margin-bottom: 0.5em;
          margin-top: 0.8em;
          line-height: 1.3;
          color: #1a1a1a;
        }
        .ProseMirror h2 {
          font-size: 1.25em;
          font-weight: 600;
          margin-bottom: 0.5em;
          margin-top: 0.6em;
          line-height: 1.35;
          color: #1a1a1a;
        }
        .ProseMirror h3 {
          font-size: 1.1em;
          font-weight: 600;
          margin-bottom: 0.4em;
          margin-top: 0.5em;
          line-height: 1.4;
          color: #1a1a1a;
        }

        /* Lists */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin-bottom: 0.5em;
        }
        .ProseMirror li {
          margin-bottom: 0.15em;
        }
        .ProseMirror li p {
          margin-bottom: 0.15em;
        }

        /* Links */
        .ProseMirror a {
          color: #1a5c2e;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }
        .ProseMirror a:hover {
          color: #145224;
        }

        /* Blockquote */
        .ProseMirror blockquote {
          border-left: 3px solid #1a5c2e;
          padding-left: 1em;
          margin: 0.8em 0;
          margin-left: 0;
          font-style: italic;
          color: #6b6b6b;
        }

        /* Images */
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          display: block;
          margin: 0.5em auto;
        }

        /* Horizontal Rule */
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #d1d1cc;
          margin: 1em 0;
        }

        /* Code */
        .ProseMirror code {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.1em 0.3em;
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
          font-size: 0.9em;
          color: #1a1a1a;
        }
        .ProseMirror pre {
          background-color: #f3f4f6;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
          font-size: 0.875em;
          overflow-x: auto;
          margin: 0.8em 0;
        }
        .ProseMirror pre code {
          background: none;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }

        /* Mark / Highlight */
        .ProseMirror mark {
          border-radius: 0.15em;
          padding: 0.05em 0.1em;
        }

        /* Selection */
        .ProseMirror ::selection {
          background-color: #1a5c2e30;
        }

        /* Task list (if used) */
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        /* Scrollbar for editor area */
        .ProseMirror:empty {
          min-height: 2em;
        }
      `}</style>
    </div>
  )
}
