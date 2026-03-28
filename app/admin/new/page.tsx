import { AdminPostForm } from '@/components/admin-post-form';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewPostPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Create Post</h1>
      <AdminPostForm />
    </main>
  );
}
