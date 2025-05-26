
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, AlignLeft, CalendarDays } from 'lucide-react'; // Added icons
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  deadline: z.date().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData, taskId?: string) => void;
  initialData?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) { // Reset form only when dialog opens
      if (initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description || '',
          deadline: initialData.deadline ? parseISO(initialData.deadline) : undefined,
        });
      } else {
        form.reset({
          title: '',
          description: '',
          deadline: undefined,
        });
      }
    }
  }, [initialData, form, isOpen]);

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data, initialData?.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-card shadow-xl rounded-lg border-border/50"> {/* Adjusted max-width for better feel */}
        <DialogHeader className="pb-2 pt-4 px-6">
          <DialogTitle className="text-2xl font-bold text-primary"> {/* Enhanced title */}
            {initialData ? 'Edit Task Details' : 'Create a New Task'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-6 pt-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" /> Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Design new dashboard" {...field} className="bg-input border-border focus:border-primary text-foreground placeholder:text-muted-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground flex items-center">
                    <AlignLeft className="h-4 w-4 mr-2 text-primary" /> Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more details about the task..." {...field} className="bg-input border-border focus:border-primary min-h-[100px] text-foreground placeholder:text-muted-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-foreground flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary" /> Deadline (Optional)
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-input border-border hover:bg-input/80 text-foreground",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                        initialFocus
                        className="bg-card text-foreground" // Ensure calendar also picks up theme
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-border hover:bg-muted hover:text-muted-foreground">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {initialData ? 'Save Changes' : 'Add Task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
