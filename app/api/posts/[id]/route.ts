import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/validators';
import { getSessionUser } from '@/lib/auth';
import { sanitizeContent } from '@/lib/sanitize';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      featuredImage: parsed.data.featuredImage || null,
      tags: parsed.data.tags,
      status: parsed.data.status,
      content: {
        ...parsed.data.content,
        html: sanitizeContent(parsed.data.contentHtml || '')
      }
    }
  });

  return NextResponse.json(post);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
