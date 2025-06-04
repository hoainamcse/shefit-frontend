import React from 'react'
import { Edit } from 'lucide-react'
import type { ButtonProps } from '@/components/ui/button'
import { MainButton } from './main-button'

export interface EditButtonProps extends Omit<ButtonProps, 'asChild'> {
  text?: string
}

const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(({ text, ...props }, ref) => {
  return <MainButton ref={ref} icon={Edit} text={text} {...props} />
})

EditButton.displayName = 'EditButton'

export { EditButton }
