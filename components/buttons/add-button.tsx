import React from 'react'
import { Plus } from 'lucide-react'
import type { ButtonProps } from '@/components/ui/button'
import { MainButton } from './main-button'

export interface AddButtonProps extends Omit<ButtonProps, 'asChild'> {
  text?: string
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(({ text, ...props }, ref) => {
  return <MainButton ref={ref} icon={Plus} text={text} {...props} />
})

AddButton.displayName = 'AddButton'

export { AddButton }
