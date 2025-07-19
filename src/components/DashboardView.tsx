"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Sun, CloudRain, Droplets, Thermometer, Wind, Leaf } from "lucide-react";

const impactData = [
  { name: 'Water Usage', 'Without Planner': 8000, 'With Smart Planner': 5200 },
  { name: 'Disease Risk', 'Without Planner': 65, 'With Smart Planner': 30 },
  { name: 'Manual Work', 'Without Planner': 100, 'With Smart Planner': 40 },
];

const yieldData = [
  { name: 'Jan', yield: 280 },
  { name: 'Feb', yield: 310 },
  { name: 'Mar', yield: 290 },
  { name: 'Apr', yield: 350 },
  { name: 'May', yield: 380 },
  { name: 'Jun', yield: 410 },
];

export default function DashboardView() {
  return (
    <div className="grid gap-6 md:gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Irrigation</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">Tomorrow, 6 AM</div>
            <p className="text-xs text-muted-foreground">in 18 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">+35%</div>
            <p className="text-xs text-muted-foreground">~2,800L this week</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weather Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-1">
              <Sun className="h-6 w-6 text-accent" />
              <span className="font-bold text-lg">28°C</span>
              <span className="text-xs text-muted-foreground">Sunny</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CloudRain className="h-6 w-6 text-muted-foreground" />
              <span className="font-bold text-lg">15%</span>
              <span className="text-xs text-muted-foreground">Rain Chance</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Thermometer className="h-6 w-6 text-muted-foreground" />
              <span className="font-bold text-lg">65%</span>
              <span className="text-xs text-muted-foreground">Humidity</span>
            </div>
             <div className="flex flex-col items-center gap-1">
              <Wind className="h-6 w-6 text-muted-foreground" />
              <span className="font-bold text-lg">12 km/h</span>
              <span className="text-xs text-muted-foreground">Wind</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Predicted Impact</CardTitle>
            <CardDescription>Comparison with and without JalSevak.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip wrapperClassName="!bg-card !border-border" />
                <Legend iconSize={10} />
                <Bar dataKey="Without Planner" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="With Smart Planner" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Crop Yield Trend</CardTitle>
            <CardDescription>Projected yield consistency improvement.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yieldData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip wrapperClassName="!bg-card !border-border" />
                <Line type="monotone" dataKey="yield" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--accent))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
