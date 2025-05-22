import React from 'react'
import Link from 'next/link'
import { Loader2, LucideIcon } from 'lucide-react'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MainButtonProps extends ButtonProps {
  text?: string
  loading?: boolean
  icon?: LucideIcon
  href?: string
}

const buttonVariant = {
  default: 'bg-button text-button-foreground shadow hover:bg-button/90',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  outline: 'border border-button bg-transparent text-button shadow-sm hover:bg-accent hover:text-button',
  secondary: 'bg-secondary text-button shadow-sm hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-button',
  link: 'text-button underline-offset-4 hover:underline',
}

const MainButton = React.forwardRef<HTMLButtonElement, MainButtonProps>(
  ({ text = '', loading = false, icon: Icon, disabled, variant, className, href, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        variant={variant}
        className={cn(buttonVariant[variant || 'default'], className)}
        asChild={!!href}
        {...props}
      >
        {href ? (
          <Link href={href}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
            {text}
          </Link>
        ) : (
          <>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
            {text}
          </>
        )}
      </Button>
    )
  }
)

MainButton.displayName = 'MainButton'

export { MainButton }
