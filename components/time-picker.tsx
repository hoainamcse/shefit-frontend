'use client'

import * as React from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  disabled?: boolean
  className?: string
  format?: '12' | '24'
}

export function TimePicker({ value, onChange, disabled, className, format = '12' }: TimePickerProps) {
  // Parse the time value (format: "HH:MM")
  const [hours, minutes] = value ? value.split(':').map(Number) : [0, 0]

  // Generate hours and minutes options
  const hoursOptions =
    format === '24' ? Array.from({ length: 24 }, (_, i) => i) : Array.from({ length: 12 }, (_, i) => i + 1)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i)

  // Format the time for display
  const formatTime = (hours: number, minutes: number) => {
    if (format === '24') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    } else {
      const period = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      const displayMinutes = minutes.toString().padStart(2, '0')
      return `${displayHours}:${displayMinutes} ${period}`
    }
  }

  // Format the time for the input value (24-hour format)
  const formatTimeValue = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // AM/PM period for 12h mode
  const period = hours >= 12 ? 'PM' : 'AM'

  // Handle time changes
  const handleHoursChange = (newHours: string) => {
    let h = parseInt(newHours, 10)
    if (format === '12') {
      const isPM = hours >= 12
      if (isPM) {
        h = (h % 12) + 12
      } else {
        h = h % 12
      }
    }
    onChange(formatTimeValue(h, minutes))
  }

  const handleMinutesChange = (newMinutes: string) => {
    onChange(formatTimeValue(hours, parseInt(newMinutes)))
  }

  // Handle AM/PM changes
  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    const baseHour = hours % 12
    const h = newPeriod === 'PM' ? baseHour + 12 : baseHour
    onChange(formatTimeValue(h, minutes))
  }

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={cn('relative', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value ? formatTime(hours, minutes) : 'Select time'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Hours</span>
              <Select
                value={format === '24' ? hours.toString() : (hours % 12 || 12).toString()}
                onValueChange={handleHoursChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent position="popper" className="h-[200px]">
                  {hoursOptions.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {format === '24' ? hour.toString().padStart(2, '0') : hour.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Minutes</span>
              <Select value={minutes.toString()} onValueChange={handleMinutesChange}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent position="popper" className="h-[200px]">
                  {minutesOptions.map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {format === '12' && (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">AM/PM</span>
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="h-[200px]">
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
