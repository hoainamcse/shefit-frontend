'use client'

import * as React from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CustomCarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CustomCarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
} & CustomCarouselProps

const CustomCarouselContext = React.createContext<CustomCarouselContextProps | null>(null)

function useCustomCarousel() {
  const context = React.useContext(CustomCarouselContext)

  if (!context) {
    throw new Error('useCustomCarousel must be used within a <CustomCarousel />')
  }

  return context
}

const CustomCarousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CustomCarouselProps>(
  ({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        loop: true,
        align: 'center',
        startIndex: 0,
        skipSnaps: false,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
      setSelectedIndex(api.selectedScrollSnap())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api) {
        return
      }

      const onInit = () => {
        setScrollSnaps(api.scrollSnapList())
        if (api.selectedScrollSnap() === 0) {
          onSelect(api)
        }
      }

      onSelect(api)
      onInit()

      api.on('reInit', onInit)
      api.on('reInit', onSelect)
      api.on('select', onSelect)

      api.scrollTo(0, false)

      return () => {
        api.off('select', onSelect)
        api.off('reInit', onInit)
      }
    }, [api, onSelect])

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    return (
      <CustomCarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollSnaps,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CustomCarouselContext.Provider>
    )
  }
)
CustomCarousel.displayName = 'CustomCarousel'

const CustomCarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCustomCarousel()

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div ref={ref} className={cn('flex', orientation === 'horizontal' ? '' : 'flex-col', className)} {...props} />
      </div>
    )
  }
)
CustomCarouselContent.displayName = 'CustomCarouselContent'

const CustomCarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { index?: number }>(
  ({ className, index, ...props }, ref) => {
    const { orientation, selectedIndex } = useCustomCarousel()
    const isSelected = selectedIndex === index

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-auto mx-2 transition-all duration-300',
          orientation === 'horizontal' ? '' : 'pt-4',
          isSelected ? 'z-10' : 'opacity-90',
          className
        )}
        style={{
          width: isSelected ? 'auto' : undefined,
          height: 'auto',
          transition: 'all 0.3s ease',
        }}
        {...props}
      />
    )
  }
)
CustomCarouselItem.displayName = 'CustomCarouselItem'

const CustomCarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCustomCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === 'horizontal'
            ? 'left-4 top-1/2 -translate-y-1/2 z-10'
            : '-top-8 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        onClick={scrollPrev}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  }
)
CustomCarouselPrevious.displayName = 'CustomCarouselPrevious'

const CustomCarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCustomCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === 'horizontal'
            ? 'right-4 top-1/2 -translate-y-1/2 z-10'
            : '-bottom-8 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        onClick={scrollNext}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  }
)
CustomCarouselNext.displayName = 'CustomCarouselNext'

export {
  type CarouselApi,
  CustomCarousel,
  CustomCarouselContent,
  CustomCarouselItem,
  CustomCarouselPrevious,
  CustomCarouselNext,
}
