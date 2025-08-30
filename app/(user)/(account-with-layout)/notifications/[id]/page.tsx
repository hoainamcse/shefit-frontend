import Link from 'next/link'

import { getNotification } from '@/network/server/notifications'
import { HTMLRenderer } from '@/components/html-renderer'
import { BackIcon } from '@/components/icons/BackIcon'
// import { htmlToText } from '@/lib/helpers'


export default async function NotificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await getNotification(Number(id))

  return (
    <div className="flex flex-col mt-5 lg:mt-10">
      <Link href="/account/notifications" className="flex items-center gap-[10px] cursor-pointer">
        <BackIcon color="#000000" style={{ marginBottom: '4px' }} />
        <div className="text-lg text-[#000000] font-semibold">Quay về</div>
      </Link>
      <div className="flex flex-col gap-10 mt-5 lg:mt-10">
        {/* <img
          src={data.cover_image}
          alt={data.title}
          className="lg:h-[680px] w-full object-cover h-[300px] rounded-xl"
        /> */}
        <div>
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold xl:text-4xl mb-5 max-lg:text-xl">
            {data.title}
          </div>
          <HTMLRenderer content={data.content} className="text-gray-500 xl:text-lg max-lg:text-lg" />
        </div>
      </div>
    </div>
  )
}
