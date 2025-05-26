
"use client";

import React from 'react';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { Sparkles } from 'lucide-react'; // For a nice icon next to title

export default function KanbanPageClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 shadow-md bg-card">
        <div className="container mx-auto flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">TaskSpark</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <KanbanBoard />
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TaskSpark. Built with Fun!</p>
      </footer>
    </div>
  );
}
