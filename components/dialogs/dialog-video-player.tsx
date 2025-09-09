'use client'

import ReactPlayer from 'react-player'
import React, { useEffect, useRef } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface DialogVideoPlayerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  videoUrl?: string | string[]
  title?: string
  children?: React.ReactNode
}

export const DialogVideoPlayer = ({ open, onOpenChange, videoUrl, title, children }: DialogVideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null)
  const [playIndex, setPlayIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(true)

  // Reset video and playIndex when dialog closes or videoUrl changes
  useEffect(() => {
    if (!open && playerRef.current) {
      playerRef.current.seekTo(0)
      setPlayIndex(0)
    }
  }, [open])

  // Reset playIndex when videoUrl changes
  useEffect(() => {
    setPlayIndex(0)
  }, [videoUrl])

  const videoArray = Array.isArray(videoUrl) ? videoUrl : videoUrl ? [videoUrl] : []
  const hasMultipleVideos = videoArray.length > 1

  const nextVideo = () => {
    if (!hasMultipleVideos || playIndex >= videoArray.length - 1) return
    setPlayIndex((prev) => prev + 1)
    setPlaying(false) // First stop the current video

    // Use a small timeout to ensure state is updated before playing the next video
    setTimeout(() => {
      setPlaying(true) // Then start playing the next video
    }, 50)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-2">
        {title && (
          <DialogHeader className="pt-3">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="relative w-full aspect-video">
          <ReactPlayer
            ref={playerRef}
            url={videoArray[playIndex]}
            className="w-full h-full"
            width="100%"
            height="100%"
            controls={true}
            playing={playing}
            playsinline
            config={{
              youtube: {
                playerVars: {
                  rel: 0, // Don't show related videos
                  modestbranding: 1, // Hide YouTube logo
                },
              },
            }}
            onEnded={nextVideo}
          />

          {/* Video progress indicator for multiple videos */}
          {hasMultipleVideos && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {videoArray.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === playIndex ? 'bg-white w-4' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogVideoPlayer
