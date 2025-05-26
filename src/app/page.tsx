
import KanbanPageClient from '@/components/kanban/KanbanPageClient';
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <>
      <KanbanPageClient />
      <Toaster />
    </>
  );
}
