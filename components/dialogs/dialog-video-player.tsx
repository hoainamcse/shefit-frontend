'use client'

import ReactPlayer from 'react-player'
import React, { useEffect, useRef } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DialogVideoPlayerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  videoUrl: string
  title?: string
  children?: React.ReactNode
}

export const DialogVideoPlayer = ({ open, onOpenChange, videoUrl, title, children }: DialogVideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null)

  // Reset video when dialog closes
  useEffect(() => {
    if (!open && playerRef.current) {
      playerRef.current.seekTo(0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-2">
        {title && (
          <DialogHeader className='pt-3'>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="relative w-full aspect-video">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            className="w-full h-full"
            width="100%"
            height="100%"
            controls={true}
            playing={open}
            playsinline
            config={{
              youtube: {
                playerVars: {
                  rel: 0, // Don't show related videos
                  modestbranding: 1, // Hide YouTube logo
                },
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogVideoPlayer
