import Link from 'next/link'
import { z } from 'zod'
import { Fragment, Suspense } from 'react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { CupIcon } from '@/components/icons/CupIcon'
import { getCourses } from '@/network/server/courses'
import { getMealPlans } from '@/network/server/meal-plans'
import { BodyIcon } from '@/components/icons/BodyIcon'
import { HtmlContent } from '@/components/html-content'
import { ArrowIcon } from '@/components/icons/ArrowIcon'
import { PersonIcon } from '@/components/icons/PersonIcon'
import { MainButton } from '@/components/buttons/main-button'
import { DumbbellIcon } from '@/components/icons/DumbbellIcon'
import { formSchema } from '@/app/(admin)/admin/(content-input)/homepage/schema'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { FacebookIcon } from '@/components/icons/FacebookIcon'
import { getSubscriptions } from '@/network/server/subscriptions'
import { Subscription } from '@/models/subscription'
import { Course } from '@/models/course'
import { MealPlan } from '@/models/meal-plan'
import { getCoaches } from '@/network/server/coaches'
import { getProducts } from '@/network/server/products'

type DataType = z.infer<typeof formSchema>

export function SectionOne({ data }: { data: DataType['section_1'] }) {
  return (
    <div className="lg:relative flex flex-col-reverse">
      <div className="relative">
        {/* Mobile Image */}
        <img src={data.image_mobile} alt={data.title} className="w-full object-cover aspect-square lg:hidden" />
        {/* Desktop Image */}
        <img src={data.image_desktop} alt={data.title} className="hidden lg:block w-full object-cover aspect-[21/9]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent from-50% to-black hidden lg:block" />
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:left-[60%] lg:right-0 flex flex-col justify-center items-center lg:items-start gap-3 bg-[#FFA5A5] lg:bg-transparent text-center lg:text-start p-2 lg:p-3 lg:max-w-[600px] px-4 lg:px-0">
        <h2 className="font-[family-name:var(--font-coiny)] text-white text-3xl lg:text-4xl font-bold mt-2 lg:mt-0">
          {data.title}
        </h2>
        <div className="flex gap-1 text-[#FB4A64] text-sm lg:text-lg font-bold flex-wrap justify-center lg:justify-start">
          {data.features.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <>&#183;</>}
              <span>{item}</span>
            </Fragment>
          ))}
        </div>
        <div className="text-neutral-200 text-sm lg:text-lg">{data.description}</div>
        <MainButton
          text={data.cta.text}
          className="rounded-full text-sm lg:text-lg mb-2"
          size="lg"
          href={data.cta.href}
        />
      </div>
    </div>
  )
}

export function SectionTwo({ data }: { data: DataType['section_2'] }) {
  return (
    <div className="my-8 lg:my-4">
      <div className="lg:max-w-[800px] mx-auto flex flex-col items-center justify-center text-center gap-4 py-8 lg:py-12 px-8 lg:px-16">
        <h3 className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-2xl lg:text-4xl font-bold">
          {data.subtitle}
        </h3>
        <h2 className="font-[family-name:var(--font-coiny)] text-2xl lg:text-4xl font-bold">{data.title}</h2>
        <p className="text-[#FB4A64] text-sm lg:text-lg">{data.description}</p>
      </div>
      <img
        src={data.image_mobile}
        alt={data.image_mobile}
        className="aspect-[440/450] w-full max-w-full block lg:hidden object-cover"
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-[120px] items-center px-8 lg:px-16">
        <div className="lg:col-span-3">
          <img
            src={data.image_desktop}
            alt={data.image_desktop}
            className="aspect-[1065/746] rounded-md w-full max-w-full hidden lg:block object-cover"
          />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6 text-sm lg:text-lg">
          <div className="hidden lg:flex lg:flex-col lg:items-start gap-6">
            {data.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 text-ring">
                <span className="flex-shrink-0">
                  {index === 0 && <BodyIcon size={32} />}
                  {index === 1 && <DumbbellIcon size={32} />}
                  {index === 2 && <CupIcon size={32} />}
                </span>
                <div className="space-y-2">
                  <h4 className="uppercase text-base lg:text-2xl font-semibold text-[#FF7873]">{feature.title}</h4>
                  <p className="text-[#1A1A1A] text-sm lg:text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
            <MainButton
              text={data.cta.text}
              className="rounded-full text-sm lg:text-lg w-[296px] h-14"
              size="lg"
              href={data.cta.href}
            />
          </div>

          <div className="lg:hidden p-4 rounded-lg text-center">
            {data.features.map((feature, index) => (
              <div key={index} className="mb-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#FF7873] mb-auto">
                    {index === 0 && <BodyIcon size={24} />}
                    {index === 1 && <DumbbellIcon size={24} />}
                    {index === 2 && <CupIcon size={24} />}
                  </span>
                  <h4 className="text-[#FF7873] text-base font-semibold">{feature.title}</h4>
                </div>
                <p className="text-neutral-800 text-xs px-2">{feature.description}</p>
              </div>
            ))}
            <div className="mt-6 flex justify-center">
              <MainButton text={data.cta.text} className="rounded-full text-sm h-9" size="lg" href={data.cta.href} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function SectionThreeData({ data }: { data: DataType['section_3'] }) {
  let subscriptionsWithData: Array<{
    subscription: Subscription
    courses: Course[]
    mealPlans: MealPlan[]
  }> = []

  try {
    const subscriptionsResponse = await getSubscriptions({ ids: data.subscription_ids.join(',') })
    subscriptionsWithData = await Promise.all(
      subscriptionsResponse.data.map(async (subscription: Subscription) => {
        const coursesResponse = await getCourses({ ids: subscription.courses.map((c: any) => c.id) })
        const mealPlansResponse = await getMealPlans({ ids: subscription.meal_plans.map((mp: any) => mp.id) })
        return {
          subscription,
          courses: coursesResponse?.data || [],
          mealPlans: mealPlansResponse?.data || [],
        }
      })
    )
  } catch (error) {
    return (
      <div className="container mx-auto">
        <p className="text-center text-destructive">Không thể tải dữ liệu cho phần này. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  return (
    <div className="pt-8 lg:pt-24">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-[800px] mx-auto flex flex-col items-center justify-center text-center gap-4 px-6 lg:px-12 mb-8 lg:mb-[74px]">
          <h2 className="font-[family-name:var(--font-roboto)] text-2xl lg:text-4xl font-bold">{data.title}</h2>
          <p className="text-[#FB4A64] text-sm lg:text-lg">{data.description}</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div
            className={cn(
              'grid grid-cols-1 gap-8 lg:gap-20 items-stretch justify-items-center',
              subscriptionsWithData.length === 1
                ? 'lg:grid-cols-1 max-w-md mx-auto'
                : subscriptionsWithData.length === 2
                ? 'lg:grid-cols-2 max-w-xl mx-auto'
                : 'lg:grid-cols-3'
            )}
          >
            {subscriptionsWithData.map((item, mIndex) => (
              <div key={mIndex} className="flex flex-col h-full w-full space-y-4 px-4">
                <Link href={`/packages/detail/${item.subscription.id}`}>
                  <div
                    className={cn(
                      'group flex items-center gap-2 text-sm lg:text-base text-background font-medium rounded-md p-3',
                      mIndex === 0 && 'bg-[#FFAEB0]',
                      mIndex === 1 && 'bg-[#FC6363]',
                      mIndex === 2 && 'bg-[#B60606]'
                    )}
                  >
                    <PersonIcon />
                    <span className="text-sm lg:text-base font-semibold">{item.subscription.name}</span>
                    <span className="ml-auto transform transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon size={20} />
                    </span>
                  </div>
                </Link>
                <div className="flex-1 flex items-center justify-center text-base lg:text-lg mt-4">
                  <HtmlContent
                    content={item.subscription.description_homepage}
                    className="text-center px-2 text-neutral-500 text-xs lg:text-base whitespace-pre-line"
                  />
                </div>
                <Carousel className="mx-4">
                  <CarouselContent>
                    {item.courses.map((course: any) => (
                      <CarouselItem key={`course-${course.id}`} className="basis-3/4 lg:basis-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-full overflow-hidden">
                            <img
                              src={course.assets.homepage_thumbnail || course.assets.thumbnail}
                              alt={course.course_name}
                              className="rounded-md w-full object-cover aspect-[401/566]"
                            />
                          </div>
                          <p className="text-center text-neutral-500 text-sm lg:text-lg">
                            {course.description_homepage_1}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                    {item.mealPlans.map((mealPlan: any) => (
                      <CarouselItem key={`mealplan-${mealPlan.id}`} className="basis-3/4 lg:basis-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-full overflow-hidden">
                            <img
                              src={mealPlan.assets.homepage_thumbnail || mealPlan.assets.thumbnail}
                              alt={mealPlan.title}
                              className="rounded-md w-full object-cover aspect-[401/566]"
                            />
                          </div>
                          <p className="text-center text-neutral-500 text-sm lg:text-lg">
                            {mealPlan.description_homepage_1}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SectionThree({ data }: { data: DataType['section_3'] }) {
  return (
    <Suspense fallback={<SectionThreeSkeleton />}>
      <SectionThreeData data={data} />
    </Suspense>
  )
}

function SectionThreeSkeleton() {
  return (
    <div className="pt-8 lg:pt-24 animate-pulse">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-[800px] mx-auto flex flex-col items-center text-center gap-4 px-6 lg:px-12 mb-8 lg:mb-[74px]">
          <div className="h-8 w-3/4 bg-gray-300 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-20 items-stretch justify-items-center">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col h-full w-full space-y-4 px-4">
                <div className="h-10 bg-gray-300 rounded" />
                <div className="h-96 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SectionFour({ data }: { data: DataType['section_4'] }) {
  return (
    <div className="pt-[120px] lg:pt-24 pb-[88px] lg:pb-[72px] px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="lg:bg-[#FF7873] bg-[#FFA5A5] lg:py-8 py-6 rounded-xl px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-2 lg:gap-4 text-background">
            <HtmlContent
              content={data.title}
              className="text-lg lg:text-4xl font-bold px-8 lg:px-0 font-[family-name:var(--font-roboto)]"
            />
            <p className="text-base lg:text-2xl whitespace-pre-line font-[family-name:var(--font-roboto)]">
              {data.description}
            </p>
            <MainButton
              text={data.cta.text}
              className="rounded-full w-full h-8 lg:h-[81px] text-xs lg:text-xl font-bold"
              size="lg"
              href={data.cta.href}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function SectionSeven({ data }: { data: DataType['section_7'] }) {
  const mealPlans = await getMealPlans({ ids: data.meal_plan_ids.join(',') })
  return (
    <div className="py-8 lg:py-12 px-8 sm:px-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-[800px] mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h3 className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-2xl lg:text-4xl font-bold">
            {data.title}
          </h3>
          <h2 className="font-[family-name:var(--font-coiny)] text-2xl lg:text-4xl font-bold">{data.subtitle}</h2>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4">
          <Carousel>
            <CarouselContent>
              {mealPlans.data.map((item) => (
                <CarouselItem key={item.id} className="basis-2/3 lg:basis-1/3">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-full overflow-hidden">
                      <img
                        src={item.assets.homepage_thumbnail || item.assets.thumbnail}
                        alt={item.title}
                        className="rounded-lg w-full object-cover aspect-[4/3]"
                      />
                      <div className="absolute bottom-0 inset-x-0 h-[72px] lg:h-24 bg-[#28282894] flex items-center justify-between text-background rounded-b-lg px-3">
                        <p className="font-medium text-xl lg:text-2xl break-words max-w-[90%]">{item.title}</p>
                        <div className="w-10 h-10 flex-shrink-0 items-center">
                          <MainButton
                            size="icon"
                            icon={ArrowRight}
                            variant="secondary"
                            href={`/meal-plans/${item.id}`}
                            className="rounded-full text-primary transform transition-transform duration-300 hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <MainButton
            text="Xem menu"
            className="rounded-full mt-4 w-44 text-base lg:text-xl bg-[#FB4A64] lg:bg-[#13D8A7]"
            size="lg"
            href="/meal-plans"
          />
        </div>
      </div>
    </div>
  )
}

export async function SectionEight({ data }: { data: DataType['section_8'] }) {
  let VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })

  const productsData = await getProducts({ ids: data.product_ids.join(',') })

  return (
    <div className="py-8 lg:py-12 px-8 sm:px-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h2 className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-2xl lg:text-4xl font-bold">
            {data.title}
          </h2>
          <p className="text-neutral-500 text-sm">{data.description}</p>
        </div>
        <div className="space-y-4">
          <Carousel>
            <CarouselContent>
              {productsData.data.map((item, index) => (
                <CarouselItem key={item.id} className="basis-1/2 lg:basis-1/6">
                  <Link href={`/products/${item.id}`}>
                    <div className="grid grid-rows-[auto_1fr_auto] gap-1 lg:gap-2 h-full">
                      <img
                        src={item.image_urls[0] || '/temp/homepage-5.jpg'}
                        alt={item.name}
                        className="rounded-2xl w-full object-cover aspect-square"
                      />
                      <p className="text-base font-medium">{item.name}</p>
                      <p className="text-[#00C7BE] font-medium">{VND.format(item.price)}</p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex justify-center">
            <MainButton
              text="Xem gian hàng"
              className="rounded-full mx-auto w-44 lg:w-[296px] text-base lg:text-xl"
              size="lg"
              href="/products"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function SectionNine({ data }: { data: DataType['section_9'] }) {
  const coachesData = await getCoaches({ ids: data.coach_ids.join(',') })
  return (
    <div className="py-8 lg:py-12 px-4 sm:px-6">
      <div className="mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-[400px] mx-auto text-center">
          <h2 className="font-[family-name:var(--font-coiny)] text-2xl lg:text-4xl font-bold">
            Dẫn dắt bởi <br />
            chuyên gia hàng đầu
          </h2>
        </div>
        <div className="relative hidden lg:block">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {coachesData.data.map((coach, index) => (
              <div key={index} className={`relative ${index % 2 !== 0 ? 'lg:translate-y-12' : ''}`}>
                <div className="relative w-full aspect-[409/588]">
                  <div className="absolute inset-0">
                    <div className="relative w-full h-full aspect-[409/588]">
                      <div className="absolute bottom-0 left-0 bg-primary -z-10 w-full h-full" />
                      <img
                        src={coach.image || '/temp/homepage-6.png'}
                        alt={coach.name}
                        className="object-cover w-full h-full aspect-[409/588]"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center w-full lg:mt-4 mt-2">
                  <p className="text-lg lg:text-4xl font-semibold">{coach.name}</p>
                  <p className="text-sm lg:text-xl text-[#8E8E93]">{coach.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="block lg:hidden px-4">
          <Carousel>
            <CarouselContent>
              {coachesData.data.map((coach, index) => (
                <CarouselItem key={index} className="basis-1/2 lg:basis-1/6">
                  <div className="relative w-full aspect-[409/588]">
                    <div className="absolute inset-0">
                      <div className="relative w-full h-full aspect-[409/588]">
                        <div className="absolute bottom-0 left-0 bg-primary -z-10 w-full h-full" />
                        <img
                          src={coach.image || '/temp/homepage-6.png'}
                          alt={coach.name}
                          className="object-cover w-full h-full aspect-[409/588]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-center w-full lg:mt-4 mt-2">
                    <p className="text-lg lg:text-4xl font-semibold">{coach.name}</p>
                    <p className="text-sm lg:text-xl text-[#8E8E93]">{coach.detail}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export function SectionTen({ data }: { data: DataType['section_10'] }) {
  return (
    <div className="py-8 lg:py-20">
      <div
        className="relative w-full h-[400px] md:h-[600px] lg:h-[810px]"
        style={{ clipPath: 'polygon(0 11.111%, 100% 0, 100% 100%, 0 88.889%)' }}
      >
        <img src={data.top.image} className="absolute w-full h-full object-cover" />
        <div className="bg-[#FF78734D] absolute inset-0 transition-opacity" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-background">
          <div className="max-w-2xl space-y-4">
            <h2 className="uppercase font-[family-name:var(--font-roboto)] text-xl lg:text-4xl lg:font-bold">
              {data.top.title}
            </h2>
            <p className="text-sm lg:text-xl">{data.top.description}</p>
          </div>
        </div>
      </div>
      <div
        className="relative w-full h-[400px] md:h-[600px] lg:h-[900px] -mt-[70px] lg:-mt-[90px]"
        style={{ clipPath: 'polygon(0 0, 100% 10%, 100% 90%, 0 100%)' }}
      >
        <img src={data.bottom.image} className="absolute w-full h-full object-cover" />
        <div className="bg-[#FF78734D] absolute inset-0 transition-opacity" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-background">
          <div className="max-w-2xl space-y-4">
            <h2 className="uppercase font-[family-name:var(--font-roboto)] text-xl lg:text-4xl lg:font-bold">
              {data.bottom.title}
            </h2>
            <p className="text-sm lg:text-xl">{data.bottom.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SectionEleven({ data }: { data: DataType['section_11'] }) {
  return (
    <div className="pb-8 pt-20 lg:py-12 mb-12 max-lg:px-5">
      <div className="max-lg:space-y-4">
        <h2 className="font-[family-name:var(--font-roboto)] text-2xl lg:text-4xl w-full text-black block lg:hidden text-center">
          Cộng đồng <span className="text-[#FF7873]">Shefit</span> <br /> Nơi chia sẻ hành trình độ dáng của bạn
        </h2>
        <div className="relative">
          <img src={data.image} alt={data.image} className="aspect-video w-full object-cover max-lg:rounded-[10px]" />
          <div className="absolute top-0 right-0 h-full w-1/2 flex-col items-center justify-center px-8 text-background hidden lg:flex">
            <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-4">
              <h2 className="font-[family-name:var(--font-roboto)] text-2xl lg:text-4xl font-bold w-full">
                Cộng đồng <span className="text-[#FF7873]">Shefit</span>
              </h2>
              <h2 className="font-[family-name:var(--font-roboto)] text-2xl lg:text-4xl font-bold w-full">
                Nơi chia sẻ hành trình độ dáng của bạn
              </h2>
              <p className="text-sm lg:text-lg w-full font-[family-name:var(--font-roboto)]">{data.description}</p>
              <FacebookIcon size={56} />
              <MainButton
                text={data.cta.text}
                className="rounded-full w-44 lg:w-[444px] lg:h-16 text-base lg:text-xl"
                size="lg"
                href={data.cta.href}
                target="_blank"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:hidden items-center justify-center text-center font-[family-name:var(--font-roboto)]">
            <p className="px-5 mt-4 text-sm lg:text-lg w-full max-lg:text-gray-500">{data.description}</p>
            <FacebookIcon size={32} />
            <MainButton
              text={data.cta.text}
              className="rounded-full w-44 text-base lg:text-xl"
              size="lg"
              href={data.cta.href}
              target="_blank"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
