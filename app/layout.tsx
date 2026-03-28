import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'TechPulse Blog',
  description: 'Personal tech blogging platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
