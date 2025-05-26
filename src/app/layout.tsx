
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed font
import './globals.css';

const inter = Inter({ // Changed font
  subsets: ['latin'],
  variable: '--font-inter', // Changed font variable
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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}> {/* Use new font variable and add font-sans */}
        {children}
      </body>
    </html>
  );
}
