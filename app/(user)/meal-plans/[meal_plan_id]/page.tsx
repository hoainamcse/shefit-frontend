import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
      <div className="flex flex-col  mx-auto max-w-[1800px] ">
        <Link href="/meal-plans">
          <Button className="flex items-center gap-2 text-xl bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent  text-black shadow-none">
            <BackIconBlack /> Quay về
          </Button>
        </Link>

        <div className="items-center justify-center mb-20 mt-5 p-2 xl:p-4">
          <img
            src={mealPlan.image}
            alt="Menu detail image"
            className="w-full aspect-[440/281] object-cover block lg:hidden rounded-md lg:rounded-xl"
          />
          <img
            src={mealPlan.image}
            alt="Menu detail image"
            className="w-full aspect-[1800/681] object-cover rounded-sm lg:rounded-xl md:rounded-md hidden lg:block"
          />
          <div className="mr-auto text-xl mt-8 max-lg:p-4">
            <p className="font-bold text-base lg:text-xl">{mealPlan.meal_plan_goal?.name}</p>
            <p className="text-[#737373] text-base lg:text-xl">{mealPlan.title}</p>
            <div className="flex items-center gap-2">
              <p className="text-[#737373] text-base lg:text-xl">Chef {mealPlan.chef_name}</p>
              {mealPlan.number_of_days > 0 && (
                <p className="text-[#737373] text-base lg:text-xl">{mealPlan.number_of_days} ngày</p>
              )}
            </div>
          </div>
          <div className="w-full max-lg:p-4">
            <div className="bg-primary lg:py-10 py-4 w-full rounded-[20px] my-20 max-lg:my-2">
              <p className="font-bold text-xl lg:text-2xl text-white text-center mb-2">Kết quả</p>
              <ul className="xl:px-20 max-lg:w-full mx-auto text-white h-full flex flex-col items-start list-disc pl-5">
                {mealPlan.subtitle.split('\n').map((line, index) => (
                  <li key={index} className="text-[#F7F7F7] text-base lg:text-xl mb-1">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mr-auto text-xl my-20 max-lg:my-0 max-lg:p-4">
            <div className="font-[family-name:var(--font-coiny)] font-bold text-ring text-3xl lg:text-[40px] max-lg:text-[30px] mb-5">
              Thông tin thực đơn
            </div>
            <div className="text-[#737373] lg:text-xl">{mealPlan.description}</div>
          </div>
          <div className="mr-auto text-xl mt-10 w-full max-lg:p-4">
            <div className="font-[family-name:var(--font-coiny)] font-bold text-ring text-3xl lg:text-[40px] max-lg:text-[30px] mb-5">
              Thành phần chính
            </div>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent className="gap-x-4">
                {mealPlan.meal_ingredients.map((ingredient) => (
                  <CarouselItem key={ingredient.name} className="basis-auto" style={{ width: '168px' }}>
                    <div className="flex flex-col items-center">
                      <div className="w-[168px] h-[175px] overflow-hidden rounded-xl">
                        <img
                          src={ingredient.image}
                          alt={ingredient.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="text-lg max-lg:text-base font-medium w-full text-center mt-2 truncate">
                        {ingredient.name}
                      </div>
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
