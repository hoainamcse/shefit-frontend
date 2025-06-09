'use client'

import React, { ChangeEvent, useState, DragEvent } from 'react'
import * as XLSX from 'xlsx'

interface ExcelReaderProps {
  specificHeaders?: string[]
  onSuccess: (data: Record<string, string | number>[]) => void
}

export const ExcelReader = ({ specificHeaders = [], onSuccess }: ExcelReaderProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [totalRows, setTotalRows] = useState<number>(0)
  const [headers, setHeaders] = useState<Record<string, 'number' | 'text'>>({})

  const processFile = async (file: File) => {
    if (!file) return
    setFileName(file.name)
    setIsProcessing(true)
    setPreviewData([])
    setTotalRows(0)

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      if (jsonData.length < 2) return

      const excelHeaders = (jsonData[0] as string[]).map((header) => header.trim())
      const results: Record<string, string | number>[] = []

      for (let i = 1; i < jsonData.length; i++) {
        if (!jsonData[i] || !(jsonData[i] as any[]).length) continue

        const values = (jsonData[i] as any[]).map((value) =>
          value !== undefined && value !== null ? String(value).trim() : ''
        )
        const row: Record<string, string | number> = {}

        // Determine headers and types: use specificHeaders if provided, else default all to 'text'
        const headers: Record<string, 'number' | 'text'> = {}
        excelHeaders.forEach((header) => {
          if (specificHeaders && specificHeaders.includes(header)) {
            headers[header] = 'number'
          } else {
            headers[header] = 'text'
          }
        })
        setHeaders(headers)

        Object.entries(headers).forEach(([key, type]) => {
          const headerIndex = excelHeaders.indexOf(key)
          if (headerIndex !== -1) {
            const value = values[headerIndex]
            row[key] = type === 'number' ? Number(value) : value
          }
        })

        results.push(row)
      }

      // Set preview data and total rows
      setPreviewData(results.slice(0, 5))
      setTotalRows(results.length)
      onSuccess(results)
      setIsProcessing(false)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) processFile(file)
  }

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

    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div
      className={`w-full overflow-x-auto p-6 border-2 border-dashed rounded-lg transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isProcessing ? 'opacity-50' : ''}`}
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
            <input id="file-upload" type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="sr-only" />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Chọn tệp Excel
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">hoặc kéo và thả tệp Excel tại đây</p>
        </div>

        {fileName && !isProcessing && previewData.length > 0 && (
          <div className="w-full mt-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Xem trước tệp (tổng cộng {totalRows} hàng)</div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(headers).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.keys(headers).map((header) => (
                        <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {fileName && (
          <div className="text-sm text-gray-600">
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Đang xử lý {fileName}...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Đã xử lý {fileName}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
