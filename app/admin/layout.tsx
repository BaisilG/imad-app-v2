import Link from 'next/link';
import { ReactNode } from 'react';
import { AdminLogoutButton } from '@/components/admin-logout-button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-semibold">
            Admin Panel
          </Link>
          <AdminLogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
