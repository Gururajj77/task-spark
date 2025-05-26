
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
          if (parsedState.tasks && parsedState.columns && parsedState.columnOrder) {
            setBoardState(parsedState);
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
             setBoardState({
                tasks: {},
                columns: initialColumnsData,
                columnOrder: initialColumnOrderData,
            });
          }
        } catch (error) {
          console.error("Failed to parse board state from localStorage", error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
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
    const taskTitle = boardState.tasks[taskId]?.title || "A task";

    setBoardState((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newColumns = { ...prev.columns };
      Object.keys(newColumns).forEach(colId => {
        newColumns[colId].taskIds = newColumns[colId].taskIds.filter(id => id !== taskId);
      });
      
      return { ...prev, tasks: newTasks, columns: newColumns };
    });
    toast({ title: "Task Deleted", description: `Task "${taskTitle}" has been successfully deleted.`});
  };

  const handleFormSubmit = (data: { title: string; description?: string; deadline?: Date }, taskId?: string) => {
    const deadlineString = data.deadline ? format(data.deadline, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined;

    if (taskId) { // Editing existing task
      setBoardState((prev) => {
        const updatedTask = { ...prev.tasks[taskId], ...data, deadline: deadlineString };
        return {
          ...prev,
          tasks: { ...prev.tasks, [taskId]: updatedTask },
        };
      });
      toast({ title: "Task Updated", description: `Task "${data.title}" has been updated.`});
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
      toast({ title: "Task Added", description: `Task "${data.title}" has been added.`});
    }
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const taskBeingMoved = boardState.tasks[draggedTaskId];
    const sourceColumnId = taskBeingMoved.columnId;

    if (sourceColumnId === targetColumnId) return; 

    setBoardState((prev) => {
      const sourceColumn = { ...prev.columns[sourceColumnId] };
      sourceColumn.taskIds = sourceColumn.taskIds.filter(id => id !== draggedTaskId);

      const targetCol = { ...prev.columns[targetColumnId] };
      targetCol.taskIds = [...targetCol.taskIds, draggedTaskId]; 
      
      const updatedTask = { ...prev.tasks[draggedTaskId], columnId: targetColumnId };

      return {
        ...prev,
        tasks: { ...prev.tasks, [draggedTaskId]: updatedTask },
        columns: {
          ...prev.columns,
          [sourceColumnId]: sourceColumn,
          [targetColumnId]: targetCol,
        },
      };
    });

    const finalTargetColumnTitle = boardState.columns[targetColumnId].title;

    if (targetColumnId === 'done' && sourceColumnId !== 'done') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 50); 
      toast({ title: "Task Completed!", description: `"${taskBeingMoved.title}" moved to Done. Great job!`, variant: "default" });
    } else {
       toast({ title: "Task Moved", description: `"${taskBeingMoved.title}" moved to ${finalTargetColumnTitle}.`});
    }

    setDraggedTaskId(null);
  };
  
  const getTasksForColumn = useCallback((columnId: string) => {
    const column = boardState.columns[columnId];
    if (!column) return [];
    return column.taskIds.map(taskId => boardState.tasks[taskId]).filter(task => task);
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
