"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
  { date: "March 19, 2026", users: 372 },
  { date: "March 20, 2026", users: 603 },
  { date: "March 21, 2026", users: 631 },
];

const chartConfig = {
  users: {
    label: "Total Users",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [selectedDate, setSelectedDate] = React.useState("all");

  const filteredData = React.useMemo(() => {
    if (selectedDate === "all") {
      return chartData;
    }
    return chartData.filter((item) => item.date === selectedDate);
  }, [selectedDate]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total visitors by day
          </span>
          <span className="@[540px]/card:hidden">March 19-21, 2026</span>
        </CardDescription>
        <CardAction>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger
              className="flex w-48 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select a date"
            >
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All Days
              </SelectItem>
              <SelectItem value="March 19, 2026" className="rounded-lg">
                March 19, 2026
              </SelectItem>
              <SelectItem value="March 20, 2026" className="rounded-lg">
                March 20, 2026
              </SelectItem>
              <SelectItem value="March 21, 2026" className="rounded-lg">
                March 21, 2026
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="users"
              fill="var(--color-users)"
              radius={4}
              maxBarSize={48}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
