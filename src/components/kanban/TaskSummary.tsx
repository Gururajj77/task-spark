
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ListTodo, ListChecks, CheckCircle2 } from 'lucide-react';

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
      <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Title visible only on sm and up */}
        <CardHeader className="pb-2 pt-4 px-3 sm:px-4 hidden sm:block">
          <CardTitle className="text-md font-medium text-foreground">Task Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-2 py-3 sm:p-4 sm:pt-2"> {/* Reduced padding on mobile */}
          {totalTasks > 0 ? (
            <div className="flex flex-row justify-around items-start text-center"> {/* items-start for better label alignment if counts differ a lot */}
              {/* To Do Stat */}
              <div className="flex flex-col items-center p-1 sm:px-2">
                <ListTodo className="h-4 w-4 sm:h-5 sm:w-5 mb-1 text-chart-3" />
                <span className="font-bold text-base sm:text-lg text-foreground">{counts.todo}</span>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5">To Do</p>
              </div>

              {/* Vertical separator visible only on sm and up */}
              <Separator orientation="vertical" className="h-10 sm:h-12 mx-1 hidden sm:block" />

              {/* In Progress Stat */}
              <div className="flex flex-col items-center p-1 sm:px-2">
                <ListChecks className="h-4 w-4 sm:h-5 sm:w-5 mb-1 text-chart-1" />
                <span className="font-bold text-base sm:text-lg text-foreground">{counts.inprogress}</span>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5">In Progress</p>
              </div>

              <Separator orientation="vertical" className="h-10 sm:h-12 mx-1 hidden sm:block" />

              {/* Done Stat */}
              <div className="flex flex-col items-center p-1 sm:px-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 mb-1 text-chart-2" />
                <span className="font-bold text-base sm:text-lg text-foreground">{counts.done}</span>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5">Done</p>
              </div>
            </div>
          ) : (
            <div className="flex h-[60px] sm:h-[70px] items-center justify-center text-center"> {/* Reduced height on mobile */}
              <p className="text-sm text-muted-foreground px-2">No tasks yet. Add some to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSummary;
