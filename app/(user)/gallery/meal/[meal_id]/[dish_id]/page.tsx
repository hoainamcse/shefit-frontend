'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getDish } from '@/network/server/dishes'
import ActionButtons from './ActionButtons'
const ReactPlayer = dynamic(() => import('react-player/lazy'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải video...</p>
    </div>
  ),
})

export default function MealDetail({ params }: { params: Promise<{ dish_id: string; meal_id: string }> }) {
  const [dish, setDish] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dishId, setDishId] = useState<string>('')

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params
        setDishId(resolvedParams.dish_id)
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

  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="font-[family-name:var(--font-coiny)] text-ring text-3xl lg:text-[40px] mb-5 text-center font-bold">
        {dish?.name}
      </div>

      {dish?.youtube_url && (
        <div className="w-full max-w-4xl mx-auto aspect-video bg-black rounded-lg overflow-hidden">
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
      )}

      <div className="flex flex-col gap-5">
        <div>
          <div className="font-medium text-xl lg:text-2xl">{dish?.name}</div>
          <div className="text-[#737373] mt-2">
            <div className="flex flex-wrap gap-4">
              <p>Dinh dưỡng: {dish.nutrients}</p>
            </div>
          </div>
        </div>

        {dish?.description && (
          <div className="mt-4">
            <h3 className="font-semibold text-xl mb-2 lg:text-2xl">Mô tả:</h3>
            <p className="text-[#737373]">{dish.description}</p>
          </div>
        )}
        <ActionButtons dishId={dish.id} />
      </div>
    </div>
  )
}
