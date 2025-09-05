import * as React from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.ComponentProps<'textarea'>, 'rows'> {
  type?: string // Giữ prop type để tương thích
  minRows?: number
  maxRows?: number
  autoResize?: boolean
  onEnterPress?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

const Input = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, type, minRows = 1, maxRows = 10, autoResize = true, onEnterPress, onKeyDown, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!, [])

    // Auto-resize function
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      // Reset height to get proper scrollHeight
      textarea.style.height = 'auto'

      // Calculate line height
      const styles = window.getComputedStyle(textarea)
      const lineHeight = parseInt(styles.lineHeight) || 20

      // Calculate min and max height
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows

      // Set new height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }, [autoResize, minRows, maxRows])

    // Handle input change
    const handleInput = React.useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight()
        if (props.onInput) {
          props.onInput(e)
        }
      },
      [adjustHeight, props.onInput]
    )

    // Handle key down
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Handle Enter key combinations
        if (e.key === 'Enter') {
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            // Allow line break with Shift+Enter, Ctrl+Enter, or Cmd+Enter
            // Do nothing special, let default behavior happen
          } else {
            // Plain Enter - call onEnterPress if provided
            if (onEnterPress) {
              e.preventDefault()
              onEnterPress(e)
            }
          }
        }

        // Call original onKeyDown if provided
        if (onKeyDown) {
          onKeyDown(e)
        }
      },
      [onEnterPress, onKeyDown]
    )

    // Adjust height on mount and when content changes
    React.useEffect(() => {
      adjustHeight()
    }, [adjustHeight, props.value, props.defaultValue])

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          'flex min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-hidden leading-relaxed',
          className
        )}
        rows={minRows}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          minHeight: '40px',
          lineHeight: '1.5',
          paddingTop: '12px',
          paddingBottom: '8px',
          verticalAlign: 'middle',
          ...props.style,
        }}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
export type { InputProps }
