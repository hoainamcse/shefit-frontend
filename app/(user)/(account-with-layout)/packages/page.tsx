import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { HTMLRenderer } from '@/components/html-renderer'
import { getSubscriptions } from '@/network/server/subscriptions'
import { serializeSearchParams } from '@/utils/searchParams'

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const _searchParams = await searchParams
  const query = serializeSearchParams(_searchParams)
  const courseId = typeof _searchParams.course_id === 'string' ? _searchParams.course_id : ''
  const { data } = await getSubscriptions(courseId ? { course_id: Number(courseId) } : {})

  return (
    <div className="flex flex-col pt-10 lg:pt-16">
      <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4 px-4 lg:px-12">
        Mua Gói Member
      </div>

      <div className="text-[#737373] text-sm md:text-lg mb-6 px-4 lg:px-12">
        {courseId
          ? 'Bạn cần mua một trong các Gói Member sau để truy cập vào khóa tập vừa xem'
          : 'Mua gói độ dáng để bắt đầu các khóa tập và thực đơn'}
      </div>

      {data.length === 0 ? (
        <div className="text-center text-[#737373] py-8">
          {courseId ? 'Không có gói nào phù hợp với khoá tập này' : 'Không có gói nào khả dụng'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:px-12">
          {data
            .sort((a, b) => a.display_order - b.display_order)
            .map((subscription) => (
              <div key={subscription.id} className="bg-[#FFAEB01A] lg:rounded-[20px] lg:p-5 p-4 h-full">
                <div className="flex flex-col 2xl:flex-row 2xl:gap-4 h-full justify-between">
                  <div className="flex flex-col gap-5 justify-between h-full w-full 2xl:w-1/2">
                    <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#000000] text-lg lg:text-xl">
                      {subscription.name}
                    </div>
                    <div className="text-sm md:text-lg">
                      <HTMLRenderer
                        content={subscription.description_1}
                        className="whitespace-pre-line text-[#737373]"
                      />
                    </div>
                    <Link href={`/packages/${subscription.id}${query}`}>
                      <Button className="bg-[#13D8A7] w-[190px] h-[38px] rounded-[26px] text-sm md:text-lg font-normal md:pt-2.5 md:pb-1.5">
                        Chọn gói
                      </Button>
                    </Link>
                  </div>
                  <div className="w-full 2xl:w-1/2 mt-4 2xl:mt-0">
                    <img
                      src={subscription.assets.thumbnail}
                      alt=""
                      className="aspect-[400/255] object-cover rounded-[20px] w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
