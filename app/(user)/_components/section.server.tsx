import Link from 'next/link'
import { z } from 'zod'
import { Fragment } from 'react'
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

type DataType = z.infer<typeof formSchema>

export function SectionOne({ data }: { data: DataType['section_1'] }) {
  return (
    <div className="lg:relative flex flex-col-reverse">
      <img src={data.image} alt={data.image} className="w-full object-cover aspect-[1/1] lg:aspect-[21/9]" />
      <div className="lg:absolute lg:inset-y-0 lg:left-[60%] lg:right-0 flex flex-col justify-center items-center lg:items-start gap-3 bg-[#FFA5A5] lg:bg-transparent text-center lg:text-start p-2 lg:p-3 lg:max-w-[600px] px-4 lg:px-0">
        <h2 className="text-white text-3xl lg:text-[40px] font-bold mt-2 lg:mt-0">{data.title}</h2>
        <div className="flex gap-1 text-[#FB4A64] text-base lg:text-xl font-bold flex-wrap justify-center lg:justify-start">
          {data.features.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <>&#183;</>}
              <span>{item}</span>
            </Fragment>
          ))}
        </div>
        <div className="text-neutral-200 text-base lg:text-xl">{data.description}</div>
        <MainButton
          text={data.cta.text}
          className="rounded-full text-base lg:text-xl mb-2"
          size="lg"
          href={data.cta.href}
        />
      </div>
    </div>
  )
}

export function SectionTwo({ data }: { data: DataType['section_2'] }) {
  return (
    <div className="my-8 lg:my-12">
      <div className="lg:max-w-[800px] mx-auto flex flex-col items-center justify-center text-center gap-4 py-8 lg:py-12 px-8 lg:px-16">
        <h3 className="text-[#FF7873] text-3xl lg:text-[40px] font-bold">{data.subtitle}</h3>
        <h2 className="text-3xl lg:text-[40px] font-bold">{data.title}</h2>
        <p className="text-[#FB4A64] text-base lg:text-xl">{data.description}</p>
      </div>
      <img src={data.image} alt={data.image} className="aspect-[440/450] w-full max-w-full block lg:hidden" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-center px-8 lg:px-16">
        <div className="lg:col-span-3">
          <img
            src={data.image}
            alt={data.image}
            className="aspect-[1065/746] rounded-md w-full max-w-full hidden lg:block"
          />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6 text-base lg:text-xl">
          <div className="hidden lg:flex lg:flex-col lg:items-start gap-6">
            {data.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 text-ring">
                <span className="flex-shrink-0">
                  {index === 0 && <BodyIcon size={32} />}
                  {index === 1 && <DumbbellIcon size={32} />}
                  {index === 2 && <CupIcon size={32} />}
                </span>
                <div className="space-y-2">
                  <h4 className="uppercase text-lg lg:text-3xl font-semibold text-[#FF7873]">{feature.title}</h4>
                  <p className="text-[#1A1A1A] text-base lg:text-xl">{feature.description}</p>
                </div>
              </div>
            ))}
            <MainButton
              text={data.cta.text}
              className="rounded-full text-base lg:text-xl w-[296px] h-14"
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
                  <h4 className="text-[#FF7873] text-lg font-semibold">{feature.title}</h4>
                </div>
                <p className="text-neutral-800 text-sm px-2">{feature.description}</p>
              </div>
            ))}
            <div className="mt-6 flex justify-center">
              <MainButton text={data.cta.text} className="rounded-full text-base h-9" size="lg" href={data.cta.href} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function SectionThree({ data }: { data: DataType['section_3'] }) {
  const courses = await Promise.all(data.subscriptions.map((dt) => getCourses({ ids: dt.course_ids })))
  const mealPlans = await Promise.all(data.subscriptions.map((dt) => getMealPlans({ ids: dt.meal_plan_ids })))
  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-[800px] mx-auto flex flex-col items-center justify-center text-center gap-4 px-6 lg:px-12">
          <h2 className="text-3xl lg:text-[40px] font-bold">{data.title}</h2>
          <p className="text-[#FB4A64] text-base lg:text-xl">{data.description}</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div
            className={cn(
              'grid grid-cols-1 gap-8 items-stretch justify-items-center',
              data.subscriptions.length === 1
                ? 'lg:grid-cols-1 max-w-md mx-auto'
                : data.subscriptions.length === 2
                ? 'lg:grid-cols-2 max-w-xl mx-auto'
                : 'lg:grid-cols-3'
            )}
          >
            {data.subscriptions.map((sub, mIndex) => (
              <div key={mIndex} className="flex flex-col h-full w-full space-y-4 px-4">
                <Link href={'#'}>
                  <div
                    className={cn(
                      'group flex items-center gap-2 text-base lg:text-lg text-background font-medium rounded-md p-3',
                      mIndex === 0 && 'bg-[#FFAEB0]',
                      mIndex === 1 && 'bg-[#FC6363]',
                      mIndex === 2 && 'bg-[#B60606]'
                    )}
                  >
                    <PersonIcon />
                    <span className="text-lg lg:text-xl font-semibold">{sub.name}</span>
                    <span className="ml-auto transform transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon size={20} />
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-lg lg:text-xl mt-4">
                    <HtmlContent
                      content={sub.description_homepage}
                      className="text-center px-2 text-neutral-500 text-base lg:text-xl"
                    />
                  </div>
                </Link>
                <Carousel className="mx-4">
                  <CarouselContent>
                    {courses[mIndex]?.data?.map((course, cIndex) => (
                      <CarouselItem key={`course-${course.id}`} className="basis-3/4 lg:basis-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-full overflow-hidden">
                            <img
                              src={course.image_homepage || '/temp/homepage-3.jpg'}
                              alt={course.course_name}
                              className="rounded-md w-full object-cover aspect-[401/566]"
                            />
                            <div
                              className={cn(
                                'absolute bottom-[15%] -left-[42px] -right-[42px] h-16 bg-gradient-to-t from-background to-transparent -rotate-12 text-background flex flex-col items-center justify-center',
                                mIndex === 0 && 'bg-primary',
                                mIndex === 1 && 'bg-ring',
                                mIndex === 2 && 'bg-[#B60606]'
                              )}
                            >
                              <p className="uppercase text-sm lg:text-base font-semibold max-w-[75%] truncate">
                                {course.course_name}
                              </p>
                              <p className="capitalize text-sm lg:text-base">{course.difficulty_level}</p>
                            </div>
                          </div>
                          <p className="text-center text-neutral-500 text-lg lg:text-xl">
                            {course.description_homepage_1}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                    {mealPlans[mIndex]?.data?.map((mealPlan, mpIndex) => (
                      <CarouselItem key={`mealplan-${mealPlan.id}`} className="basis-2/3 lg:basis-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-full overflow-hidden">
                            <img
                              src={mealPlan.image_homepage || '/temp/homepage-3.jpg'}
                              alt={mealPlan.title}
                              className="rounded-md w-full object-cover aspect-[5/7]"
                            />
                            <div
                              className={cn(
                                'absolute bottom-[15%] -left-[42px] -right-[42px] h-16 bg-gradient-to-t from-background to-transparent -rotate-12 text-background flex flex-col items-center justify-center',
                                mIndex === 0 && 'bg-primary',
                                mIndex === 1 && 'bg-ring',
                                mIndex === 2 && 'bg-[#B60606]'
                              )}
                            >
                              <p className="uppercase text-sm lg:text-base font-semibold max-w-[75%] truncate">
                                {mealPlan.title}
                              </p>
                              <p className="capitalize text-sm lg:text-base">{mealPlan.subtitle}</p>
                            </div>
                          </div>
                          <p className="text-center text-neutral-500 text-lg lg:text-xl">
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

export function SectionFour({ data }: { data: DataType['section_4'] }) {
  return (
    <div className="py-8 lg:py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="lg:bg-[#FF7873] bg-[#FFA5A5] lg:py-8 py-6 rounded-xl px-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-2 lg:gap-4 text-background">
            <h3
              dangerouslySetInnerHTML={{ __html: data.title }}
              className="text-xl lg:text-[40px] lg:leading-10 font-bold px-8 lg:px-0"
            />
            <p className="text-base lg:text-2xl">{data.description}</p>
            <MainButton
              text={data.cta.text}
              className="rounded-full w-full h-8 lg:h-[81px] text-sm lg:text-2xl font-bold"
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
  return (
    <div className="py-8 lg:py-12 px-8 sm:px-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-[800px] mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h3 className="text-[#FF7873] text-3xl lg:text-[40px] font-bold">Ăn uống khoa học</h3>
          <h2 className="text-3xl lg:text-[40px] font-bold">
            “Độ” dáng nhanh hơn với menu theo từng mục tiêu từ chuyên gia
          </h2>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-4">
          <Carousel>
            <CarouselContent>
              {data.meal_plans.map((item) => (
                <CarouselItem key={item.id} className="basis-2/3 lg:basis-1/3">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-full overflow-hidden">
                      <img
                        src={item.image || '/temp/homepage-4.jpg'}
                        alt={item.title}
                        className="rounded-lg w-full object-cover aspect-[4/3]"
                      />
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-[#28282894] flex items-center justify-between text-background rounded-b-lg px-3">
                        <p className="font-medium text-2xl lg:text-3xl break-words max-w-[90%]">{item.title}</p>
                        <div className="w-10 h-10 flex-shrink-0 items-center">
                          <MainButton
                            size="icon"
                            icon={ArrowRight}
                            variant="secondary"
                            href="#"
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
            className="rounded-full mt-4 w-44 text-lg lg:text-2xl bg-[#FB4A64] lg:bg-[#13D8A7]"
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

  return (
    <div className="py-8 lg:py-12 px-8 sm:px-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h2 className="text-[#FF7873] text-3xl lg:text-[40px] font-bold">{data.title}</h2>
          <p className="text-neutral-500 text-base">{data.description}</p>
        </div>
        <div className="space-y-4">
          <Carousel>
            <CarouselContent>
              {data.products.map((item, index) => (
                <CarouselItem key={item.id} className="basis-2/5 lg:basis-1/6">
                  <Link href={`/products/${item.id}`}>
                    <div className="grid grid-rows-[auto_1fr_auto] gap-1 lg:gap-2 h-full">
                      <img
                        src={item.image_urls[0] || '/temp/homepage-5.jpg'}
                        alt={item.name}
                        className="rounded-2xl w-full object-cover aspect-square"
                      />
                      <p className="text-lg font-medium">{item.name}</p>
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
              className="rounded-full mx-auto w-44 lg:w-[296px] text-lg lg:text-2xl"
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
  return (
    <div className="py-8 lg:py-12 px-4 sm:px-6">
      <div className="mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-[400px] mx-auto text-center">
          <h2 className="text-3xl lg:text-[40px] lg:leading-[1.2] font-bold">
            Dẫn dắt bởi <br />
            chuyên gia hàng đầu
          </h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {data.coaches.map((coach, index) => (
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
                      <div className="text-center space-y-1 absolute bottom-5 left-0 w-full text-white">
                        <p className="text-[20px] lg:text-[40px] font-semibold">{coach.name}</p>
                        <p className="text-[16px] lg:text-[24px]">{coach.detail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SectionTen({ data }: { data: DataType['section_10'] }) {
  return (
    <div className="py-8 lg:py-20">
      <div
        className="relative w-full h-[400px] lg:h-[600px]"
        style={{ clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 90%)' }}
      >
        <img src={data.top.image} className="absolute w-full h-full object-cover" />
        <div className="bg-[#FF78734D] absolute inset-0 transition-opacity" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-background">
          <div className="max-w-2xl space-y-4">
            <h2 className="uppercase text-2xl lg:text-[40px] font-bold">{data.top.title}</h2>
            <p className="text-[16px] lg:text-[24px]">{data.top.description}</p>
          </div>
        </div>
      </div>
      <div
        className="relative w-full h-[400px] lg:h-[600px] -mt-[40px] lg:-mt-[60px]"
        style={{ clipPath: 'polygon(0 0, 100% 10%, 100% 95%, 0 100%)' }}
      >
        <img src={data.bottom.image} className="absolute w-full h-full object-cover" />
        <div className="bg-[#FF78734D] absolute inset-0 transition-opacity" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-background">
          <div className="max-w-2xl space-y-4">
            <h2 className="uppercase text-2xl lg:text-[40px] font-bold">{data.bottom.title}</h2>
            <p className="text-[16px] lg:text-[24px]">{data.bottom.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SectionEleven({ data }: { data: DataType['section_11'] }) {
  return (
    <div className="py-8 lg:py-12 mb-12">
      <div className="space-y-8 lg:space-y-10">
        <h2 className="text-3xl lg:text-[40px] font-bold w-full text-black block lg:hidden text-center">
          Cộng đồng <span className="text-[#FF7873]">Shefit</span> <br /> Nơi chia sẻ hành trình độ dáng của bạn
        </h2>
        <div className="relative">
          <img src={data.image} alt={data.image} className="aspect-video w-full object-cover" />
          <div className="absolute top-0 right-0 h-full w-1/2 flex-col items-center justify-center px-8 text-background hidden lg:flex">
            <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-4">
              <h2 className="text-3xl lg:text-[40px] font-bold w-full">
                Cộng đồng <span className="text-[#FF7873]">Shefit</span> <br /> Nơi chia sẻ hành trình độ dáng của bạn
              </h2>
              <p className="mb-4 text-[16px] lg:text-[20px] w-full">{data.description}</p>
              <FacebookIcon className="w-12 h-12" />
              <MainButton
                text={data.cta.text}
                className="rounded-full w-44 lg:w-[444px] lg:h-16 text-lg lg:text-2xl"
                size="lg"
                href={data.cta.href}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:hidden items-center justify-center text-center">
            <p className="px-5 mt-4 text-[16px] lg:text-[20px] w-full">{data.description}</p>
            <FacebookIcon className="w-12 h-12" />
            <MainButton
              text={data.cta.text}
              className="rounded-full w-44 text-lg lg:text-2xl"
              size="lg"
              href={data.cta.href}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
