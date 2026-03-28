import { Header } from '@/components/header';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, excerpt: true }
  });

  if (!post) {
    return { title: 'Post not found' };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: 'PUBLISHED' }
  });

  if (!post) notFound();

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-3 text-4xl font-bold">{post.title}</h1>
        <p className="mb-6 text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="mb-6 rounded-xl" />}
        <article
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: ((post.content as Record<string, unknown>)?.html as string) || '' }}
        />
      </main>
    </div>
  );
}
