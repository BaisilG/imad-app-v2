import { format } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    featuredImage: string | null;
    createdAt: Date;
    tags: string[];
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:shadow-lg">
      {post.featuredImage ? (
        <img src={post.featuredImage} alt={post.title} className="h-52 w-full object-cover" />
      ) : (
        <div className="h-52 w-full bg-zinc-100 dark:bg-zinc-800" />
      )}
      <div className="space-y-3 p-5">
        <p className="text-xs text-zinc-500">{format(post.createdAt, 'PPP')}</p>
        <h2 className="text-xl font-semibold leading-tight">{post.title}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
              #{tag}
            </span>
          ))}
        </div>
        <Link href={`/post/${post.slug}`} className="inline-block text-sm font-medium text-blue-600">
          Read article →
        </Link>
      </div>
    </article>
  );
}
