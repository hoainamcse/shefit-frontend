'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import ListMealPlans from './_components/ListMealPlans'
import ListExercises from './_components/ListExercises'
import { ListCourses } from './_components/ListCourses'
import ListSubscriptions from './_components/ListSubscriptions'
import { SubscriptionProvider, useSubscription } from './_components/SubscriptionContext'
import ListDishes from './_components/ListDishes'
import FavouriteContent from './_components/FavouriteContent'

function ExerciseContent() {
  const { showFavorites } = useSubscription()

  if (showFavorites) {
    return <FavouriteContent />
  }

  return (
    <div className="space-y-10">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold hover:no-underline">
            Khóa tập
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base text-muted-foreground">Các khóa tập thuộc Gói Member mà bạn đã mua</p>
            <ListCourses />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-2">
        <AccordionItem value="item-2" className="border-b-0">
          <AccordionTrigger className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold hover:no-underline">
            Thực đơn
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base text-muted-foreground">
              Bạn có thể chọn trong nhiều loại thực đơn đa dạng. Để biết bạn phù hợp thực đơn nào hãy làm Body Quiz Bảng
              Câu Hỏi số đo body.
            </p>
            <ListMealPlans />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-3">
        <AccordionItem value="item-3" className="border-b-0">
          <AccordionTrigger className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold hover:no-underline">
            Động tác
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base text-muted-foreground">
              Truy cập thư viện hơn 1000 động tác chia theo các nhóm cơ và lưu lại những động tác bạn muốn
            </p>
            <ListExercises />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-4">
        <AccordionItem value="item-4" className="border-b-0">
          <AccordionTrigger className="text-2xl lg:text-4xl text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold hover:no-underline">
            Món ăn
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-base text-muted-foreground">
              Truy cập thư viện hơn 200 món ăn chia theo các loại chế độ ăn và lưu lại những món ăn phù hợp
            </p>
            <ListDishes />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

function ExercisePage() {
  return (
    <div className="px-4 lg:px-14">
      <SubscriptionProvider>
        <ListSubscriptions />
        <ExerciseContent />
      </SubscriptionProvider>
    </div>
  )
}

export default ExercisePage
