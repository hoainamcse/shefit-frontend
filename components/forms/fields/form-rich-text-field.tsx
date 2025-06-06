'use client'

import * as React from 'react'
import 'quill/dist/quill.snow.css'
import { type UseFormReturn, type FieldValues, type Path } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

type FormRichTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> = {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>
  name: Path<TFieldValues>
  label?: string
  description?: string
  withAsterisk?: boolean
  placeholder?: string
  className?: string
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'form' | 'name'>

function FormRichTextField<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  form,
  name,
  label,
  description,
  withAsterisk = false,
  placeholder = '',
  className = '',
  ...divProps
}: FormRichTextFieldProps<TFieldValues, TContext, TTransformedValues>) {
  return (
    <FormField
      control={form.control as any}
      name={name}
      render={({ field }) => {
        const quillRef = React.useRef<HTMLDivElement | null>(null)
        const editorRef = React.useRef<any>(null)

        React.useEffect(() => {
          let isMounted = true
          import('quill').then((QuillModule) => {
            if (!isMounted) return
            const Quill = QuillModule.default
            if (quillRef.current && !editorRef.current) {
              editorRef.current = new Quill(quillRef.current, {
                theme: 'snow',
                placeholder,
                modules: {
                  toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image', 'video'],
                    ['clean'],
                  ],
                },
              })
              editorRef.current.on('text-change', () => {
                field.onChange(editorRef.current.root.innerHTML)
              })
              editorRef.current.root.innerHTML = field.value || ''
            }
            if (editorRef.current && editorRef.current.root.innerHTML !== field.value) {
              editorRef.current.root.innerHTML = field.value || ''
            }
          })
          return () => {
            isMounted = false
          }
        }, [field.value, field.onChange, placeholder])

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label} {withAsterisk && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div
                ref={quillRef}
                id={name.toString()}
                tabIndex={0}
                aria-label={label}
                className="bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary p-0 min-h-[180px]"
                {...divProps}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export { FormRichTextField }
