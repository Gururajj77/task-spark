
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider'; // Import ThemeProvider

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TaskSpark - Kanban Task Tracker',
  description: 'Visually organize your tasks with TaskSpark, a drag-and-drop Kanban board.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning><body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="taskspark-theme"
        >
          {children}
        </ThemeProvider>
      </body></html>
  );
}

