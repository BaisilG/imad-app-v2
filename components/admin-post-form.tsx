'use client';

import { useState } from 'react';
import { RichTextEditor } from './rich-text-editor';
import { generateSlug } from '@/lib/utils';

interface AdminPostFormProps {
  initial?: any;
  postId?: string;
}

export function AdminPostForm({ initial, postId }: AdminPostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage ?? '');
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(initial?.status ?? 'DRAFT');
  const [content, setContent] = useState(initial?.content ?? { type: 'doc', content: [] });
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml ?? '');
  const [loading, setLoading] = useState(false);

  async function onUpload(file: File) {
    const body = new FormData();
    body.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body });
    const data = await response.json();
    setFeaturedImage(data.url);
  }

  async function onAiGenerate() {
    setLoading(true);
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const data = await response.json();
    if (data.content) {
      setExcerpt(data.excerpt ?? '');
      setContent(data.content);
      setContentHtml(data.html ?? '');
    }
    setLoading(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      slug,
      excerpt,
      featuredImage,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status,
      content,
      contentHtml
    };

    const url = postId ? `/api/posts/${postId}` : '/api/posts';
    const method = postId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      window.location.href = '/admin';
      return;
    }

    setLoading(false);
    alert('Failed to save post');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!postId) setSlug(generateSlug(e.target.value));
          }}
          placeholder="Catchy headline"
          className="rounded border p-3"
          required
        />
        <input value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} placeholder="slug" className="rounded border p-3" required />
      </div>

      <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full rounded border p-3" placeholder="Short preview text" rows={3} required />

      <div className="grid gap-4 md:grid-cols-2">
        <input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="Featured image URL" className="rounded border p-3" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          className="rounded border p-3"
        />
      </div>

      <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full rounded border p-3" placeholder="Tags comma-separated" />

      <div className="flex items-center gap-4">
        <label className="text-sm">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')} className="rounded border p-2">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <button type="button" onClick={onAiGenerate} className="rounded bg-violet-600 px-3 py-2 text-sm text-white">
          Generate content with AI
        </button>
      </div>

      <RichTextEditor
        initialContent={content}
        onChange={(json, text, html) => {
          setContent(json);
          if (!excerpt) setExcerpt(text.slice(0, 150));
          setContentHtml(html);
        }}
      />

      <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
        {loading ? 'Saving...' : 'Save Post'}
      </button>
    </form>
  );
}
