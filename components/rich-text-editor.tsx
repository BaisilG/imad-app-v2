'use client';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { useEffect, useMemo, useState } from 'react';

const lowlight = createLowlight(common);

interface Props {
  initialContent: any;
  onChange: (value: any, text: string, html: string) => void;
}

export function RichTextEditor({ initialContent, onChange }: Props) {
  const [preview, setPreview] = useState(false);

  const extensions = useMemo(
    () => [StarterKit, Underline, Image, CodeBlockLowlight.configure({ lowlight })],
    []
  );

  const editor = useEditor({
    extensions,
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 focus:outline-none'
      }
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON(), editor.getText(), editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  const ToolbarButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="rounded border px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <ToolbarButton label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolbarButton label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolbarButton label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolbarButton label="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
        <ToolbarButton label="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton label="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
        <ToolbarButton label="Bullet" onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolbarButton label="Numbered" onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolbarButton label="Code" onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <ToolbarButton
          label="Image"
          onClick={() => {
            const url = window.prompt('Image URL');
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        />
        <ToolbarButton label={preview ? 'Edit Mode' : 'Preview Mode'} onClick={() => setPreview(!preview)} />
      </div>
      {preview ? (
        <article
          className="prose max-w-none rounded-lg border p-4 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
