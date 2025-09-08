import { FieldError } from 'react-hook-form'

interface FormFieldErrorProps {
  error?: FieldError
}

export function FormFieldError({ error }: FormFieldErrorProps) {
  if (!error) return null

  return <div className="text-xs font-medium text-destructive px-1">{error.message}</div>
}
