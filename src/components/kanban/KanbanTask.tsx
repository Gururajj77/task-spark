
"use client";

import React from 'react';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, CalendarDays, GripVertical } from 'lucide-react'; // Added GripVertical
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
      className="mb-3 bg-card/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 rounded-lg border border-border/70 group" // Added group for hover effects on children
      data-testid={`task-${task.id}`}
    >
      <div className="flex items-start p-1"> {/* Flex container for grip and content */}
        <div className="p-2 text-muted-foreground/50 cursor-grab active:cursor-grabbing group-hover:text-muted-foreground transition-colors">
           <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-grow">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-md font-semibold text-foreground break-words leading-tight"> {/* Adjusted size and leading */}
              {task.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1 pb-2">
            {task.description && (
              <CardDescription className="text-sm text-muted-foreground break-words mb-2 leading-snug"> {/* Adjusted leading */}
                {task.description}
              </CardDescription>
            )}
            {task.deadline && (
              <div className="flex items-center text-xs text-accent mt-1"> {/* Changed color to accent */}
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                Deadline: {format(parseISO(task.deadline), "MMM dd, yyyy")}
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 pt-0 flex justify-end space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task" className="h-7 w-7 hover:bg-muted">
              <Edit2 className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task" className="h-7 w-7 hover:bg-muted">
              <Trash2 className="h-4 w-4 text-red-400 group-hover:text-red-300" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default KanbanTask;
