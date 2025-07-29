'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSubscription } from './SubscriptionContext'
import { useSession } from '@/hooks/use-session'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { getExercises, getExerciseById } from '@/network/server/exercises'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import type { Exercise } from '@/models/exercise'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { getFavouriteExercises } from '@/network/client/user-favourites'
import { FavouriteExercise } from '@/models/favourite'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DeleteIconMini } from '@/components/icons/DeleteIconMini'

export default function ListExercises() {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [favoriteExercises, setFavoriteExercises] = useState<FavouriteExercise[]>([])
  const [combinedExercises, setCombinedExercises] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isSubscriptionExpired = useMemo(() => {
    if (!selectedSubscription?.subscription_end_at) return true
    const endDate = new Date(selectedSubscription.subscription_end_at)
    return new Date() > endDate
  }, [selectedSubscription])

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }

  useEffect(() => {
    if (!selectedSubscription?.exercises?.length) {
      setExercises([])
    } else {
      const fetchExercises = async () => {
        try {
          setIsLoading(true)
          const subscriptionExerciseIds = selectedSubscription.exercises.map((ex: any) =>
            typeof ex === 'object' ? ex.id : ex
          )

          const exercisePromises = subscriptionExerciseIds.map(async (exerciseId: number | string) => {
            const response = await getExerciseById(exerciseId.toString())
            return response?.status === 'success' ? response.data : null
          })

          const exerciseDetails = await Promise.all(exercisePromises)
          const filteredExercises = exerciseDetails.filter(Boolean) as Exercise[]
          setExercises(filteredExercises)
        } catch (error) {
          console.error('Error fetching exercises:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchExercises()
    }
  }, [selectedSubscription?.exercises])

  useEffect(() => {
    const fetchFavoriteExercises = async () => {
      if (!session?.userId) {
        return
      }

      try {
        const response = await getFavouriteExercises(session.userId)

        if (!response.data || response.data.length === 0) {
          setFavoriteExercises([])
          return
        }

        const favoriteExercises = response.data
          .map((fav: any) => ({
            id: fav.exercise?.id || fav.exercise_id,
            exercise_id: fav.exercise_id || fav.exercise?.id,
          }))
          .filter((fav: any) => fav.exercise_id)

        const exercisePromises = favoriteExercises.map(async (fav: any) => {
          try {
            const exerciseId = typeof fav.exercise_id === 'string' ? parseInt(fav.exercise_id, 10) : fav.exercise_id

            const response = await getExerciseById(exerciseId.toString())
            if (response && response.status === 'success' && response.data) {
              return {
                id: exerciseId,
                name: response.data.name,
                youtube_url: response.data.youtube_url,
                user_id: Number(session.userId),
                exercise: response.data,
                muscle_groups: response.data.muscle_groups,
              }
            }
            return null
          } catch (error) {
            console.error(`Error fetching exercise ${fav.exercise_id}:`, error)
            return null
          }
        })

        const exercises = (await Promise.all(exercisePromises)).filter(Boolean)
        setFavoriteExercises(exercises as FavouriteExercise[])
      } catch (error) {
        console.error('Error in fetchFavoriteExercises:', error)
      }
    }

    fetchFavoriteExercises()
  }, [session?.userId])

  useEffect(() => {
    setIsLoading(true)

    const exercisesMap = new Map()

    exercises.forEach((exercise) => {
      exercisesMap.set(exercise.id, exercise)
    })

    favoriteExercises.forEach((exercise) => {
      if (!exercisesMap.has(exercise.id)) {
        exercisesMap.set(exercise.id, exercise)
      }
    })

    const combined = Array.from(exercisesMap.values())
    setCombinedExercises(combined)
    setIsLoading(false)
  }, [exercises, favoriteExercises])

  if (!session) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#13D8A7] text-white lg:text-lg text-sm w-full rounded-full h-14 mt-6 ">
            Thêm động tác
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-lg lg:text-xl font-bold">
              VUI LÒNG ĐĂNG NHẬP VÀ MUA GÓI
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-sm lg:text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg" onClick={handleBuyPackageClick}>
                  Mua gói
                </Button>
              </div>
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg" onClick={handleLoginClick}>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
      </div>
    )
  }

  if (combinedExercises.length === 0) {
    return (
      <Link href="/gallery">
        <Button className="bg-[#13D8A7] text-white lg:text-lg text-sm w-full rounded-full h-14">Thêm động tác</Button>
      </Link>
    )
  }

  return (
    <div className="space-y-6">
      <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center"></DialogTitle>
            <DialogDescription className="text-center text-sm lg:text-lg text-[#737373]">
              GÓI ĐÃ HẾT HẠN HÃY GIA HẠN GÓI ĐỂ TIẾP TỤC TRUY CẬP
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="default"
              className="bg-[#13D8A7] hover:bg-[#0fb88e] text-white rounded-full w-full h-14 text-sm lg:text-lg"
              onClick={() => {
                setRenewDialogOpen(false)
                if (selectedSubscription?.subscription?.id) {
                  router.push(`/packages/detail/${selectedSubscription.subscription.id}`)
                }
              }}
            >
              Gia hạn gói
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {selectedVideoUrl && (
            <iframe
              src={selectedVideoUrl.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              className="w-full aspect-video"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-3 lg:gap-6 gap-4 mx-auto mt-6 text-base lg:text-lg">
        {combinedExercises.map((exercise) => (
          <div key={exercise.id} className="group">
            <Link
              href={
                isSubscriptionExpired
                  ? '#'
                  : `/gallery/muscle/${exercise.muscle_groups?.[0]?.id || exercise.muscle?.id || ''}/${exercise.id}`
              }
              onClick={
                isSubscriptionExpired
                  ? (e) => {
                      e.preventDefault()
                      setRenewDialogOpen(true)
                    }
                  : undefined
              }
            >
              <div>
                <div className="relative group lg:max-w-[585px]">
                  {isSubscriptionExpired && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50 rounded-xl">
                      <Lock className="text-white w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute lg:top-4 lg:right-4 z-10 top-2 right-2">
                    <div className="lg:block hidden">
                      <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                    <div className="lg:hidden block">
                      <DeleteIconMini className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                  </div>
                  <img
                    src={
                      getYouTubeThumbnail(exercise.youtube_url) || 'https://placehold.co/400?text=shefit.vn&font=Oswald'
                    }
                    alt={exercise.name}
                    className="md:aspect-[585/373] aspect-square object-cover rounded-xl mb-4 w-full"
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  {selectedSubscription?.status !== 'expired' && (
                    <button
                      className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedVideoUrl(exercise.youtube_url)
                        setDialogOpen(true)
                      }}
                    ></button>
                  )}
                </div>
                <p className="font-medium text-sm lg:text-lg">{exercise.name}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/gallery">
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 text-sm lg:text-lg lg:mt-12 mt-6">
            Thêm động tác
          </Button>
        </Link>
      </div>
    </div>
  )
}
