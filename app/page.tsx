import { Header } from '@/components/header';
import { PostCard } from '@/components/post-card';
import { prisma } from '@/lib/prisma';

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}) {
  const { q = '', tag = '', page = '1' } = await searchParams;
  const currentPage = Number(page) || 1;
  const take = 6;

  const where = {
    status: 'PUBLISHED' as const,
    ...(q ? { title: { contains: q, mode: 'insensitive' as const } } : {}),
    ...(tag ? { tags: { has: tag } } : {})
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * take,
      take
    }),
    prisma.post.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <form className="flex w-full gap-2" method="GET">
            <input name="q" defaultValue={q} placeholder="Search by title" className="w-full rounded border p-3" />
            <button className="rounded bg-blue-600 px-4 text-white">Search</button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <a
              key={index}
              href={`/?q=${encodeURIComponent(q)}&tag=${encodeURIComponent(tag)}&page=${index + 1}`}
              className={`rounded border px-3 py-1 ${currentPage === index + 1 ? 'bg-zinc-900 text-white' : ''}`}
            >
              {index + 1}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
