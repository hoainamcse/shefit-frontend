import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPasswordType = type === 'password'
  const inputRef = React.useRef<HTMLInputElement>(null)
  const mergedRef = React.useMemo(() => {
    return (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }
  }, [ref])

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  React.useEffect(() => {
    if (isPasswordType && inputRef.current) {
      const style = document.createElement('style')
      style.textContent = `
          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear {
            display: none;
          }
        `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [isPasswordType])

  return (
    <div className="relative">
      <input
        type={isPasswordType && showPassword ? 'text' : type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          isPasswordType ? 'pr-10' : '',
          className
        )}
        ref={mergedRef}
        autoComplete={isPasswordType ? 'current-password' : props.autoComplete}
        {...props}
      />
      {isPasswordType && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
