
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { BoardState, Column, Task } from '@/types';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';
import ConfettiEffect from './ConfettiEffect';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const LOCAL_STORAGE_KEY = 'taskSparkBoardState';

const initialColumnsData: Record<string, Column> = {
  'todo': { id: 'todo', title: 'To Do', taskIds: [] },
  'inprogress': { id: 'inprogress', title: 'In Progress', taskIds: [] },
  'done': { id: 'done', title: 'Done', taskIds: [] },
};

const initialColumnOrderData: string[] = ['todo', 'inprogress', 'done'];

const KanbanBoard: React.FC = () => {
  const [boardState, setBoardState] = useState<BoardState>({
    tasks: {},
    columns: initialColumnsData,
    columnOrder: initialColumnOrderData,
  });
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  // Load state from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // Basic validation to ensure structure is somewhat correct
          if (parsedState.tasks && parsedState.columns && parsedState.columnOrder) {
            setBoardState(parsedState);
          } else {
            // If structure is invalid, reset to initial state or handle error
            localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid state
             setBoardState({
                tasks: {},
                columns: initialColumnsData,
                columnOrder: initialColumnOrderData,
            });
          }
        } catch (error) {
          console.error("Failed to parse board state from localStorage", error);
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted state
           setBoardState({
              tasks: {},
              columns: initialColumnsData,
              columnOrder: initialColumnOrderData,
          });
        }
      } else {
         setBoardState({
            tasks: {},
            columns: initialColumnsData,
            columnOrder: initialColumnOrderData,
        });
      }
    }
  }, []);

  // Save state to local storage
  useEffect(() => {
    if (typeof window !== 'undefined' && (Object.keys(boardState.tasks).length > 0 || !localStorage.getItem(LOCAL_STORAGE_KEY))) {
        // Only save if there are tasks or if it's the initial empty save
        // This avoids overwriting a potentially valid empty state on first load if localStorage is empty
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boardState));
    }
  }, [boardState]);


  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setBoardState((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newColumns = { ...prev.columns };
      Object.keys(newColumns).forEach(colId => {
        newColumns[colId].taskIds = newColumns[colId].taskIds.filter(id => id !== taskId);
      });
      
      toast({ title: "Task Deleted", description: "The task has been successfully deleted."});
      return { ...prev, tasks: newTasks, columns: newColumns };
    });
  };

  const handleFormSubmit = (data: { title: string; description?: string; deadline?: Date }, taskId?: string) => {
    const deadlineString = data.deadline ? format(data.deadline, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined;

    if (taskId) { // Editing existing task
      setBoardState((prev) => {
        const updatedTask = { ...prev.tasks[taskId], ...data, deadline: deadlineString };
        toast({ title: "Task Updated", description: `Task "${data.title}" has been updated.`});
        return {
          ...prev,
          tasks: { ...prev.tasks, [taskId]: updatedTask },
        };
      });
    } else { // Adding new task
      const newTaskId = `task-${Date.now()}`;
      const newTask: Task = {
        id: newTaskId,
        ...data,
        deadline: deadlineString,
        columnId: boardState.columnOrder[0], // Add to the first column by default
      };
      setBoardState((prev) => {
        const firstColumnId = prev.columnOrder[0];
        const firstColumn = prev.columns[firstColumnId];
        toast({ title: "Task Added", description: `Task "${data.title}" has been added.`});
        return {
          ...prev,
          tasks: { ...prev.tasks, [newTaskId]: newTask },
          columns: {
            ...prev.columns,
            [firstColumnId]: {
              ...firstColumn,
              taskIds: [...firstColumn.taskIds, newTaskId],
            },
          },
        };
      });
    }
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const task = boardState.tasks[draggedTaskId];
    const sourceColumnId = task.columnId;

    if (sourceColumnId === targetColumnId) return; // No change if dropped in the same column

    setBoardState((prev) => {
      // Remove from source column
      const sourceColumn = { ...prev.columns[sourceColumnId] };
      sourceColumn.taskIds = sourceColumn.taskIds.filter(id => id !== draggedTaskId);

      // Add to target column
      const targetColumn = { ...prev.columns[targetColumnId] };
      // Add to the end. For reordering within column, insert at specific index.
      targetColumn.taskIds = [...targetColumn.taskIds, draggedTaskId]; 
      
      // Update task's columnId
      const updatedTask = { ...prev.tasks[draggedTaskId], columnId: targetColumnId };

      if (targetColumnId === 'done' && sourceColumnId !== 'done') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 50); // Trigger re-render for confetti
        toast({ title: "Task Completed!", description: `"${updatedTask.title}" moved to Done. Great job!`, variant: "default" });
      } else {
         toast({ title: "Task Moved", description: `"${updatedTask.title}" moved to ${targetColumn.title}.`});
      }


      return {
        ...prev,
        tasks: { ...prev.tasks, [draggedTaskId]: updatedTask },
        columns: {
          ...prev.columns,
          [sourceColumnId]: sourceColumn,
          [targetColumnId]: targetColumn,
        },
      };
    });
    setDraggedTaskId(null);
  };
  
  const getTasksForColumn = useCallback((columnId: string) => {
    const column = boardState.columns[columnId];
    if (!column) return [];
    return column.taskIds.map(taskId => boardState.tasks[taskId]).filter(task => task); // Filter out undefined tasks
  }, [boardState.columns, boardState.tasks]);


  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex justify-end">
        <Button onClick={handleAddTask} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Task
        </Button>
      </div>

      <div className="flex-grow flex space-x-4 overflow-x-auto pb-4 min-h-[60vh]">
        {boardState.columnOrder.map((columnId) => {
          const column = boardState.columns[columnId];
          if (!column) return null;
          const tasks = getTasksForColumn(columnId);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks}
              onDragStartTask={onDragStart}
              onDragOver={onDragOver}
              onDropOnColumn={onDrop}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          );
        })}
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />
      <ConfettiEffect trigger={showConfetti} />
    </div>
  );
};

export default KanbanBoard;
