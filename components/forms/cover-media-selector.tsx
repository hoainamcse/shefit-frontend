import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ImageUploader } from '../image-uploader'
import { FormInputField } from './fields'

interface CoverMediaSelectorProps {
  form: UseFormReturn<any>
  showYoutubeUrlInput: boolean
  setShowYoutubeUrlInput: (val: boolean) => void
  coverImageName: string
  youtubeUrlName: string
  imageUploaderProps?: Partial<React.ComponentProps<typeof ImageUploader>>
}

export const CoverMediaSelector: React.FC<CoverMediaSelectorProps> = ({
  form,
  showYoutubeUrlInput,
  setShowYoutubeUrlInput,
  coverImageName = 'cover_image',
  youtubeUrlName = 'youtube_url',
  imageUploaderProps = {},
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full rounded-md bg-muted p-1 gap-2">
        <button
          type="button"
          className={`flex-1 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:z-8 ${
            !showYoutubeUrlInput ? 'bg-white shadow text-primary' : 'text-muted-foreground'
          }`}
          aria-pressed={!showYoutubeUrlInput}
          tabIndex={0}
          onClick={() => {
            setShowYoutubeUrlInput(false)
            form.setValue(youtubeUrlName, 'https://www.youtube.com/')
          }}
        >
          Hình ảnh bìa
        </button>
        <button
          type="button"
          className={`flex-1 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:z-8 ${
            showYoutubeUrlInput ? 'bg-white shadow text-primary' : 'text-muted-foreground'
          }`}
          aria-pressed={showYoutubeUrlInput}
          tabIndex={0}
          onClick={() => {
            setShowYoutubeUrlInput(true)
            form.setValue(coverImageName, 'https://placehold.co/600x400?text=example')
          }}
        >
          Link Youtube
        </button>
      </div>
      {/* Conditional input */}
      {showYoutubeUrlInput ? (
        <FormInputField form={form} name={youtubeUrlName} placeholder="Nhập link youtube" />
      ) : (
        <ImageUploader
          form={form}
          name={coverImageName}
          accept={{ 'image/*': [] }}
          maxFileCount={1}
          {...imageUploaderProps}
        />
      )}
    </div>
  )
}
