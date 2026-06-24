"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { day: "Mon", volume: 42, hoursSaved: 6.5 },
  { day: "Tue", volume: 38, hoursSaved: 5.8 },
  { day: "Wed", volume: 51, hoursSaved: 8.2 },
  { day: "Thu", volume: 47, hoursSaved: 7.1 },
  { day: "Fri", volume: 55, hoursSaved: 9.0 },
  { day: "Sat", volume: 29, hoursSaved: 4.2 },
  { day: "Sun", volume: 18, hoursSaved: 2.6 },
]

const chartConfig = {
  volume: {
    label: "Patient Volume",
    color: "var(--chart-1)",
  },
  hoursSaved: {
    label: "Staff Hours Saved",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function EfficiencyChart() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Intake Efficiency</CardTitle>
        <CardDescription>Daily patient volume vs. staff hours saved</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="hoursSaved" fill="var(--color-hoursSaved)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
