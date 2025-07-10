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
  totalItems: number
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
    const [totalItems, setTotalItems] = React.useState(0)

    React.useEffect(() => {
      const countItems = () => {
        const childrenArray = React.Children.toArray(children)
        const carouselContent = childrenArray.find(
          (child) => React.isValidElement(child) && child.type === CustomCarouselContent
        )

        if (React.isValidElement(carouselContent)) {
          interface CarouselContentProps {
            children?: React.ReactNode
          }

          const contentProps = carouselContent.props as CarouselContentProps
          const items = React.Children.toArray(contentProps.children || [])
          setTotalItems(items.length)
        }
      }

      countItems()
    }, [children])

    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        loop: totalItems > 1,
        align: 'center',
        startIndex: 0,
        skipSnaps: false,
        containScroll: false,
        dragFree: false,
        inViewThreshold: 0.7,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    const onSelect = React.useCallback(
      (api: CarouselApi) => {
        if (!api) {
          return
        }

        if (totalItems > 1) {
          setCanScrollPrev(true)
          setCanScrollNext(true)
        } else {
          setCanScrollPrev(false)
          setCanScrollNext(false)
        }

        setSelectedIndex(api.selectedScrollSnap())
      },
      [totalItems]
    )

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
        onSelect(api)
      }

      onSelect(api)
      onInit()

      api.on('reInit', onInit)
      api.on('select', onSelect)

      if (totalItems > 0) {
        const middleIndex = Math.floor(totalItems / 2)

        setTimeout(() => {
          api.scrollTo(middleIndex, false)
          setSelectedIndex(middleIndex)
        }, 50)
      }

      return () => {
        api.off('select', onSelect)
        api.off('reInit', onInit)
      }
    }, [api, onSelect, totalItems])

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
          totalItems,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative w-full flex justify-center', className)}
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
    const { carouselRef, orientation, totalItems } = useCustomCarousel()

    return (
      <div ref={carouselRef} className="overflow-hidden w-full">
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? '' : 'flex-col',
            totalItems === 1 ? 'justify-center' : '',
            totalItems === 2 ? 'justify-start pl-[25%]' : '',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
CustomCarouselContent.displayName = 'CustomCarouselContent'

const CustomCarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { index?: number }>(
  ({ className, index, ...props }, ref) => {
    const { orientation, selectedIndex, totalItems } = useCustomCarousel()
    const isSelected = selectedIndex === index

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          'min-w-0 shrink-0 grow-0 transition-all duration-300',
          orientation === 'horizontal' ? 'mx-2' : 'pt-4',
          isSelected ? 'z-10' : 'opacity-90',
          totalItems <= 3 ? 'basis-auto' : 'basis-auto',
          className
        )}
        style={{
          width: isSelected ? 'auto' : undefined,
          height: 'auto',
          transition: 'all 0.3s ease',
          marginLeft: orientation === 'horizontal' ? '8px' : undefined,
          marginRight: orientation === 'horizontal' ? '8px' : undefined,
        }}
        {...props}
      />
    )
  }
)
CustomCarouselItem.displayName = 'CustomCarouselItem'

const CustomCarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, totalItems } = useCustomCarousel()

    if (totalItems <= 1) {
      return null
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full z-20',
          orientation === 'horizontal'
            ? 'left-4 top-1/2 -translate-y-1/2'
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
    const { orientation, scrollNext, totalItems } = useCustomCarousel()

    if (totalItems <= 1) {
      return null
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full z-20',
          orientation === 'horizontal'
            ? 'right-4 top-1/2 -translate-y-1/2'
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
