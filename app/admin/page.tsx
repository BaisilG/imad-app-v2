import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminPostList } from '@/components/admin-post-list';

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, status: true, updatedAt: true }
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/new" className="rounded bg-blue-600 px-4 py-2 text-white">
          New Post
        </Link>
      </div>

      <AdminPostList initialPosts={posts.map((p) => ({ ...p, updatedAt: p.updatedAt.toISOString() }))} />
    </main>
  );
}
