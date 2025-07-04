import Link from 'next/link'
import { z } from 'zod'
import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { CupIcon } from '@/components/icons/CupIcon'
import { getCourses } from '@/network/server/courses'
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
      <img src={data.image} alt={data.image} className="w-full object-cover aspect-[5/3] lg:aspect-[21/9]" />
      {/* <div className="bg-[#00000033] absolute inset-0 transition-opacity" /> */}
      <div className="lg:absolute lg:inset-y-0 lg:left-1/2 lg:right-[10%] flex flex-col justify-center items-center lg:items-start gap-4 bg-primary lg:bg-transparent text-center lg:text-start p-4">
        <h2 className="text-white text-2xl lg:text-3xl font-bold">{data.title}</h2>
        <div className="flex gap-2 text-[#FB4A64] text-base font-bold flex-wrap justify-center lg:justify-start">
          {data.features.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <>&#183;</>}
              <span>{item}</span>
            </Fragment>
          ))}
        </div>
        <div className="text-neutral-200">{data.description}</div>
        <MainButton text={data.cta.text} className="rounded-full" size="lg" href={data.cta.href} />
      </div>
    </div>
  )
}

export function SectionTwo({ data }: { data: DataType['section_2'] }) {
  return (
    <div className="py-8 lg:py-12 px-4 sm:px-6">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h3 className="text-ring text-xl lg:text-2xl font-bold">{data.subtitle}</h3>
          <h2 className="text-2xl lg:text-3xl font-bold">{data.title}</h2>
          <p className="text-primary">{data.description}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3">
            <img src={data.image} alt={data.image} className="aspect-[5/3] rounded-md w-full" />
          </div>
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start gap-6">
            {data.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 text-ring">
                <span className="flex-shrink-0">
                  {index === 0 && <BodyIcon size={32} />}
                  {index === 1 && <DumbbellIcon size={32} />}
                  {index === 2 && <CupIcon size={32} />}
                </span>
                <div className="space-y-2">
                  <h4 className="uppercase text-lg lg:text-xl font-semibold">{feature.title}</h4>
                  <p className="text-neutral-500">{feature.description}</p>
                </div>
              </div>
            ))}
            <MainButton text={data.cta.text} className="rounded-full" size="lg" href={data.cta.href} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Todo: carousel indicator on mobile
export async function SectionThree({ data }: { data: DataType['section_3'] }) {
  const courses = await Promise.all(data.subscriptions.map((dt) => getCourses({ ids: dt.course_ids })))

  return (
    <div className="py-8 lg:py-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h2 className="text-2xl lg:text-3xl font-bold">{data.title}</h2>
          <p className="text-primary">{data.description}</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={cn(
              'grid grid-cols-1 gap-8 items-stretch',
              data.subscriptions.length === 1
                ? 'lg:grid-cols-1 max-w-md mx-auto'
                : data.subscriptions.length === 2
                ? 'lg:grid-cols-2 max-w-xl mx-auto'
                : 'lg:grid-cols-3'
            )}
          >
            {data.subscriptions.map((sub, mIndex) => (
              <div key={mIndex} className="flex flex-col h-full w-full max-w-sm space-y-4">
                <Link href={'#'}>
                  <div
                    className={cn(
                      'group flex items-center gap-2 text-base lg:text-lg text-background font-medium rounded-md p-3',
                      mIndex === 0 && 'bg-primary',
                      mIndex === 1 && 'bg-ring',
                      mIndex === 2 && 'bg-[#B60606]'
                    )}
                  >
                    <PersonIcon />
                    <span>{sub.name}</span>
                    <span className="ml-auto transform transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon size={20} />
                    </span>
                  </div>
                </Link>
                <div className="flex-1 flex items-center justify-center">
                  <HtmlContent content={sub.description_1} />
                </div>
                <Carousel className="mx-4">
                  <CarouselContent>
                    {courses[mIndex].data.map((course, cIndex) => (
                      <CarouselItem key={course.id} className="basis-2/3 lg:basis-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-full overflow-hidden">
                            <img
                              src={course.cover_image || '/temp/homepage-3.jpg'}
                              alt={course.course_name}
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
                                {course.course_name}
                              </p>
                              <p className="capitalize text-sm lg:text-base">{course.difficulty_level}</p>
                            </div>
                          </div>
                          <p className="text-center text-neutral-500">{course.description}</p>
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
        <div className="bg-primary py-8 rounded-xl px-4">
          <div className="max-w-lg mx-auto flex flex-col items-center justify-center text-center gap-4 text-background">
            <h3 className="text-xl lg:text-2xl font-bold">{data.title}</h3>
            <p>{data.description}</p>
            <MainButton text={data.cta.text} className="rounded-full w-full" size="lg" href={data.cta.href} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Todo: carousel indicator
export async function SectionSeven({ data }: { data: DataType['section_7'] }) {
  return (
    <div className="py-8 lg:py-12 px-8 sm:px-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h3 className="text-ring text-xl lg:text-2xl font-bold">Ăn uống khoa học</h3>
          <h2 className="text-2xl lg:text-3xl font-bold">
            “Độ” Dáng Nhanh Hơn Với Menu Theo Từng Mục Tiêu Từ Chuyên Gia
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
                        <p className="font-medium">{item.title}</p>
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <MainButton text="Xem menu" className="rounded-full mt-4 w-44" size="lg" href="/meal-plans" />
        </div>
      </div>
    </div>
  )
}

// Todo: carousel indicator
export async function SectionEight({ data }: { data: DataType['section_8'] }) {
  let VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })

  return (
    <div className="py-8 lg:py-12 px-8 sm:px-12">
      <div className="container mx-auto space-y-8 lg:space-y-10">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
          <h2 className="text-ring text-2xl lg:text-3xl font-bold">{data.title}</h2>
          <p className="text-neutral-500">{data.description}</p>
        </div>
        <div className="space-y-4">
          <Carousel>
            <CarouselContent>
              {data.products.map((item, index) => (
                <CarouselItem key={item.id} className="basis-2/5 lg:basis-1/6">
                  <Link href={`/products/${item.id}`}>
                    <div className="flex flex-col gap-2">
                      <img
                        src={item.image_urls[0] || '/temp/homepage-5.jpg'}
                        alt={item.name}
                        className="rounded-2xl w-full object-cover aspect-square"
                      />
                      <div>
                        <p className="text-lg font-medium">{item.name}</p>
                        <p className="text-[#00C7BE] font-medium">{VND.format(item.price)}</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex justify-center">
            <MainButton text="Xem gian hàng" className="rounded-full mx-auto w-44" size="lg" href="/products" />
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
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-bold">Dẫn dắt bởi chuyên gia hàng đầu</h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {data.coaches.map((coach, index) => (
              <div key={index} className={`relative ${index % 2 !== 0 ? 'lg:translate-y-12' : ''}`}>
                <div className="relative w-full" style={{ paddingBottom: '150%' }}>
                  <div className="absolute inset-0">
                    <div className="relative w-full h-full">
                      <div className="absolute bottom-0 left-0 bg-primary -z-10 w-full h-full" />
                      <img
                        src={coach.image || '/temp/homepage-6.png'}
                        alt={coach.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="text-center space-y-1 absolute bottom-5 left-0 w-full text-white">
                        <p className="text-[16px] sm:text-[24px] md:text-[32px] lg:text-[40px] font-medium">
                          HLV {coach.name}
                        </p>
                        <p className="text-[14px] sm:text-[20px] md:text-[24px] lg:text-[20px]">{coach.detail}</p>
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
            <h2 className="uppercase text-2xl lg:text-3xl font-bold">{data.top.title}</h2>
            <p>{data.top.description}</p>
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
            <h2 className="uppercase text-2xl lg:text-3xl font-bold">{data.bottom.title}</h2>
            <p>{data.bottom.description}</p>
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
        <h2 className="text-2xl lg:text-4xl font-bold w-full text-black block lg:hidden text-center">
          Cộng đồng <span className="text-primary">Shefit</span> <br /> Nơi chia sẻ hành trình độ dáng của bạn
        </h2>
        <div className="relative">
          <img src={data.image} alt={data.image} className="aspect-video w-full object-cover" />
          <div className="absolute top-0 right-0 h-full w-1/2 flex-col items-center justify-center px-8 text-background hidden lg:flex">
            <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-4">
              <h2 className="text-2xl lg:text-4xl font-bold w-full">
                Cộng đồng <span className="text-primary">Shefit</span> <br /> Nơi chia sẻ hành trình độ dáng của bạn
              </h2>
              <p className="mb-4 text-[16px] lg:text-[20px] w-full">{data.description}</p>
              <FacebookIcon className="w-12 h-12" />
              <MainButton text={data.cta.text} className="rounded-full w-44" size="lg" href={data.cta.href} />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:hidden items-center justify-center text-center">
            <p className="px-5 mt-4 text-[16px] lg:text-[20px] w-full">{data.description}</p>
            <FacebookIcon className="w-12 h-12" />
            <MainButton text={data.cta.text} className="rounded-full w-44" size="lg" href={data.cta.href} />
          </div>
        </div>
      </div>
    </div>
  )
}
