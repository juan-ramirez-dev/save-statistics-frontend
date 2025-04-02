"use client"

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, BarChart as RechartsBarChart, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends ComponentPropsWithoutRef<"div"> {
  config?: ChartConfig
}

export const ChartContainer = forwardRef<ElementRef<"div">, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    // Set the CSS variables based on the config
    const style = config
      ? Object.entries(config).reduce((acc, [key, value]) => {
          acc[`--color-${key}`] = value.color
          return acc
        }, {} as Record<string, string>)
      : {}

    return (
      <div
        ref={ref}
        className={cn("h-full w-full overflow-auto", className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipProps {
  content?: React.ReactElement | ((props: any) => React.ReactElement | null) | null
}

export function ChartTooltip({ content, ...props }: ChartTooltipProps) {
  return <Tooltip content={content as any} cursor={false} {...props} />
}

export function ChartTooltipContent({ active, payload, label }: any) {
  if (!active || !payload) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <div className="grid gap-0.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: item.color || item.fill }}
            />
            <span className="text-xs font-semibold" style={{ color: item.color }}>
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ClickStatsBarChart({ 
  data, 
  dataKey, 
  nameKey, 
  barColors = []
}: { 
  data: any[], 
  dataKey: string, 
  nameKey: string,
  barColors?: string[]
}) {
  const defaultColors = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f97316", // orange-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#6366f1", // indigo-500
    "#14b8a6", // teal-500
    "#f59e0b", // amber-500
  ];
  const colors = barColors.length > 0 ? barColors : defaultColors;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey={nameKey} 
          angle={-45} 
          textAnchor="end" 
          height={70}
          tick={{ fontSize: 12 }}
          stroke="#94a3b8"
        />
        <YAxis 
          stroke="#94a3b8"
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip 
          content={<ChartTooltipContent />} 
          cursor={{ fill: 'rgba(219, 234, 254, 0.3)' }}
        />
        <Legend wrapperStyle={{ marginTop: '10px' }} />
        <Bar 
          name="Cantidad de Clicks" 
          dataKey={dataKey} 
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
              fillOpacity={0.9}
              strokeWidth={1}
              stroke={colors[index % colors.length]}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
} 