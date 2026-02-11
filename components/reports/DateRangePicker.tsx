'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  onChange: (range: { startDate: Date; endDate: Date }) => void
  className?: string
}

const PRESETS = [
  { 
    label: 'Last 30 days', 
    getRange: () => ({ start: subMonths(new Date(), 1), end: new Date() }),
    value: '30d'
  },
  { 
    label: 'Last 3 months', 
    getRange: () => ({ start: subMonths(new Date(), 3), end: new Date() }),
    value: '3m'
  },
  { 
    label: 'Last 6 months', 
    getRange: () => ({ start: subMonths(new Date(), 6), end: new Date() }),
    value: '6m'
  },
  { 
    label: 'Last 12 months', 
    getRange: () => ({ start: subMonths(new Date(), 12), end: new Date() }),
    value: '12m'
  },
  { 
    label: 'This month', 
    getRange: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }),
    value: 'this'
  },
]

export function DateRangePicker({ onChange, className }: DateRangePickerProps) {
  const [selectedValue, setSelectedValue] = useState('12m')
  const [displayRange, setDisplayRange] = useState('Last 12 months')

  const handleChange = (value: string) => {
    const preset = PRESETS.find(p => p.value === value)
    if (preset) {
      const range = preset.getRange()
      setSelectedValue(value)
      setDisplayRange(preset.label)
      onChange({ startDate: range.start, endDate: range.end })
    }
  }

  return (
    <Select value={selectedValue} onValueChange={handleChange}>
      <SelectTrigger className={cn("w-[180px]", className)}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {PRESETS.map((preset) => (
          <SelectItem key={preset.value} value={preset.value}>
            {preset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
