'use client'

import {
  getFavouriteExercises,
  getFavouriteCourses,
  getFavouriteMealPlans,
  getFavouriteDishes,
  removeFavouriteDish,
  removeFavouriteExercise,
  removeFavouriteMealPlan,
  removeFavouriteCourse,
} from '@/network/client/user-favourites'
import type { User } from '@/models/user'
import type { MealPlan } from '@/models/meal-plan'
import type { Dish } from '@/models/dish'
import { Exercise } from '@/models/exercise'
import { useSession } from '@/hooks/use-session'
import { useState } from 'react'
import Link from 'next/link'
import { Course } from '@/models/course'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import { Button } from '@/components/ui/button'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { DeleteIconMini } from '@/components/icons/DeleteIconMini'
import { toast } from 'sonner'

export default function FavouriteContent() {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [dialogOpen, setDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('packages')
  }

  // Query for favourite data
  const queries = useQueries({
    queries: [
      {
        queryKey: ['favouriteExercises', session?.userId],
        queryFn: () => (session ? getFavouriteExercises(session.userId) : Promise.resolve(null)),
        enabled: !!session,
      },
      {
        queryKey: ['favouriteCourses', session?.userId],
        queryFn: () => (session ? getFavouriteCourses(session.userId) : Promise.resolve(null)),
        enabled: !!session,
      },
      {
        queryKey: ['favouriteMealPlans', session?.userId],
        queryFn: () => (session ? getFavouriteMealPlans(session.userId) : Promise.resolve(null)),
        enabled: !!session,
      },
      {
        queryKey: ['favouriteDishes', session?.userId],
        queryFn: () => (session ? getFavouriteDishes(session.userId) : Promise.resolve(null)),
        enabled: !!session,
      },
    ],
  })

  const [exerciseQuery, courseQuery, mealPlanQuery, dishQuery] = queries

  const exercises = exerciseQuery.data?.data || []
  const courses = courseQuery.data?.data || []
  const mealPlans = mealPlanQuery.data?.data || []
  const dishes = dishQuery.data?.data || []

  // Mutations for deleting favourites
  const deleteDishMutation = useMutation({
    mutationFn: ({ dishId, userId }: { dishId: Dish['id']; userId: User['id'] }) => removeFavouriteDish(userId, dishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favouriteDishes', session?.userId] })
    },
    onError: (error) => {
      console.error('Error deleting favourite dish:', error)
      toast.error('Có lỗi xảy ra khi xóa món ăn')
    },
  })

  const deleteExerciseMutation = useMutation({
    mutationFn: ({ exerciseId, userId }: { exerciseId: Exercise['id']; userId: User['id'] }) =>
      removeFavouriteExercise(userId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favouriteExercises', session?.userId] })
    },
    onError: (error) => {
      console.error('Error deleting favourite exercise:', error)
      toast.error('Có lỗi xảy ra khi xóa động tác')
    },
  })

  const deleteMealPlanMutation = useMutation({
    mutationFn: ({ mealPlanId, userId }: { mealPlanId: MealPlan['id']; userId: User['id'] }) =>
      removeFavouriteMealPlan(userId, mealPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favouriteMealPlans', session?.userId] })
    },
    onError: (error) => {
      console.error('Error deleting favourite meal plan:', error)
      toast.error('Có lỗi xảy ra khi xóa thực đơn')
    },
  })

  const deleteCourseMutation = useMutation({
    mutationFn: ({ courseId, userId }: { courseId: Course['id']; userId: User['id'] }) =>
      removeFavouriteCourse(userId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favouriteCourses', session?.userId] })
    },
    onError: (error) => {
      console.error('Error deleting favourite course:', error)
      toast.error('Có lỗi xảy ra khi xóa khóa học')
    },
  })

  const handleDeleteFavouriteDish = async (dishId: number, dishTitle: string) => {
    if (!session?.userId) return

    deleteDishMutation.mutate(
      { dishId: dishId, userId: session.userId },
      {
        onSuccess: () => {
          toast.success(`Đã xóa ${dishTitle} khỏi danh sách yêu thích`)
        },
      }
    )
  }

  const handleDeleteFavouriteExercise = async (exerciseId: number, exerciseTitle: string) => {
    if (!session?.userId) return

    deleteExerciseMutation.mutate(
      { exerciseId: exerciseId, userId: session.userId },
      {
        onSuccess: () => {
          toast.success(`Đã xóa ${exerciseTitle} khỏi danh sách yêu thích`)
        },
      }
    )
  }

  const handleDeleteFavouriteMealPlan = async (mealPlanId: number, mealPlanTitle: string) => {
    if (!session?.userId) return

    deleteMealPlanMutation.mutate(
      { mealPlanId: mealPlanId, userId: session.userId },
      {
        onSuccess: () => {
          toast.success(`Đã xóa ${mealPlanTitle} khỏi danh sách yêu thích`)
        },
      }
    )
  }

  const handleDeleteFavouriteCourse = async (courseId: number, courseTitle: string) => {
    if (!session?.userId) return

    deleteCourseMutation.mutate(
      { courseId: courseId, userId: session.userId },
      {
        onSuccess: () => {
          toast.success(`Đã xóa ${courseTitle} khỏi danh sách yêu thích`)
        },
      }
    )
  }

  if (!session) {
    return (
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-col gap-16">
              <div>
                <div className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
                  Khóa tập yêu thích
                </div>
                <p className="text-base text-muted-foreground">Các khóa tập bạn đã thêm vào mục Yêu Thích</p>
                <div className="text-gray-500 text-base lg:text-lg">Bạn chưa có khóa tập yêu thích nào</div>
                <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg">
                  Thêm khóa tập
                </Button>
              </div>
              <div>
                <div className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
                  Động tác yêu thích
                </div>
                <div className="text-gray-500 text-base lg:text-lg">Bạn chưa có động tác yêu thích nào</div>
                <p className="text-base text-muted-foreground">
                  Truy cập thư viện hơn 1000 động tác chia theo các nhóm cơ và lưu lại những động tác bạn muốn
                </p>
                <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg">
                  Thêm động tác
                </Button>
              </div>
              <div>
                <div className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
                  Thực đơn yêu thích
                </div>
                <p className="text-base text-muted-foreground">
                  Bạn có thể chọn trong nhiều loại thực đơn đa dạng. Để biết bạn phù hợp thực đơn nào hãy làm Body Quiz
                  Bảng Câu Hỏi số đo body.
                </p>
                <div className="text-gray-500 text-base lg:text-lg">Bạn chưa có thực đơn yêu thích nào</div>
                <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg">
                  Thêm thực đơn
                </Button>
              </div>
              <div>
                <div className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
                  Món ăn yêu thích
                </div>
                <p className="text-base text-muted-foreground">
                  Truy cập thư viện hơn 200 món ăn chia theo các loại chế độ ăn và lưu lại những món ăn phù hợp
                </p>
                <div className="text-gray-500 text-base lg:text-lg">Bạn chưa có món ăn yêu thích nào</div>
                <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg">
                  Thêm món ăn
                </Button>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center text-center gap-6">
              <p className="text-sm lg:text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
              <div className="flex gap-4 justify-center w-full px-10">
                <div className="flex-1">
                  <Button
                    className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg"
                    onClick={handleBuyPackageClick}
                  >
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
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div>
        <div className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
          Khóa tập yêu thích
        </div>
        <p className="text-base text-muted-foreground">Các khóa tập bạn đã thêm vào mục Yêu Thích</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-sm lg:text-lg">
          {courseQuery.isLoading ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="group">
                <Link href={`/courses/${course.id}?back=%2Faccount%2Fresources`}>
                  <div>
                    <div className="relative group lg:max-w-[585px]">
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleDeleteFavouriteCourse(course.id, course.course_name)
                        }}
                        className="absolute top-4 right-4 z-10"
                      >
                        <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                      </div>
                      <img
                        src={course.assets.thumbnail}
                        alt={course.course_name}
                        className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                      />
                      <div className="bg-[#00000033] group-hover:bg-[#00000055] absolute inset-0 transition-all duration-300 rounded-xl" />
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm lg:text-lg">{course.course_name}</p>
                        <div className="flex gap-2">
                          <p className="text-[#737373] text-sm lg:text-lg">{course.trainer}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end flex-col items-end text-sm lg:text-lg">
                        {course.form_categories?.map((cat) => cat.name).join(', ')}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8 text-sm lg:text-lg">
              Chưa có khóa tập yêu thích
            </div>
          )}
        </div>
        <Link href="/courses">
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg lg:mt-12">
            Thêm khóa tập
          </Button>
        </Link>
      </div>
      <div className="space-y-6 mt-12">
        <h2 className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
          Thực đơn yêu thích
        </h2>
        <p className="text-base text-muted-foreground">
          Bạn có thể chọn trong nhiều loại thực đơn đa dạng. Để biết bạn phù hợp thực đơn nào hãy làm Body Quiz Bảng Câu
          Hỏi số đo body.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-sm lg:text-lg">
          {mealPlanQuery.isLoading ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : mealPlans.length > 0 ? (
            mealPlans.map((meal_plan) => (
              <Link href={`/meal-plans/${meal_plan.id}?back=%2Faccount%2Fresources`} key={meal_plan.id}>
                <div className="relative group lg:max-w-[585px]">
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleDeleteFavouriteMealPlan(meal_plan.id, meal_plan.title)
                    }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                  </div>
                  <img
                    src={meal_plan.assets.thumbnail}
                    alt={meal_plan.title}
                    className="aspect-[5/3] object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <p className="font-medium text-sm lg:text-lg">{meal_plan.title}</p>
                <p className="text-[#737373] text-sm lg:text-lg">{meal_plan.subtitle}</p>
                <p className="text-[#737373] text-sm lg:text-lg">
                  {meal_plan.chef_name} - {meal_plan.number_of_days} ngày
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8 text-sm lg:text-lg">
              Chưa có thực đơn yêu thích
            </div>
          )}
        </div>
        <Link href="/meal-plans">
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 text-sm lg:text-lg lg:mt-12 mt-6">
            Thêm thực đơn
          </Button>
        </Link>
      </div>

      <div className="space-y-6 mt-12">
        <h2 className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
          Động tác yêu thích
        </h2>
        <p className="text-base text-muted-foreground">
          Truy cập thư viện hơn 1000 động tác chia theo các nhóm cơ và lưu lại những động tác bạn muốn
        </p>
        <div className="grid grid-cols-3 gap-6 mx-auto mt-6 text-sm lg:text-lg">
          {exerciseQuery.isLoading ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : exercises.length > 0 ? (
            exercises.map((exercise) => (
              <Link
                href={`/exercises/${exercise.id}?muscle_group_id=${exercise.muscle_groups?.[0]?.id || ''}&back=%2Faccount%2Fresources`}
                key={exercise.id}
              >
                <div>
                  <div className="relative group lg:max-w-[585px]">
                    <div className="absolute lg:top-4 lg:right-4 z-10 top-2 right-2">
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleDeleteFavouriteExercise(exercise.id, exercise.name || '')
                        }}
                        className="lg:block hidden"
                      >
                        <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleDeleteFavouriteExercise(exercise.id, exercise.name || '')
                        }}
                        className="lg:hidden block"
                      >
                        <DeleteIconMini className="text-white hover:text-red-500 transition-colors duration-300" />
                      </div>
                    </div>
                    <img
                      src={
                        getYouTubeThumbnail(exercise.youtube_url) ||
                        'https://placehold.co/400?text=shefit.vn&font=Oswald'
                      }
                      alt={exercise.name || ''}
                      className="md:aspect-[585/373] aspect-square object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <p className="font-medium text-sm lg:text-lg">{exercise.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8 text-sm lg:text-lg">
              Chưa có động tác yêu thích
            </div>
          )}
        </div>
        <Link href="/gallery">
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg lg:mt-12">
            Thêm động tác
          </Button>
        </Link>
      </div>

      <div className="space-y-6 mt-12">
        <h2 className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold">
          Món ăn yêu thích
        </h2>
        <p className="text-base text-muted-foreground">
          Truy cập thư viện hơn 200 món ăn chia theo các loại chế độ ăn và lưu lại những món ăn phù hợp
        </p>
        <div className="grid grid-cols-3 gap-6 mx-auto mt-6 text-sm lg:text-lg">
          {dishQuery.isLoading ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : dishes.length > 0 ? (
            dishes.map((dish) => (
              <Link
                href={`/dishes/${dish.id}?diet_id=${dish.diet?.id || ''}&back=%2Faccount%2Fresources`}
                key={dish.id}
                onClick={(e) => {
                  if (!dish.diet?.id) {
                    e.preventDefault()
                    alert('Diet information not available')
                  }
                }}
              >
                <div className="relative group lg:max-w-[585px]">
                  <div className="absolute lg:top-4 lg:right-4 z-10 top-2 right-2">
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleDeleteFavouriteDish(dish.id, dish.name)
                      }}
                      className="lg:block hidden"
                    >
                      <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleDeleteFavouriteDish(dish.id, dish.name)
                      }}
                      className="lg:hidden block"
                    >
                      <DeleteIconMini className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                  </div>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="md:aspect-[585/373] aspect-square object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <p className="font-medium text-sm lg:text-lg">{dish.name}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8 text-sm lg:text-lg">Chưa có món ăn yêu thích</div>
          )}
        </div>
        <Link href="/gallery#dishes">
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg lg:mt-12">
            Thêm món ăn
          </Button>
        </Link>
      </div>
    </div>
  )
}
