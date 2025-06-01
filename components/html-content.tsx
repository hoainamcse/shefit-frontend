'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface HtmlContentProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  className?: string
}

/**
 * A component for safely rendering HTML content from rich text editors
 */
const HtmlContent = ({ content, className, ...props }: HtmlContentProps) => {
  return (
    <div 
      className={cn('prose max-w-none', className)} 
      dangerouslySetInnerHTML={{ __html: content }} 
      {...props}
    />
  )
}

export { HtmlContent }
