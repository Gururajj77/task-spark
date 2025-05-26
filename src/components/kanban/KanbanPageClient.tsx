
"use client";

import React, { useState, useCallback } from 'react';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskSummary from '@/components/kanban/TaskSummary'; // Import TaskSummary
import { Sparkles } from 'lucide-react'; 
import { ThemeSwitcher } from '@/components/ThemeSwitcher'; // Import ThemeSwitcher

export default function KanbanPageClient() {
  const [taskCounts, setTaskCounts] = useState({ todo: 0, inprogress: 0, done: 0 });

  const handleTaskCountsChange = useCallback((counts: { todo: number; inprogress: number; done: number }) => {
    setTaskCounts(counts);
  }, []); // setTaskCounts from useState is stable, so empty dependency array is fine.

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 shadow-lg bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-9 w-9 text-primary" />
            <h1 className="text-3xl font-extrabold text-primary tracking-tight">TaskSpark</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <TaskSummary counts={taskCounts} /> 
        <KanbanBoard onTaskCountsChange={handleTaskCountsChange} />
      </main>
      <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} TaskSpark. Fueling Productivity!</p>
      </footer>
    </div>
  );
}

