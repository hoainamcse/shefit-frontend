'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/spinner'
import { useQuery } from '@tanstack/react-query'
import { fetchData } from '@/network/helpers/fetch-data'

// This would be replaced with a real API call in the future
const getTokenUsage = async () => {
  try {
    // This is a mock implementation - replace with actual API endpoint
    // const response = await fetchData('/v1/chatbot/token-usage')
    // return await response.json()

    // Mock data for now
    return {
      status: 'success',
      data: {
        totalTokens: 1250000,
        usedTokens: 780000,
        remainingTokens: 470000,
      },
    }
  } catch (error) {
    console.error('Error fetching token usage:', error)
    throw error
  }
}

export interface TokenUsageProps {
  className?: string
}

export function TokenUsage({ className }: TokenUsageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tokenUsage'],
    queryFn: getTokenUsage,
    refetchInterval: 60000, // Refetch every minute
  })

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const calculatePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100)
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <Spinner className="bg-ring dark:bg-white" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-destructive text-center">Failed to load token usage</p>
        </CardContent>
      </Card>
    )
  }

  const tokenData = data?.data
  const usagePercentage = tokenData ? calculatePercentage(tokenData.usedTokens, tokenData.totalTokens) : 0

  return (
    <Card className={className}>
      <CardHeader className="p-3">
        <CardTitle className="text-base font-medium">Total Token Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">{tokenData ? formatNumber(tokenData.usedTokens) : 0}</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${usagePercentage}%` }} />
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{usagePercentage}% used</span>
            <span className="text-muted-foreground">
              {tokenData ? formatNumber(tokenData.remainingTokens) : 0} tokens remaining
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
