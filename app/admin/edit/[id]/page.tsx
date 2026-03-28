import { AdminPostForm } from '@/components/admin-post-form';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Edit Post</h1>
      <AdminPostForm postId={post.id} initial={{ ...post, contentHtml: (post.content as any)?.html ?? '' }} />
    </main>
  );
}
