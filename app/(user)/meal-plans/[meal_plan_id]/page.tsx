import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/app/(user)/_components/header'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { getMealPlan } from '@/network/server/meal-plans'
import ActionButtons from './ActionButtons'
export default async function MealPlanPage({ params }: { params: Promise<{ meal_plan_id: string }> }) {
  try {
    const { meal_plan_id } = await params
    const { data: mealPlan } = await getMealPlan(meal_plan_id)

    if (!mealPlan) {
      throw new Error('Không tìm thấy thông tin thực đơn')
    }

    return (
      <div className="max-w-screen-[1800px] mx-auto">
        <div className="xl:block max-lg:hidden">
          <Header />
        </div>
        <Link href="/meal-plans" className="mt-8 ml-10">
          <Button className="flex items-center gap-2 text-xl bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent  text-black shadow-none">
            <BackIconBlack /> Quay về
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center mt-16 max-lg:mt-0 mx-auto max-w-[1800px] mb-20">
          <div className="relative w-full">
            <img
              src={mealPlan.image}
              alt="Menu detail image"
              className="xl:block max-lg:hidden w-full h-[681px] object-cover rounded-xl"
            />
          </div>
          <div className="mr-auto text-xl mt-8 max-lg:p-4">
            <p className="font-bold">{mealPlan.meal_plan_goal?.name}</p>
            <p className="text-[#737373]">{mealPlan.title}</p>
            <div className="flex items-center gap-2">
              <p className="text-[#737373]">Chef {mealPlan.chef_name}</p>
              {mealPlan.number_of_days > 0 && <p className="text-[#737373]">{mealPlan.number_of_days} ngày</p>}
            </div>
          </div>
          <div className="w-full max-lg:p-4">
            <div className="bg-primary py-12 w-full rounded-[20px] my-20 max-lg:my-2">
              <div className="xl:px-20 max-lg:w-full mx-auto text-white h-full flex flex-col items-center justify-center">
                <p className="text-[#F7F7F7] text-xl list-disc mr-auto max-lg:px-8">{mealPlan.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="mr-auto text-xl my-20 max-lg:my-0 max-lg:p-4">
            <div className="font-[family-name:var(--font-coiny)] font-bold text-ring text-[40px] max-lg:text-[30px] mb-5">
              Thông tin thực đơn
            </div>
            <div className="max-lg:text-base">{mealPlan.description}</div>
          </div>
          <div className="mr-auto text-xl mt-10 w-full max-lg:p-4">
            <div className="font-[family-name:var(--font-coiny)] font-bold text-ring text-[40px] max-lg:text-[30px] mb-5">
              Thành phần chính
            </div>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {mealPlan.meal_ingredients.map((ingredient) => (
                  <CarouselItem key={ingredient.name} className="max-lg:basis-1/3 xl:basis-[11%]">
                    <div className="w-[168px]">
                      <img
                        src={ingredient.image}
                        alt={ingredient.name}
                        className="w-[168px] h-[175px] object-cover rounded-xl"
                      />
                      <div className="text-lg max-lg:text-base w-full">{ingredient.name}</div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <ActionButtons mealPlanId={mealPlan.id} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching meal plan:', error)

    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Đã có lỗi xảy ra</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Không thể tải thông tin thực đơn'}
        </p>
      </div>
    )
  }
}
