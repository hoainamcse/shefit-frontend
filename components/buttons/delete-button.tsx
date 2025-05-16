import React, { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { ButtonProps } from '@/components/ui/button'
import { MainButton } from './main-button'

export interface DeleteButtonProps extends Omit<ButtonProps, 'asChild'> {
  text?: string
  onConfirm: () => Promise<any>
  description?: string
  loading?: boolean
}

const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
  ({ text, onConfirm, description, loading, ...props }, ref) => {
    const [open, setOpen] = useState(false)

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <MainButton
            ref={ref}
            icon={Trash2}
            text={text}
            {...props}
            variant="outline"
            className="text-destructive border-destructive hover:text-destructive"
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn hoàn toàn không?</AlertDialogTitle>
            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                onConfirm().then(() => setOpen(false))
                event.preventDefault()
              }}
              disabled={loading}
              className="bg-destructive shadow-sm hover:bg-destructive/90"
            >
              {loading && <Loader2 className="animate-spin" />} Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
)

DeleteButton.displayName = 'DeleteButton'

export { DeleteButton }
