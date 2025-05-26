
import KanbanPageClient from '@/components/kanban/KanbanPageClient';
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from '@/components/QueryProvider';

export default function Home() {
  return (
    <QueryProvider>
      <KanbanPageClient />
      <Toaster />
    </QueryProvider>
  );
}
