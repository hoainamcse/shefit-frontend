'use client'
import {
  getFavouriteExercises,
  getFavouriteCourses,
  getFavouriteMealPlans,
  getFavouriteDishes,
  deleteFavouriteDish,
  deleteFavouriteExercise,
  deleteFavouriteMealPlan,
  deleteFavouriteCourse,
} from '@/network/client/user-favourites'
import { FavouriteExercise, FavouriteMealPlan, FavouriteDish } from '@/models/favourite'
import { Exercise } from '@/models/exercise'
import { useSession } from '@/hooks/use-session'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCourse } from '@/network/client/courses'
import { Course } from '@/models/course'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import { Button } from '@/components/ui/button'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { getExerciseById } from '@/network/server/exercises'
import { getMealPlan } from '@/network/server/meal-plans'
import { getDish } from '@/network/server/dishes'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { DeleteIconMini } from '@/components/icons/DeleteIconMini'
import { toast } from 'sonner'

export default function FavouriteContent() {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoadingExercises, setIsLoadingExercises] = useState(true)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(true)
  const [isLoadingDishes, setIsLoadingDishes] = useState(true)
  const [exercises, setExercises] = useState<FavouriteExercise[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [mealPlans, setMealPlans] = useState<FavouriteMealPlan[]>([])
  const [dishes, setDishes] = useState<FavouriteDish[]>([])

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }

  const handleDeleteFavouriteDish = async (dishId: number, dishTitle: string) => {
    if (!session?.userId) return

    try {
      await deleteFavouriteDish(session.userId, dishId.toString())

      setDishes((prev) => prev.filter((item) => item.dish.id !== dishId))

      toast.success(`Đã xóa ${dishTitle} khỏi danh sách yêu thích`)
    } catch (error) {
      console.error('Error deleting favourite dish:', error)
      toast.error('Có lỗi xảy ra khi xóa món ăn')
    }
  }

  const handleDeleteFavouriteExercise = async (exerciseId: number, exerciseTitle: string) => {
    if (!session?.userId) return

    try {
      await deleteFavouriteExercise(session.userId, exerciseId.toString())

      setExercises((prev) => prev.filter((item) => item.exercise.id !== exerciseId))

      toast.success(`Đã xóa ${exerciseTitle} khỏi danh sách yêu thích`)
    } catch (error) {
      console.error('Error deleting favourite exercise:', error)
      toast.error('Có lỗi xảy ra khi xóa động tác')
    }
  }

  const handleDeleteFavouriteMealPlan = async (mealPlanId: number, mealPlanTitle: string) => {
    if (!session?.userId) return

    try {
      await deleteFavouriteMealPlan(session.userId, mealPlanId.toString())

      setMealPlans((prev) => prev.filter((item) => item.meal_plan.id !== mealPlanId))

      toast.success(`Đã xóa ${mealPlanTitle} khỏi danh sách yêu thích`)
    } catch (error) {
      console.error('Error deleting favourite meal plan:', error)
      toast.error('Có lỗi xảy ra khi xóa thực đơn')
    }
  }

  const handleDeleteFavouriteCourse = async (courseId: number, courseTitle: string) => {
    if (!session?.userId) return

    try {
      await deleteFavouriteCourse(session.userId, courseId.toString())

      setCourses((prev) => prev.filter((course) => course.id !== courseId))

      toast.success(`Đã xóa ${courseTitle} khỏi danh sách yêu thích`)
    } catch (error) {
      console.error('Error deleting favourite course:', error)
      toast.error('Có lỗi xảy ra khi xóa khóa học')
    }
  }

  useEffect(() => {
    const fetchFavouriteExercises = async () => {
      if (!session?.userId) {
        setIsLoadingExercises(false)
        return
      }

      try {
        setIsLoadingExercises(true)
        const response = await getFavouriteExercises(session.userId)

        if (!response.data || response.data.length === 0) {
          setExercises([])
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
            const response = await getExerciseById(exerciseId)
            if (response && response.status === 'success' && response.data) {
              return response.data
            }
            return null
          } catch (error) {
            console.error(`Error fetching exercise ${fav.exercise_id}:`, error)
            return null
          }
        })

        const exercisesData = await Promise.all(exercisePromises)
        const validExercises = exercisesData
          .filter((exercise): exercise is Exercise => exercise !== null)
          .map(
            (exercise) =>
              ({
                id: exercise.id,
                user_id: Number(session.userId),
                exercise: exercise,
                youtube_url: exercise.youtube_url || '',
                name: exercise.name || 'Unnamed Exercise',
              } as FavouriteExercise)
          )
        setExercises(validExercises)
      } catch (error) {
        console.error('Error in fetchFavouriteExercises:', error)
      } finally {
        setIsLoadingExercises(false)
      }
    }

    fetchFavouriteExercises()
  }, [session?.userId])

  useEffect(() => {
    const fetchFavouriteCourses = async () => {
      if (!session?.userId) {
        setIsLoadingCourses(false)
        return
      }

      try {
        setIsLoadingCourses(true)
        const response = await getFavouriteCourses(session.userId)
        console.log('Favorites response:', response)

        if (!response.data || response.data.length === 0) {
          setCourses([])
          return
        }

        const favoriteCourses = response.data
          .map((fav: any) => ({
            id: fav.course?.id,
            course_id: fav.course_id || fav.course?.id,
          }))
          .filter((fav: any) => fav.course_id)

        const coursePromises = favoriteCourses.map(async (fav: any) => {
          try {
            const courseId = typeof fav.course_id === 'string' ? parseInt(fav.course_id, 10) : fav.course_id
            const response = await getCourse(courseId)

            if (response && response.status === 'success' && response.data) {
              return response.data
            }
            return null
          } catch (error) {
            console.error(`Error fetching course ${fav.course_id}:`, error)
            return null
          }
        })

        const courses = (await Promise.all(coursePromises)).filter(Boolean)
        setCourses(courses as Course[])
      } catch (error) {
        console.error('Error in fetchFavouriteCourses:', error)
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchFavouriteCourses()
  }, [session?.userId])

  useEffect(() => {
    const fetchFavouriteMealPlans = async () => {
      if (!session?.userId) {
        setIsLoadingMealPlans(false)
        return
      }

      try {
        setIsLoadingMealPlans(true)
        const response = await getFavouriteMealPlans(session.userId)

        if (!response.data || response.data.length === 0) {
          setMealPlans([])
          return
        }

        const favoriteMealPlans = response.data
          .map((fav: any) => ({
            id: fav.meal_plan?.id || fav.meal_plan_id,
            meal_plan_id: fav.meal_plan_id || fav.meal_plan?.id,
          }))
          .filter((fav: any) => fav.meal_plan_id)

        const mealPlanPromises = favoriteMealPlans.map(async (fav: any) => {
          try {
            const mealPlanId = typeof fav.meal_plan_id === 'string' ? parseInt(fav.meal_plan_id, 10) : fav.meal_plan_id

            const response = await getMealPlan(mealPlanId)
            if (response && response.status === 'success' && response.data) {
              return {
                user_id: Number(session.userId),
                meal_plan: {
                  ...response.data,
                  id: mealPlanId,
                  name: response.data.title,
                  assets: response.data.assets,
                  summary: response.data.subtitle,
                  trainer: response.data.chef_name,
                  duration_weeks: response.data.number_of_days ? Math.ceil(response.data.number_of_days / 7) : 1,
                },
              }
            }
            return null
          } catch (error) {
            console.error(`Error fetching meal plan ${fav.meal_plan_id}:`, error)
            return null
          }
        })

        const mealPlans = (await Promise.all(mealPlanPromises)).filter(Boolean)
        setMealPlans(mealPlans as FavouriteMealPlan[])
      } catch (error) {
        console.error('Error in fetchFavouriteMealPlans:', error)
      } finally {
        setIsLoadingMealPlans(false)
      }
    }

    fetchFavouriteMealPlans()
  }, [session?.userId])

  useEffect(() => {
    const fetchFavouriteDishes = async () => {
      if (!session?.userId) {
        setIsLoadingDishes(false)
        return
      }

      try {
        setIsLoadingDishes(true)
        const response = await getFavouriteDishes(session.userId)

        if (!response.data || response.data.length === 0) {
          setDishes([])
          return
        }

        const favoriteDishes = response.data
          .map((fav: any) => ({
            id: fav.dish?.id || fav.dish_id,
            dish_id: fav.dish_id || fav.dish?.id,
          }))
          .filter((fav: any) => fav.dish_id)

        const dishPromises = favoriteDishes.map(async (fav: any) => {
          try {
            const dishId = typeof fav.dish_id === 'string' ? parseInt(fav.dish_id, 10) : fav.dish_id

            const response = await getDish(dishId)
            if (response && response.status === 'success' && response.data) {
              return {
                id: dishId,
                title: response.data.name,
                image: response.data.image,
                user_id: Number(session.userId),
                dish: response.data,
              }
            }
            return null
          } catch (error) {
            console.error(`Error fetching dish ${fav.dish_id}:`, error)
            return null
          }
        })

        const dishes = (await Promise.all(dishPromises)).filter(Boolean)
        setDishes(dishes as FavouriteDish[])
      } catch (error) {
        console.error('Error in fetchFavouriteDishes:', error)
      } finally {
        setIsLoadingDishes(false)
      }
    }

    fetchFavouriteDishes()
  }, [session?.userId])

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
          {isLoadingCourses ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="group">
                <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
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
          {isLoadingMealPlans ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : mealPlans.length > 0 ? (
            mealPlans.map(({ meal_plan }) => (
              <Link href={`/meal-plans/${meal_plan.id}`} key={meal_plan.id}>
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
          {isLoadingExercises ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : exercises.length > 0 ? (
            exercises.map((exercise) => (
              <Link
                href={`/gallery/exercises/${exercise.id}?muscle_group_id=${
                  exercise.exercise?.muscle_groups?.[0]?.id || ''
                }`}
                key={exercise.id}
              >
                <div>
                  <div className="relative group lg:max-w-[585px]">
                    <div className="absolute lg:top-4 lg:right-4 z-10 top-2 right-2">
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleDeleteFavouriteExercise(exercise.id, exercise.exercise?.name || '')
                        }}
                        className="lg:block hidden"
                      >
                        <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleDeleteFavouriteExercise(exercise.id, exercise.exercise?.name || '')
                        }}
                        className="lg:hidden block"
                      >
                        <DeleteIconMini className="text-white hover:text-red-500 transition-colors duration-300" />
                      </div>
                    </div>
                    <img
                      src={
                        getYouTubeThumbnail(exercise.exercise.youtube_url) ||
                        'https://placehold.co/400?text=shefit.vn&font=Oswald'
                      }
                      alt={exercise.exercise?.name || ''}
                      className="md:aspect-[585/373] aspect-square object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <p className="font-medium text-sm lg:text-lg">{exercise.exercise?.name}</p>
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
          {isLoadingDishes ? (
            <div className="flex justify-center items-center h-40 col-span-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : dishes.length > 0 ? (
            dishes.map((dish) => (
              <Link
                href={`/gallery/dishes/${dish.id}?diet_id=${dish.dish?.diet?.id || ''}`}
                key={dish.id}
                onClick={(e) => {
                  if (!dish.dish?.diet?.id) {
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
                        handleDeleteFavouriteDish(dish.id, dish.title)
                      }}
                      className="lg:block hidden"
                    >
                      <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleDeleteFavouriteDish(dish.id, dish.title)
                      }}
                      className="lg:hidden block"
                    >
                      <DeleteIconMini className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                  </div>
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="md:aspect-[585/373] aspect-square object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <p className="font-medium text-sm lg:text-lg">{dish.title}</p>
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
