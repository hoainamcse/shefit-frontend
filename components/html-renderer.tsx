'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface HTMLRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  className?: string
}

/**
 * A component for safely rendering HTML content from rich text editors
 */
const HTMLRenderer = ({ content, className, ...props }: HTMLRendererProps) => {
  return (
    <div
      className={cn('prose max-w-none html-content', className)}
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  )
}

export { HTMLRenderer }
