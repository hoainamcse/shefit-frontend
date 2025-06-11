'use client'

import { Users, Dumbbell, Utensils, UserRound } from 'lucide-react'
import { DashboardCard } from './dashboard-card'
import { Dashboard } from '@/models/dashboard'

interface StatsSectionProps {
  data: Dashboard
}

export const StatsSection = ({ data }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <DashboardCard
        title="Thành viên"
        value={data?.user_count.toLocaleString()}
        icon={<Users className="h-6 w-6" />}
      />
      <DashboardCard
        title="Bài tập"
        value={data?.exercise_count.toLocaleString()}
        icon={<Dumbbell className="h-6 w-6" />}
      />
      <DashboardCard
        title="Thực đơn"
        value={data?.meal_plan_count.toLocaleString()}
        icon={<Utensils className="h-6 w-6" />}
      />
      <DashboardCard
        title="Huấn luyện viên"
        value={data?.coach_count.toLocaleString()}
        icon={<UserRound className="h-6 w-6" />}
      />
    </div>
  )
}
