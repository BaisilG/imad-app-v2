import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(posts);
}
