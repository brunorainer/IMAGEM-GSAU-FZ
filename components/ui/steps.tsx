"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

export function Steps({ value, className, ...props }: StepsProps) {
  return <div className={cn("flex items-center", className)} {...props} />
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

export function Step({ value, className, children, ...props }: StepProps) {
  const context = React.useContext(React.createContext<number | undefined>(undefined))

  const isActive = context === value
  const isCompleted = context !== undefined && context > value

  return (
    <div
      className={cn(
        "flex-1 flex items-center gap-2",
        {
          "text-muted-foreground": !isActive && !isCompleted,
        },
        className,
      )}
      {...props}
    >
      <div
        className={cn("flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium border", {
          "bg-primary text-primary-foreground border-primary": isActive,
          "bg-muted text-muted-foreground border-muted-foreground/20": !isActive && !isCompleted,
          "bg-primary/20 text-primary border-primary/20": isCompleted,
        })}
      >
        {value}
      </div>
      <div className="font-medium">{children}</div>
      {value !== 3 && (
        <div
          className={cn("flex-1 h-px", {
            "bg-primary": isCompleted,
            "bg-muted-foreground/20": !isCompleted,
          })}
        />
      )}
    </div>
  )
}
