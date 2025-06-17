'use client'

import { WelcomeSection } from './welcome-section'
import { StatsSection } from './stats-section'
import { Dashboard } from '@/models/configuration'

interface DashboardContentProps {
  data: Dashboard
}

export const DashboardContent = ({ data }: DashboardContentProps) => {
  return (
    <div className="w-full space-y-8">
      <WelcomeSection />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Tổng quan</h2>
        <StatsSection data={data} />
      </div>

      {/* Additional dashboard sections can be added here */}
      {/* For example: Recent activities, charts, etc. */}
    </div>
  )
}
