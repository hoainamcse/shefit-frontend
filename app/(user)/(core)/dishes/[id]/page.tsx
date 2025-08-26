'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getDish } from '@/network/server/dishes'
import ActionButtons from './_components/action-buttons'
import Link from 'next/link'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { useSearchParams } from 'next/navigation'
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải video...</p>
    </div>
  ),
})

export default function MealDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ diet_id: string }>
}) {
  const [dish, setDish] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dishId, setDishId] = useState<string>('')
  const [dietId, setDietId] = useState<string>('')
  const _searchParams = useSearchParams()
  const back = _searchParams.get('back') || ''

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const { id: dish_id } = await params
        const { diet_id } = await searchParams
        setDishId(dish_id)
        setDietId(diet_id)
      } catch (err) {
        console.error('Error unwrapping params:', err)
        setError('Lỗi khi tải thông tin món ăn')
        setLoading(false)
      }
    }

    unwrapParams()
  }, [params])

  useEffect(() => {
    if (!dishId) return

    const fetchDish = async () => {
      try {
        const response = await getDish(dishId)
        setDish(response.data)
      } catch (err) {
        console.error('Error fetching dish:', err)
        setError('Không thể tải thông tin món ăn')
      } finally {
        setLoading(false)
      }
    }

    fetchDish()
  }, [dishId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!dish) {
    return (
      <div className="text-center py-10">
        <p>Không tìm thấy thông tin món ăn</p>
      </div>
    )
  }
  console.log(dish)
  return (
    <div className="flex flex-col p-4 md:pt-10 lg:pt-[69px]">
      <Link
        href={back || `/dishes?diet_id=${dietId}`}
        className="flex cursor-pointer items-center gap-2.5 font-semibold lg:hidden md:mb-7 mb-2"
      >
        <div className="w-6 h-6 pt-1 flex justify-center">
          <BackIconBlack />
        </div>
        Quay về
      </Link>

      <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-4 sm:mb-10 lg:mb-[87px] md:text-center">
        {dish?.name}
      </div>

      {dish?.youtube_url ? (
        <div className="w-full aspect-square lg:aspect-[1800/681] bg-black rounded-[20px] overflow-hidden mb-5">
          <div className="w-full h-full">
            <ReactPlayer
              url={dish.youtube_url}
              width="100%"
              height="100%"
              controls
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    origin: typeof window !== 'undefined' ? window.location.origin : '',
                  },
                },
              }}
              style={{
                aspectRatio: '16/9',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
      ) : dish?.image ? (
        <div className="w-full bg-black rounded-[20px] overflow-hidden mb-5 aspect-square sm:aspect-[1800/681]">
          <img src={dish.image} alt="" className="object-cover rounded-[20px] w-full h-full" />
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <div className="font-medium text-sm lg:text-lg">{dish?.name}</div>
          <div className="text-[#737373] text-sm lg:text-lg">
            <div className="flex flex-wrap gap-4">
              <p>Dinh dưỡng: {dish.nutrients}</p>
            </div>
          </div>
        </div>

        {dish?.description && (
          <div>
            <h3 className="font-semibold text-sm lg:text-lg">Mô tả:</h3>
            <p className="text-[#737373] text-sm lg:text-lg whitespace-pre-line">{dish.description}</p>
          </div>
        )}
        <ActionButtons dishID={dish.id} />
      </div>
    </div>
  )
}
