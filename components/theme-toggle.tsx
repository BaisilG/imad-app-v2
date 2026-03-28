'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="rounded-md border px-3 py-2 text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      type="button"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
