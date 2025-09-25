"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatFileSize } from "@/utils/utility";

export const description = "A radial chart showing storage usage";

interface StorageChartProps {
  totalStorage: number; // in GB
  usedStorage: number;  // in GB
  className?: string;
}

export function ChartRadialShape({ 
  totalStorage = 10, 
  usedStorage = 1.26,
  className = ""
}: StorageChartProps) {
  const remainingStorage = totalStorage - usedStorage;
  const usagePercentage = (usedStorage / totalStorage) * 100;
  
  const chartData = [
    { 
      storage: formatFileSize(totalStorage), 
      space_used: usagePercentage,
      fill: usagePercentage > 80 ? "var(--destructive)" : "var(--primary)"
    },
  ];

  const chartConfig = {
    space_used: {
      label: `of ${formatFileSize(totalStorage)}`,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <div className={`space-y-4 ${className}`}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={90 + (usagePercentage / 100) * 360}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-secondary last:fill-background"
            polarRadius={[86, 74]}
          />
          <RadialBar 
            dataKey="space_used" 
            background 
            cornerRadius={10}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {formatFileSize(remainingStorage)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 15}
                        className="fill-muted-foreground text-sm"
                      >
                        Remaining
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      
      {/* Storage details */}
      <div className="space-y-2 text-center">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Used:</span>
          <span className="font-medium">{formatFileSize(usedStorage)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Available:</span>
          <span className="font-medium">{formatFileSize(remainingStorage)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-medium">{formatFileSize(totalStorage)}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 mt-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              usagePercentage > 80 ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {usagePercentage.toFixed(1)}% of storage used
        </p>
      </div>
    </div>
  );
}
