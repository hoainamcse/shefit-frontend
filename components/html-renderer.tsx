'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { DialogVideoPlayer } from './dialogs/dialog-video-player'
import { getYouTubeThumbnail } from '@/lib/youtube'

interface HTMLRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  className?: string
}

/**
 * A component for safely rendering HTML content from rich text editors
 * with enhanced video handling that replaces iframes/videos with thumbnails
 */
const HTMLRenderer = ({ content, className, ...props }: HTMLRendererProps) => {
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = React.useState(false)

  // Process content to replace YouTube iframes with thumbnails
  const processContent = React.useCallback((htmlContent: string): string => {
    // Create a temporary DOM element to manipulate the HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent

    // Process only YouTube iframes
    const iframes = tempDiv.querySelectorAll('iframe')
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src')
      // Skip if no src or not a YouTube link
      if (!src || !(src.includes('youtube.com') || src.includes('youtu.be'))) return

      const thumbnailUrl = getYouTubeThumbnail(src, 'sddefault')

      // Create replacement element with button role for accessibility
      const imgContainer = document.createElement('div')
      imgContainer.className = 'video-thumbnail-container relative group cursor-pointer max-w-5xl mx-auto'
      imgContainer.setAttribute('role', 'button')
      imgContainer.setAttribute('tabindex', '0')
      imgContainer.setAttribute('data-video-url', src)
      imgContainer.innerHTML = `
        <img
          src="${thumbnailUrl || 'https://placehold.co/400?text=shefit.vn&font=Oswald'}"
          alt="YouTube Video"
          class="aspect-[16/9] object-cover brightness-100 group-hover:brightness-110 transition-all duration-300"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-play-icon lucide-circle-play w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
      `
      // Replace iframe with our custom thumbnail
      iframe.parentNode?.replaceChild(imgContainer, iframe)
    })

    return tempDiv.innerHTML
  }, [])

  // Handle thumbnail click
  const handleContentClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement

    // Check if we clicked on the thumbnail container or any of its children
    const thumbnailContainer = target.closest('.video-thumbnail-container')
    if (thumbnailContainer) {
      const videoUrl = thumbnailContainer.getAttribute('data-video-url')
      if (videoUrl) {
        e.preventDefault()
        setVideoUrl(videoUrl)
        setIsVideoDialogOpen(true)
      }
    }
  }, [])

  // Create a ref for the content div to use with client-side processing
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Apply the content processing after initial render and clean up event listeners
  React.useEffect(() => {
    if (!contentRef.current) return

    // Process content
    contentRef.current.innerHTML = processContent(content)

    // Add event listeners for keyboard accessibility
    const containers = contentRef.current.querySelectorAll('.video-thumbnail-container')
    const keydownListeners = new Map()

    containers.forEach((container) => {
      const keydownHandler = (e: Event) => {
        const keyEvent = e as KeyboardEvent
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          e.preventDefault()
          const videoUrl = container.getAttribute('data-video-url')
          if (videoUrl) {
            setVideoUrl(videoUrl)
            setIsVideoDialogOpen(true)
          }
        }
      }

      container.addEventListener('keydown', keydownHandler)
      keydownListeners.set(container, keydownHandler)
    })

    // Clean up event listeners on unmount or content change
    return () => {
      containers.forEach((container) => {
        const listener = keydownListeners.get(container)
        if (listener) {
          container.removeEventListener('keydown', listener)
        }
      })
    }
  }, [content, processContent, setVideoUrl, setIsVideoDialogOpen])

  return (
    <>
      <div
        ref={contentRef}
        className={cn('prose max-w-none html-content', className)}
        onClick={handleContentClick}
        {...props}
      />

      {isVideoDialogOpen && videoUrl && (
        <DialogVideoPlayer
          open={isVideoDialogOpen}
          onOpenChange={(open) => setIsVideoDialogOpen(open)}
          title="Video Player"
          videoUrl={videoUrl}
        />
      )}
    </>
  )
}

export { HTMLRenderer }
