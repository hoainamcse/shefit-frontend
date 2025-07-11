import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/app/(user)/_components/header'
import Link from 'next/link'
import { BackIcon } from '@/components/icons/BackIcon'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMealPlan } from '@/network/server/meal-plans'
import { getMealPlanDishes } from '@/network/server/meal-plans'
import { getMealPlanDays } from '@/network/server/meal-plans'
import { dishMealTimeLabel } from '@/lib/label'
import type { MealPlanDish } from '@/models/meal-plan'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

export default async function MealPlanDetailPage({ params }: { params: Promise<{ meal_plan_id: string }> }) {
  const { meal_plan_id } = await params
  const { data: mealPlanByDay } = await getMealPlanDays(meal_plan_id)
  const { data: mealPlan } = await getMealPlan(meal_plan_id)
  console.log(mealPlanByDay)

  const sortedMealPlanByDay = Array.isArray(mealPlanByDay)
    ? [...mealPlanByDay].sort((a, b) => a.day_number - b.day_number)
    : []

  return (
    <div className="max-w-screen-[1800px] mx-auto">
      <div className="xl:block max-lg:hidden">
        <Header />
      </div>
      <Link href={`/meal-plans/${meal_plan_id}`} className="mt-8 ml-10">
        <Button className="flex items-center gap-2 text-xl bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent  text-black shadow-none">
          <BackIconBlack /> Quay về
        </Button>
      </Link>
      <div className="flex flex-col items-center justify-center mt-16 max-lg:mt-0 mx-auto max-w-[1800px] mb-20">
        <div className="relative w-full">
          <img
            src={mealPlan.image}
            alt="Menu detail image"
            className="w-full lg:h-[681px] h-[281px] object-cover lg:rounded-xl rounded-none"
          />
        </div>
        {/* <div className="mr-auto mt-8 max-lg:p-4 text-base lg:text-xl">
          <p className="font-bold">{mealPlan.meal_plan_goal?.name}</p>
          <p className="text-[#737373]">{mealPlan.title}</p>
          <p className="text-[#737373]">Chef {mealPlan.chef_name}</p>
        </div> */}
        {/* <div className="w-full max-lg:p-4">
          <div className="bg-primary py-5 w-full rounded-[20px] my-20 max-lg:my-2">
            <div className="xl:w-[696px] max-lg:w-full mx-auto text-white h-full flex flex-col items-center justify-center">
              <div className="text-center text-xl lg:text-2xl font-bold mb-10">Kết quả</div>
              <ul className="text-[#F7F7F7] text-base lg:text-xl list-disc mr-auto max-lg:px-8">
                {mealPlan.meal_plan_goal?.name?.split('\n')?.map((subtitle, index) => (
                  <li key={index}>{subtitle}</li>
                ))}
              </ul>
            </div>
          </div>
        </div> */}
        <div className="mr-auto text-xl my-20 max-lg:my-0 max-lg:p-4">
          <div className="font-[family-name:var(--font-coiny)] font-bold text-ring text-[40px] max-lg:text-[30px] mb-5">
            Menu theo lịch
          </div>
          {/* <div>{mealPlan.description}</div> */}
        </div>
        <Tabs defaultValue="1" className="w-full h-full">
          <TabsList className="w-full flex-wrap justify-start bg-transparent p-0 h-full">
            {sortedMealPlanByDay.map((day: any) => (
              <TabsTrigger
                key={day.id}
                value={`${day.day_number}`}
                className="rounded-full mx-[10px] my-5 w-[63px] h-[64px] flex flex-col items-center justify-center font-medium text-xl cursor-pointer data-[state=active]:bg-[#91EBD5] data-[state=active]:text-white bg-transparent hover:bg-[#91EBD5]/10 transition-colors duration-200"
              >
                <div>
                  Ngày <br /> {day.day_number}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {await Promise.all(
            sortedMealPlanByDay.map(async (day: any) => {
              const dayId = day.id
              const { data: dayDishes } = await getMealPlanDishes(meal_plan_id, dayId)
              return (
                <TabsContent key={day.id} value={`${day.day_number}`}>
                  {dayDishes.length === 0 ? (
                    <div>Chưa có món ăn cho ngày này.</div>
                  ) : (
                    dayDishes.map((dish: MealPlanDish) => (
                      <div
                        key={dish.id}
                        className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4"
                      >
                        <div>
                          <div className="font-medium">
                            <span className="text-[#91EBD5]">{dishMealTimeLabel[dish.meal_time]}</span>: {dish.name}
                          </div>
                          <div className="text-[#737373]">Dinh dưỡng: {dish.nutrients}</div>
                        </div>
                        {/* <Table className="w-[400px] text-center border border-collapse">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="border text-center">Thành phần</TableHead>
                              <TableHead className="border text-center">Nguyên liệu</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="text-[#737373]">
                            <TableRow>
                              <TableCell className="border">Thịt cá</TableCell>
                              <TableCell className="border">{dish.protein_source}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border">Rau củ</TableCell>
                              <TableCell className="border">{dish.vegetable}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border">Tinh bột</TableCell>
                              <TableCell className="border">{dish.starch}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border">Gia vị</TableCell>
                              <TableCell className="border">{dish.spices}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border">Khác</TableCell>
                              <TableCell className="border">{dish.others}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table> */}
                        <div className="xl:w-full text-[#737373]">{dish.description}</div>
                      </div>
                    ))
                  )}
                </TabsContent>
              )
            })
          )}
        </Tabs>
      </div>
    </div>
  )
}
