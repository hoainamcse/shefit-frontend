'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  className?: string
}

export const DashboardCard = ({ title, value, icon, className }: DashboardCardProps) => {
  return (
    <div className={cn(
      "p-6 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-primary mt-1">{value}</h3>
        </div>
        {icon && (
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
