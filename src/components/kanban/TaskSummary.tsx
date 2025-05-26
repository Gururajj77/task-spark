
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip, // Renamed to avoid conflict if Shadcn Tooltip is used
  Legend as RechartsLegend, // Renamed
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";

interface TaskSummaryProps {
  counts: {
    todo: number;
    inprogress: number;
    done: number;
  };
}

const chartConfig = {
  todo: {
    label: "To Do",
    color: "hsl(var(--chart-3))",
  },
  inprogress: {
    label: "In Progress",
    color: "hsl(var(--chart-1))",
  },
  done: {
    label: "Done",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const TaskSummary: React.FC<TaskSummaryProps> = ({ counts }) => {
  const totalTasks = counts.todo + counts.inprogress + counts.done;

  const chartData = [
    { status: 'todo', value: counts.todo, name: chartConfig.todo.label, fill: chartConfig.todo.color },
    { status: 'inprogress', value: counts.inprogress, name: chartConfig.inprogress.label, fill: chartConfig.inprogress.color },
    { status: 'done', value: counts.done, name: chartConfig.done.label, fill: chartConfig.done.color },
  ].filter(item => item.value > 0); // Filter out segments with 0 tasks for a cleaner chart

  return (
    <div className="mb-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">Task Progress</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          {totalTasks > 0 ? (
            <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-full sm:h-[250px]">
              <PieChart accessibilityLayer>
                <RechartsTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="name" />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name" // Used by ChartTooltipContent to display the name
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  strokeWidth={2}
                  paddingAngle={chartData.length > 1 ? 2 : 0} // Add paddingAngle if more than one segment
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={entry.fill} className="stroke-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                  ))}
                </Pie>
                <RechartsLegend 
                  content={<ChartLegendContent nameKey="name" className="mt-4 flex-wrap justify-center gap-x-4 gap-y-1 text-xs" />} 
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[200px] items-center justify-center sm:h-[250px]">
              <p className="text-muted-foreground">No tasks yet. Add some tasks to see progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSummary;
