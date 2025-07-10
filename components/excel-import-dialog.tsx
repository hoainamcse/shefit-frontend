'use client'

import { useState, type ChangeEvent, type DragEvent } from 'react'
import { toast } from 'sonner'
import { ImportIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { MainButton } from './buttons/main-button'

interface ExcelImportDialogProps {
  title: string
  handleSubmit: (file: File) => Promise<any>
  disabled?: boolean
}

export function ExcelImportDialog({ title, handleSubmit, disabled = false }: ExcelImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const onDialogConfirm = async () => {
    if (!file) {
      toast.error('Vui lòng chọn tệp Excel')
      return
    }
    setIsLoading(true)
    try {
      await handleSubmit(file)
      toast.success(`Nhập ${title} thành công`)

      setIsOpen(false)
    } catch (error: any) {
      toast.error(`Lỗi khi nhập ${title}: ${error.message}`)
    } finally {
      setIsLoading(false)
      setFile(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MainButton text={`Nhập ${title}`} icon={ImportIcon} variant="outline" disabled={disabled} />
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{`Nhập ${title}`}</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách {title} từ tệp Excel</DialogDescription>
        </DialogHeader>
        <div
          className={`w-full p-6 border-2 border-dashed rounded-lg transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${isLoading ? 'opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Chọn tệp Excel
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">hoặc kéo và thả tệp Excel tại đây</p>
            </div>
          </div>
        </div>
        {file && (
          <>
            <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 flex items-center justify-between">
              <span className="font-medium text-gray-800">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-red-500 hover:underline text-sm">
                Xóa
              </button>
            </div>
            <MainButton text={`Nhập ${title}`} className="mt-4" onClick={onDialogConfirm} loading={isLoading} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
