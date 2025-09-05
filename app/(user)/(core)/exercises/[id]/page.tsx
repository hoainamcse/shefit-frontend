import Link from 'next/link'
import { PlayCircle, ShoppingCart } from 'lucide-react'

import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DialogVideoPlayer } from '@/components/dialogs/dialog-video-player'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { getExercise } from '@/network/server/exercises'
import { ActionButtons } from './_components/action-buttons'

export default async function ExercisePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const _searchParams = await searchParams
  const muscleGroupId = typeof _searchParams?.muscle_group_id === 'string' ? _searchParams.muscle_group_id : ''
  const back = typeof _searchParams?.back === 'string' ? _searchParams.back : ''

  const { data: exercise } = await getExercise(id)

  return (
    <div className="flex flex-col md:pt-10 p-4 xl:pt-[53px]">
      <Link
        href={back || `/exercises?muscle_group_id=${muscleGroupId}`}
        className="flex cursor-pointer items-center gap-2 font-semibold lg:hidden md:mb-7 mb-3"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <BackIconBlack className="mb-1" />
        </div>
        {exercise?.muscle_groups && Array.isArray(exercise.muscle_groups)
          ? exercise.muscle_groups.find((mg: any) => mg.id?.toString() === muscleGroupId)?.name || 'Quay về'
          : 'Quay về'}
      </Link>

      {exercise.youtube_url && (
        <DialogVideoPlayer videoUrl={exercise.youtube_url} title={exercise.name}>
          <div className="relative group cursor-pointer mb-4">
            <img
              src={
                getYouTubeThumbnail(exercise.youtube_url, 'sddefault') ||
                'https://placehold.co/400?text=shefit.vn&font=Oswald'
              }
              alt={exercise.name}
              className="aspect-[3/2] lg:aspect-[3/1] object-cover rounded-xl w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </DialogVideoPlayer>
      )}

      <div className="flex flex-col">
        <div className="flex flex-col gap-2 sm:mb-10 lg:mb-16 text-center mb-6">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
            {exercise?.name}
          </div>
        </div>

        <div className="flex flex-col mb-10 lg:mb-16">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-3.5">
            Thông tin động tác
          </div>
          <div className="text-[#737373] text-sm lg:text-lg whitespace-pre-line">{exercise?.description}</div>
        </div>
      </div>

      {exercise?.equipments?.length > 0 && (
        <div className="flex flex-col mb-6 sm:mb-8 lg:mb-[52px]">
          <div className="flex items-center justify-between mb-4">
            <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
              Dụng cụ
            </p>
            <Link className="flex gap-2 items-center text-primary" href="/products">
              <ShoppingCart className="size-4" /> Mua dụng cụ
            </Link>
          </div>
          <ScrollArea className="w-screen-max-xl px-0 md:px-5 lg:px-0">
            <div className="flex space-x-5 w-full">
              {exercise.equipments.map((equipment: any, index: number) => (
                <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={equipment.image ?? undefined}
                      alt={equipment.name}
                      className="w-[168px] h-[168px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2.5 lg:pt-3 font-medium text-sm lg:text-lg w-full">
                    {equipment.name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {exercise?.muscle_groups?.length > 0 && (
        <div className="flex flex-col lg:mb-12 mb-2">
          <p className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-5">
            Nhóm cơ
          </p>
          <ScrollArea className="w-screen-max-xl">
            <div className="flex w-full space-x-5 px-0 md:px-5 lg:px-0">
              {exercise.muscle_groups.map((muscleGroup: any, index: number) => (
                <figure key={`muscleGroup-${muscleGroup.id}-${index}`} className="shrink-0 w-[168px]">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={muscleGroup.image ?? undefined}
                      alt={muscleGroup.name}
                      className="w-[168px] h-[168px] object-cover rounded-xl"
                    />
                  </div>
                  <figcaption className="pt-2.5 lg:pt-3 font-medium text-sm lg:text-lg w-full">
                    {muscleGroup.name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <ActionButtons exerciseID={Number(id)} />
    </div>
  )
}
