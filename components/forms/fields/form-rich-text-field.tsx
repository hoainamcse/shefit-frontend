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

        // Custom image handler function
        const imageHandler = React.useCallback(() => {
          const url = prompt('Enter image URL:')
          if (url && editorRef.current) {
            const range = editorRef.current.getSelection(true)
            editorRef.current.insertEmbed(range.index, 'image', url, 'user')
            editorRef.current.setSelection(range.index + 1)
          }
        }, [])

        // Custom video handler function
        const videoHandler = React.useCallback(() => {
          const url = prompt('Enter video URL (YouTube, Vimeo, or direct video link):')
          if (url && editorRef.current) {
            const range = editorRef.current.getSelection(true)

            // Check if it's a YouTube or Vimeo URL and convert to embed format
            let embedUrl = url

            // YouTube URL handling
            const youtubeRegex =
              /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
            const youtubeMatch = url.match(youtubeRegex)
            if (youtubeMatch) {
              embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`
            }

            // Vimeo URL handling
            const vimeoRegex = /(?:vimeo\.com\/)(\d+)/
            const vimeoMatch = url.match(vimeoRegex)
            if (vimeoMatch) {
              embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`
            }

            editorRef.current.insertEmbed(range.index, 'video', embedUrl, 'user')
            editorRef.current.setSelection(range.index + 1)
          }
        }, [])

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
                  toolbar: {
                    container: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                      [{ indent: '-1' }, { indent: '+1' }],
                      ['blockquote', 'code-block'],
                      ['link', 'image', 'video'],
                      ['table'],
                      ['clean'],
                    ],
                    handlers: {
                      image: imageHandler,
                      video: videoHandler,
                      table: function () {
                        const quill = (this as any).quill
                        if (quill) {
                          const tableRows = parseInt(prompt('Số lượng hàng', '3') || '3', 10)
                          const tableCols = parseInt(prompt('Số lượng cột', '3') || '3', 10)
                          const table = []
                          for (let r = 0; r < tableRows; r++) {
                            const row = []
                            for (let c = 0; c < tableCols; c++) {
                              row.push('')
                            }
                            table.push(row)
                          }
                          const range = quill.getSelection(true)
                          quill.insertText(range.index, '\n')
                          const tableHTML = `<table><tbody>${table
                            .map((row) => `<tr>${row.map(() => '<td><p><br></p></td>').join('')}</tr>`)
                            .join('')}</tbody></table>`
                          quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML)
                        }
                      },
                    },
                  },
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
        }, [field.value, field.onChange, placeholder, imageHandler, videoHandler])

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
