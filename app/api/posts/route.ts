import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/validators';
import { getSessionUser } from '@/lib/auth';
import { sanitizeContent } from '@/lib/sanitize';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const tag = searchParams.get('tag')?.trim() ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const pageSize = Math.min(20, Math.max(1, Number(searchParams.get('pageSize') ?? '6') || 6));

  const where = {
    status: 'PUBLISHED' as const,
    ...(query ? { title: { contains: query, mode: 'insensitive' as const } } : {}),
    ...(tag ? { tags: { has: tag } } : {})
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.post.count({ where })
  ]);

  return NextResponse.json({
    items: posts,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  });
}

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const content = {
    ...parsed.data.content,
    html: sanitizeContent(parsed.data.contentHtml || '')
  };

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content,
      featuredImage: parsed.data.featuredImage || null,
      tags: parsed.data.tags,
      status: parsed.data.status
    }
  });

  return NextResponse.json(post, { status: 201 });
}
