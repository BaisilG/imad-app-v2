import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">
          TechPulse Blog
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-300">
            Admin
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
