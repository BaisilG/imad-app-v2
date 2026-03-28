'use client';

import Link from 'next/link';
import { useState } from 'react';

type AdminPost = {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  updatedAt: string;
};

export function AdminPostList({ initialPosts }: { initialPosts: AdminPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function onDelete(id: string) {
    const confirmed = window.confirm('Delete this post permanently?');
    if (!confirmed) return;

    setDeletingId(id);
    const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });

    if (response.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } else {
      alert('Failed to delete post');
    }

    setDeletingId(null);
  }

  if (posts.length === 0) {
    return <p className="rounded-xl border p-6 text-sm text-zinc-500">No posts yet. Create your first post.</p>;
  }

  return (
    <div className="rounded-xl border">
      {posts.map((post) => (
        <div key={post.id} className="flex flex-col justify-between gap-3 border-b p-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-xs text-zinc-500">
              {post.status} • {new Date(post.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/edit/${post.id}`} className="rounded border px-3 py-1 text-sm">
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onDelete(post.id)}
              disabled={deletingId === post.id}
              className="rounded border border-red-400 px-3 py-1 text-sm text-red-600 disabled:opacity-50"
            >
              {deletingId === post.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
