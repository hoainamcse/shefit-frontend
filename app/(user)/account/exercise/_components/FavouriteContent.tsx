'use client'
import { getFavouriteExercises } from '@/network/server/favourite-exercise'
import { getFavouriteCourses } from '@/network/server/favourite-course'
import { getFavouriteMealPlans } from '@/network/server/favourite-meal-plan'
import { getFavouriteDishes } from '@/network/server/favourite-dish'
import { FavouriteCourse, FavouriteExercise, FavouriteMealPlan, FavouriteDish } from '@/models/favourite'
import { Exercise } from '@/models/exercise'
import { useSession } from '@/components/providers/session-provider'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCourse } from '@/network/server/courses'
import { courseFormLabel } from '@/lib/label'
import { Course } from '@/models/course'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import { Button } from '@/components/ui/button'
import { getYoutubeThumbnail } from '@/lib/youtube'
import { getExerciseById } from '@/network/server/exercises'
import { getMealPlan } from '@/network/server/meal-plans'
import { getDish } from '@/network/server/dishes'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

export default function FavouriteContent() {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<FavouriteExercise[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [mealPlans, setMealPlans] = useState<FavouriteMealPlan[]>([])
  const [dishes, setDishes] = useState<FavouriteDish[]>([])

  // Handle login button click with redirect
  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  // Handle buy package button click with redirect
  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }

  useEffect(() => {
    const fetchFavouriteExercises = async () => {
      if (!session?.userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getFavouriteExercises(session.userId)
        console.log('Favorites exercises response:', response)

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
        console.log('Processed exercises:', validExercises)
        setExercises(validExercises)
      } catch (error) {
        console.error('Error in fetchFavouriteExercises:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavouriteExercises()
  }, [session?.userId])

  useEffect(() => {
    const fetchFavouriteCourses = async () => {
      if (!session?.userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
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
        setIsLoading(false)
      }
    }

    fetchFavouriteCourses()
  }, [session?.userId])

  useEffect(() => {
    const fetchFavouriteMealPlans = async () => {
      if (!session?.userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
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
                  cover_image: response.data.image,
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
        setIsLoading(false)
      }
    }

    fetchFavouriteMealPlans()
  }, [session?.userId])

  useEffect(() => {
    const fetchFavouriteDishes = async () => {
      if (!session?.userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
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
        setIsLoading(false)
      }
    }

    fetchFavouriteDishes()
  }, [session?.userId])

  if (!session) {
    return (
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm khóa tập</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center text-center gap-6">
              <p className="text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
              <div className="flex gap-4 justify-center w-full px-10">
                <div className="flex-1">
                  <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleBuyPackageClick}>
                    Mua gói
                  </Button>
                </div>
                <div className="flex-1">
                  <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div>
        <div className="text-3xl text-ring font-[family-name:var(--font-coiny)] hover:no-underline">
          Khóa tập của bạn
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="group">
                <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                  <div>
                    <div className="relative group">
                      <div className="absolute top-4 right-4 z-10">
                        <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                      </div>
                      <img
                        src={course.cover_image}
                        alt={course.course_name}
                        className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                      />
                      <div className="bg-[#00000033] group-hover:bg-[#00000055] absolute inset-0 transition-all duration-300 rounded-xl" />
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{course.course_name}</p>
                        <div className="flex gap-2">
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end flex-col items-end">
                        <p>{courseFormLabel[course.form_categories[0]]}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
        <Link href="/courses">
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm khóa tập</Button>
        </Link>
      </div>
      <div className="space-y-6 mt-12">
        <div className="text-3xl text-ring font-[family-name:var(--font-coiny)] hover:no-underline">Động tác</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
          {exercises.map((exercise) => (
            <Link href={`/gallery/muscle/${exercise.id}`} key={exercise.id}>
              <div key={exercise.id}>
                <div className="relative group">
                  <div className="absolute top-4 right-4 z-10">
                    <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                  </div>
                  <img
                    src={getYoutubeThumbnail(exercise.youtube_url)}
                    alt={exercise.name}
                    className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-medium">{exercise.name}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/gallery">
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm động tác</Button>
          </Link>
        </div>
      </div>
      <div className="space-y-6 mt-12">
        <h2 className="text-3xl text-ring font-[family-name:var(--font-coiny)] hover:no-underline">Thực đơn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
          {mealPlans.map(({ meal_plan }) => (
            <Link href={`/meal-plans/${meal_plan.id}`} key={meal_plan.id}>
              <div className="relative group">
                <div className="absolute top-4 right-4 z-10">
                  <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                </div>
                <img
                  src={meal_plan.image}
                  alt={meal_plan.title}
                  className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <p className="font-medium">{meal_plan.title}</p>
              <p className="text-[#737373]">{meal_plan.subtitle}</p>
              <p className="text-[#737373]">
                {meal_plan.chef_name} - {meal_plan.number_of_days} ngày
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/meal-plans">
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm thực đơn</Button>
          </Link>
        </div>
      </div>
      <div className="space-y-6 mt-12">
        <h2 className="text-3xl text-ring font-[family-name:var(--font-coiny)] hover:no-underline">Món ăn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
          {dishes.map((dish) => (
            <Link href={`/dishes/${dish.id}`} key={dish.id}>
              <div className="relative group">
                <div className="absolute top-4 right-4 z-10">
                  <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                </div>
                <img src={dish.image} alt={dish.title} className="aspect-[5/3] object-cover rounded-xl mb-4 w-full" />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <p className="font-medium">{dish.title}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/dishes">
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm món ăn</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
