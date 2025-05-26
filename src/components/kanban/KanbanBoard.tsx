
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { BoardState, Task, Column as ColumnDef, ClientColumn, NewTaskFirestore, UpdateTaskFirestore } from '@/types';
import KanbanColumn from './KanbanColumn';
import TaskForm from './TaskForm';
import ConfettiEffect from './ConfettiEffect';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTasks, addTaskToFirestore, updateTaskInFirestore, deleteTaskFromFirestore } from '@/services/firestoreService';

// Static definitions for columns and their order. Tasks will be fetched from Firestore.
const initialColumnsData: Record<string, ColumnDef> = {
  'todo': { id: 'todo', title: 'To Do' },
  'inprogress': { id: 'inprogress', title: 'In Progress' },
  'done': { id: 'done', title: 'Done' },
};

const initialColumnOrderData: string[] = ['todo', 'inprogress', 'done'];

// Helper to create initial column structure with empty task arrays
const createInitialClientColumns = (): Record<string, ClientColumn> => {
  const clientColumns: Record<string, ClientColumn> = {};
  initialColumnOrderData.forEach(id => {
    clientColumns[id] = { ...initialColumnsData[id], taskIds: [] };
  });
  return clientColumns;
};


const KanbanBoard: React.FC = () => {
  const queryClient = useQueryClient();
  const [boardState, setBoardState] = useState<BoardState>({
    tasks: {},
    columns: createInitialClientColumns(),
    columnOrder: initialColumnOrderData,
  });
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const { data: tasksData, isLoading: isLoadingTasks, error: tasksError } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: getAllTasks,
  });

  useEffect(() => {
    if (tasksData) {
      const newTasksMap: Record<string, Task> = {};
      tasksData.forEach(task => {
        newTasksMap[task.id] = task;
      });

      const newColumnsMap: Record<string, ClientColumn> = {};
      initialColumnOrderData.forEach(columnId => {
        const columnDef = initialColumnsData[columnId];
        newColumnsMap[columnId] = {
          ...columnDef,
          taskIds: tasksData
            .filter(task => task.columnId === columnId)
            .map(task => task.id)
            // Optionally sort tasks within columns, e.g., by createdAt
            .sort((idA, idB) => {
                const taskA = newTasksMap[idA];
                const taskB = newTasksMap[idB];
                if (taskA.createdAt && taskB.createdAt) {
                    return new Date(taskA.createdAt).getTime() - new Date(taskB.createdAt).getTime();
                }
                return 0;
            })
        };
      });
      
      setBoardState({
        tasks: newTasksMap,
        columns: newColumnsMap,
        columnOrder: initialColumnOrderData,
      });
    } else if (!isLoadingTasks && !tasksError) { // No tasks or empty array after loading
        setBoardState({
            tasks: {},
            columns: createInitialClientColumns(),
            columnOrder: initialColumnOrderData,
        });
    }
  }, [tasksData, isLoadingTasks, tasksError]);


  const addTaskMutation = useMutation({
    mutationFn: (newTaskData: Omit<NewTaskFirestore, 'createdAt'>) => addTaskToFirestore(newTaskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({ title: "Error Adding Task", description: error.message, variant: "destructive" });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: (variables: { taskId: string; data: UpdateTaskFirestore }) => updateTaskInFirestore(variables.taskId, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({ title: "Error Updating Task", description: error.message, variant: "destructive" });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTaskFromFirestore(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({ title: "Error Deleting Task", description: error.message, variant: "destructive" });
    }
  });


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
    deleteTaskMutation.mutate(taskId, {
      onSuccess: () => {
        toast({ title: "Task Deleted", description: `Task "${taskTitle}" has been successfully deleted.`});
      }
    });
  };

  const handleFormSubmit = (data: { title: string; description?: string; deadline?: Date }, taskId?: string) => {
    const deadlineString = data.deadline ? format(data.deadline, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : undefined;

    if (taskId) { // Editing existing task
      const updateData: UpdateTaskFirestore = {
        title: data.title,
        description: data.description || "", // Ensure description is not undefined if it was empty
        deadline: deadlineString,
      };
      updateTaskMutation.mutate({ taskId, data: updateData }, {
        onSuccess: () => {
          toast({ title: "Task Updated", description: `Task "${data.title}" has been updated.`});
        }
      });
    } else { // Adding new task
      const newTaskData: Omit<NewTaskFirestore, 'createdAt'> = {
        title: data.title,
        description: data.description || "",
        deadline: deadlineString,
        columnId: boardState.columnOrder[0], // Add to the first column by default
      };
      addTaskMutation.mutate(newTaskData, {
        onSuccess: () => {
          toast({ title: "Task Added", description: `Task "${data.title}" has been added.`});
        }
      });
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
    if (!taskBeingMoved) return;

    const sourceColumnId = taskBeingMoved.columnId;
    if (sourceColumnId === targetColumnId) return; 

    updateTaskMutation.mutate({ taskId: draggedTaskId, data: { columnId: targetColumnId } }, {
      onSuccess: () => {
        const finalTargetColumnTitle = initialColumnsData[targetColumnId]?.title || targetColumnId;
        if (targetColumnId === 'done' && sourceColumnId !== 'done') {
          setShowConfetti(true);
          // Short delay to allow confetti to render if triggered immediately after state update
          setTimeout(() => setShowConfetti(false), 50); 
          toast({ title: "Task Completed!", description: `"${taskBeingMoved.title}" moved to Done. Great job!`, variant: "default" });
        } else {
           toast({ title: "Task Moved", description: `"${taskBeingMoved.title}" moved to ${finalTargetColumnTitle}.`});
        }
      }
    });
    setDraggedTaskId(null);
  };
  
  const getTasksForColumn = useCallback((columnId: string): Task[] => {
    const column = boardState.columns[columnId];
    if (!column || !column.taskIds) return [];
    return column.taskIds.map(taskId => boardState.tasks[taskId]).filter(task => !!task);
  }, [boardState.columns, boardState.tasks]);

  if (isLoadingTasks) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading tasks...</p>
      </div>
    );
  }

  if (tasksError) {
     return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center">
        <p className="text-xl text-destructive mb-2">Error loading tasks!</p>
        <p className="text-muted-foreground">{tasksError.message}</p>
        <Button onClick={() => queryClient.refetchQueries({queryKey: ['tasks']})} className="mt-4">
            Try Again
        </Button>
      </div>
    );
  }

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
          if (!column) return null; // Should not happen if boardState is correctly initialized
          const tasks = getTasksForColumn(columnId);
          return (
            <KanbanColumn
              key={column.id}
              column={column} // Pass ClientColumn here
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
