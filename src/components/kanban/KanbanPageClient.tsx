
"use client";

import React from 'react';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { Sparkles } from 'lucide-react'; 

export default function KanbanPageClient() {
  return (
    <div className="min-h-screen flex flex-col bg-background"> {/* Ensure main background covers */}
      <header className="p-4 shadow-lg bg-card border-b border-border/50 sticky top-0 z-50"> {/* Enhanced header */}
        <div className="container mx-auto flex items-center gap-3"> {/* Increased gap */}
          <Sparkles className="h-9 w-9 text-primary" /> {/* Slightly larger icon */}
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">TaskSpark</h1> {/* Bolder title */}
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6"> {/* Added more padding for larger screens */}
        <KanbanBoard />
      </main>
      <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border/50"> {/* Enhanced footer */}
        <p>&copy; {new Date().getFullYear()} TaskSpark. Fueling Productivity!</p>
      </footer>
    </div>
  );
}
