import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { getMealPlan } from '@/network/server/meal-plans'
import ActionButtons from './ActionButtons'
import { HtmlContent } from '@/components/html-content'

export default async function MealPlanPage({ params }: { params: Promise<{ meal_plan_id: string }> }) {
  try {
    const { meal_plan_id } = await params
    const { data: mealPlan } = await getMealPlan(meal_plan_id)

    if (!mealPlan) {
      throw new Error('Không tìm thấy thông tin thực đơn')
    }

    return (
      <div>
        <div className="relative">
          <div className="flex flex-col lg:gap-10 gap-4 max-w-[1800px] w-full mx-auto z-10 absolute top-4 left-2 lg:left-20  md:hidden">
            <Link href="/meal-plans" className="flex items-center">
              <Button className="flex items-center gap-2 text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-black shadow-none">
                <BackIconBlack /> Quay về
              </Button>
            </Link>
          </div>
          <img
            src={mealPlan.image_mobile}
            alt="Menu detail image"
            className="w-full aspect-[440/281] object-cover block md:hidden"
          />
        </div>
        <div className="flex flex-col mx-auto max-w-[1800px]">
          <div className="items-center justify-center mb-20 md:mt-5 mt-2 p-2 xl:p-4">
            <img
              src={mealPlan.image_desktop}
              alt="Menu detail image"
              className="w-full aspect-[1800/681] object-cover rounded-sm lg:rounded-xl md:rounded-md hidden md:block"
            />
            <div className="mr-auto text-lg md:mt-8 px-4 md:px-0 md:py-10">
              <p className="font-bold text-sm lg:text-lg">{mealPlan.meal_plan_goal?.name}</p>
              <p className="text-[#737373] text-sm lg:text-lg">{mealPlan.title}</p>
              <div className="flex items-center gap-2">
                <p className="text-[#737373] text-sm lg:text-lg">Chef {mealPlan.chef_name}</p>
                {mealPlan.number_of_days > 0 && (
                  <p className="text-[#737373] text-sm lg:text-lg">{mealPlan.number_of_days} ngày</p>
                )}
              </div>
            </div>
            <div className="w-full px-4 md:px-0">
              <div className="bg-primary rounded-xl my-4 p-4 lg:p-5">
                <p className="text-white text-center text-lg lg:text-4xl lg:font-bold font-medium lg:mb-5 mb-2 font-[family-name:var(--font-roboto)]">
                  Tóm tắt thực đơn
                </p>
                <div
                  className="xl:px-10 max-lg:w-full mx-auto text-white flex flex-col items-start list-disc pl-5 max-h-[5em] lg:max-h-[7em]"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'auto' }}
                >
                  {mealPlan.subtitle.split('\n').map((line, index) => (
                    <div key={index} className="text-[#F7F7F7] text-sm lg:text-lg mb-1">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mr-auto text-lg my-20 max-lg:my-0 max-lg:p-4">
              <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl md:text-4xl mb-5">
                Thông tin thực đơn
              </div>
              <HtmlContent
                className="text-[#737373] text-sm lg:text-lg whitespace-pre-line"
                content={mealPlan.description}
              />
            </div>
            {mealPlan.meal_ingredients.length > 0 && (
              <div className="mr-auto text-lg mt-10 w-full max-lg:p-4">
                <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl md:text-4xl mb-5">
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
                      <CarouselItem key={ingredient.name} className="basis-1/2 lg:basis-1/6">
                        <div className="flex flex-col items-center">
                          <div className="w-[168px] h-[175px] overflow-hidden rounded-xl">
                            <img
                              src={ingredient.image}
                              alt={ingredient.name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                          <div className="text-lg font-medium w-full text-center mt-2 truncate">{ingredient.name}</div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}
            <ActionButtons mealPlanId={mealPlan.id} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching meal plan:', error)

    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-lg font-semibold">Đã có lỗi xảy ra</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Không thể tải thông tin thực đơn'}
        </p>
      </div>
    )
  }
}
