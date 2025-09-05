import Link from 'next/link'
import { PlayCircle } from 'lucide-react'

import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { DialogVideoPlayer } from '@/components/dialogs/dialog-video-player'
import { getYouTubeThumbnail } from '@/lib/youtube'
import { getDish } from '@/network/server/dishes'
import { ActionButtons } from './_components/action-buttons'

export default async function DishPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const _searchParams = await searchParams
  const dietId = typeof _searchParams?.diet_id === 'string' ? _searchParams.diet_id : ''
  const back = typeof _searchParams?.back === 'string' ? _searchParams.back : ''

  const { data: dish } = await getDish(id)

  return (
    <div className="flex flex-col p-4 md:pt-10 lg:pt-[69px]">
      <Link
        href={back || `/dishes?diet_id=${dietId}`}
        className="flex cursor-pointer items-center gap-2.5 font-semibold lg:hidden md:mb-7 mb-2"
      >
        <div className="w-6 h-6 pt-1 flex justify-center">
          <BackIconBlack />
        </div>
        Quay về
      </Link>

      <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl mb-4 sm:mb-10 lg:mb-[87px] md:text-center">
        {dish.name}
      </div>

      {dish.youtube_url ? (
        <DialogVideoPlayer videoUrl={dish.youtube_url} title={dish.name}>
          <div className="relative group cursor-pointer mb-4">
            <img
              src={
                getYouTubeThumbnail(dish.youtube_url, 'sddefault') ||
                'https://placehold.co/400?text=shefit.vn&font=Oswald'
              }
              alt={dish.name}
              className="aspect-[3/2] lg:aspect-[3/1] object-cover rounded-xl w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </DialogVideoPlayer>
      ) : dish.image ? (
        <div className="w-full bg-black rounded-2xl overflow-hidden mb-5 aspect-square lg:aspect-[3/1]">
          <img src={dish.image} alt="" className="object-cover rounded-2xl w-full h-full" />
        </div>
      ) : null}

      <div className="flex flex-col gap-5">
        <div>
          <div className="font-medium text-sm lg:text-lg">{dish.name}</div>
          <div className="text-[#737373] text-sm lg:text-lg">
            <div className="flex flex-wrap gap-4">
              <p>Dinh dưỡng: {dish.nutrients}</p>
            </div>
          </div>
        </div>

        {dish.description && (
          <div>
            <h3 className="font-semibold text-sm lg:text-lg">Mô tả:</h3>
            <p className="text-[#737373] text-sm lg:text-lg whitespace-pre-line">{dish.description}</p>
          </div>
        )}
        <ActionButtons dishID={Number(id)} />
      </div>
    </div>
  )
}
