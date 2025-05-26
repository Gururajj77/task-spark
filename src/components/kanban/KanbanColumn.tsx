
"use client";

import React from 'react';
import type { ClientColumn, Task } from '@/types'; // Use ClientColumn
import KanbanTask from './KanbanTask';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KanbanColumnProps {
  column: ClientColumn; // Updated to ClientColumn
  tasks: Task[];
  onDragStartTask: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDropOnColumn: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onDragStartTask,
  onDragOver,
  onDropOnColumn,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <Card
      className="w-80 min-w-80 h-full flex flex-col bg-secondary/50 shadow-sm rounded-lg border"
      onDragOver={onDragOver}
      onDrop={(e) => onDropOnColumn(e, column.id)}
      data-testid={`column-${column.id}`}
    >
      <CardHeader className="p-4 border-b sticky top-0 bg-secondary/70 backdrop-blur-sm z-10 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-secondary-foreground">{column.title} ({tasks.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-y-auto">
        {tasks.length === 0 && (
          <div className="text-center text-muted-foreground py-4 italic">
            No tasks here yet.
          </div>
        )}
        {tasks.map((task) => (
          <KanbanTask
            key={task.id}
            task={task}
            onDragStart={onDragStartTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
