// components/excel-import-dialog.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ImportIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { MainButton } from '../buttons/main-button'
import { ExcelReader } from './excel-reader'

interface DialogExcelImportProps {
  title: string
  handleSubmit: (file: File) => Promise<any>
  specificHeaders?: string[]
  disabled?: boolean
}

export function DialogExcelImport({
  title,
  handleSubmit,
  specificHeaders = [],
  disabled = false,
}: DialogExcelImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDialogConfirm = async () => {
    if (!file) {
      toast.error('Vui lòng chọn tệp Excel')
      return
    }
    setIsLoading(true)
    try {
      await handleSubmit(file)
      toast.success(`Nhập ${title} thành công`)
      setFile(null)
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
      <DialogContent className="max-w-5xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{`Nhập ${title}`}</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách {title} từ tệp Excel</DialogDescription>
        </DialogHeader>

        <ExcelReader specificHeaders={specificHeaders} onSuccess={setFile} />

        {file && <MainButton text={`Nhập ${title}`} className="mt-4" onClick={onDialogConfirm} loading={isLoading} />}
      </DialogContent>
    </Dialog>
  )
}
