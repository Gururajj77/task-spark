
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListTodo, ListChecks, Activity } from 'lucide-react'; // Icons for statuses

interface TaskSummaryProps {
  counts: {
    todo: number;
    inprogress: number;
    done: number;
  };
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ counts }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            To Do
          </CardTitle>
          <ListTodo className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{counts.todo}</div>
          <p className="text-xs text-muted-foreground">
            Tasks waiting to be started
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            In Progress
          </CardTitle>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{counts.inprogress}</div>
          <p className="text-xs text-muted-foreground">
            Tasks currently being worked on
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Done
          </CardTitle>
          <ListChecks className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{counts.done}</div>
          <p className="text-xs text-muted-foreground">
            Tasks completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSummary;
