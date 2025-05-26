
"use client";

import React from 'react';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface KanbanTaskProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const KanbanTask: React.FC<KanbanTaskProps> = ({ task, onDragStart, onEdit, onDelete }) => {
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="mb-3 bg-card shadow-md hover:shadow-lg transition-shadow duration-200 cursor-grab active:cursor-grabbing rounded-lg border"
      data-testid={`task-${task.id}`}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground break-words">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        {task.description && (
          <CardDescription className="text-sm text-muted-foreground break-words mb-2">
            {task.description}
          </CardDescription>
        )}
        {task.deadline && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <CalendarDays className="h-3 w-3 mr-1.5" />
            Deadline: {format(parseISO(task.deadline), "MMM dd, yyyy")}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
          <Edit2 className="h-4 w-4 text-blue-500" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KanbanTask;
