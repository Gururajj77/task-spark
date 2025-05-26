
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'; // Import Separator
import { ListTodo, ListChecks, CheckCircle2 } from 'lucide-react'; // Icons for statuses

interface TaskSummaryProps {
  counts: {
    todo: number;
    inprogress: number;
    done: number;
  };
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ counts }) => {
  const totalTasks = counts.todo + counts.inprogress + counts.done;

  return (
    <div className="mb-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 pt-4 px-3 sm:px-4">
          <CardTitle className="text-md font-medium text-foreground">Task Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-2 sm:p-4 sm:pt-2">
          {totalTasks > 0 ? (
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-around items-stretch">
              <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 text-chart-3" />
                <span className="font-bold text-lg sm:text-xl text-foreground">{counts.todo}</span>
                <p className="text-xs text-muted-foreground">To Do</p>
              </div>
              
              <div className="hidden sm:block">
                <Separator orientation="vertical" className="h-full" />
              </div>
               <hr className="block sm:hidden border-border" />


              <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <ListChecks className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 text-chart-1" />
                <span className="font-bold text-lg sm:text-xl text-foreground">{counts.inprogress}</span>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>

              <div className="hidden sm:block">
                <Separator orientation="vertical" className="h-full" />
              </div>
              <hr className="block sm:hidden border-border" />
              

              <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5 sm:mb-1 text-chart-2" />
                <span className="font-bold text-lg sm:text-xl text-foreground">{counts.done}</span>
                <p className="text-xs text-muted-foreground">Done</p>
              </div>
            </div>
          ) : (
            <div className="flex h-[70px] sm:h-[100px] items-center justify-center text-center">
              <p className="text-muted-foreground">No tasks yet. Add some tasks to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSummary;
