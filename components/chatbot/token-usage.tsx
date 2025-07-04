'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface TokenUsageProps {
  className?: string
  tokensUsage: number
  availableTokens: number
}

export function TokenUsage({ className, tokensUsage, availableTokens }: TokenUsageProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const usagePercentage = Math.round((tokensUsage / (tokensUsage + availableTokens)) * 100)

  return (
    <Card className={className}>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-medium">Total Token Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">{formatNumber(tokensUsage)}</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${usagePercentage}%` }} />
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{usagePercentage}% used</span>
            <span className="text-muted-foreground">{formatNumber(availableTokens)} tokens remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
