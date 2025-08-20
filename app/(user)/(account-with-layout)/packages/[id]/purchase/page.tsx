'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { BackIcon } from '@/components/icons/BackIcon'
import { Checkbox } from '@/components/ui/checkbox'

import { PackagePayment } from '../_components/package-payment'
import Link from 'next/link'
import ShefitLogo from '@/public/logo-vertical-dark.png'
import { formatDuration } from '@/lib/helpers'
import { getSubscription } from '@/network/client/subscriptions'
import { HtmlContent } from '@/components/html-content'

export default function PackageDetail({ params }: { params: Promise<{ id: string }> }) {
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const slug = (await params).id
      const data = await getSubscription(slug)
      setSubscription(data)
    }
    fetchData()
  }, [params])

  return subscription?.data ? (
    <div className="flex">
      <div className="lg:py-16 py-4 px-4 md:py-16 md:px-10 xl:p-[60px] flex-1 max-w-[832px]">
        <Link href="/account/packages" className="flex items-center gap-2 mb-4 md:mb-16 cursor-pointer">
          <BackIcon color="#000000" className="mb-1" />
          <div className="text-xl text-[#000000] font-semibold">Quay về</div>
        </Link>

        <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold mb-7">
          Gói {subscription.data.name}
        </div>

        <ul className="list-disc pl-7 text-base md:text-xl text-[#737373] mb-7 space-y-2">
          {(() => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(subscription.data.description_1, 'text/html')
            const paragraphs = Array.from(doc.querySelectorAll('p')).map((p) => p.innerHTML)

            return paragraphs
              .filter((item: string) => item.trim() !== '')
              .map((content: string, index: number) => (
                <li key={index} className="[&>p]:m-0 [&>p]:inline list-item">
                  <HtmlContent content={content} className="whitespace-pre-line" />
                </li>
              ))
          })()}
        </ul>

        <div className="mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">Loại hình</div>
          <div className="flex items-center gap-[26px]">
            <div className="flex items-center gap-[14px]">
              <Checkbox
                className="w-8 h-8 border-[#737373] disabled:opacity-100 disabled:cursor-default data-[state=checked]:bg-primary data-[state=checked]:text-white"
                checked={subscription.data.course_format === 'live' || subscription.data.course_format === 'both'}
                disabled
              />
              <div className="text-base md:text-xl text-[#737373]">Zoom HLV</div>
            </div>

            <div className="flex items-center gap-[14px]">
              <Checkbox
                className="w-8 h-8 border-[#737373] disabled:opacity-100 disabled:cursor-default data-[state=checked]:bg-primary data-[state=checked]:text-white"
                checked={subscription.data.course_format === 'video' || subscription.data.course_format === 'both'}
                disabled
              />
              <div className="text-base md:text-xl text-[#737373]">Video</div>
            </div>
          </div>
        </div>

        <PackagePayment
          prices={subscription.data.prices}
          defaultPrice={subscription.data.price}
          packageName={subscription.data.name}
        />

        <div>
          {subscription.data.relationships.gifts?.length > 0 && (
            <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold mb-[14px]">
              Chọn quà tặng
              <div className="text-base md:text-xl text-[#737373] mb-7">Được ship đến tận nhà!</div>
              <div className="flex flex-col gap-7 mb-7">
                {subscription.data.relationships.gifts?.map(
                  (gift: { id: number; type: string; name?: string; image?: string; duration?: number }) => (
                    <div key={gift.id}>
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          {gift.type === 'item' ? (
                            <>
                              <img
                                src={gift.image}
                                alt={gift.name}
                                className="rounded-[10px] aspect-square w-[85px] object-cover"
                              />
                              <div>
                                <div className="text-[#000000] text-base md:text-xl font-medium mb-2">{gift.name}</div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-[85px] h-[85px] flex items-center justify-center rounded-[10px]">
                                <Image
                                  src={ShefitLogo}
                                  width={100}
                                  height={100}
                                  className="object-contain"
                                  alt="Shefit"
                                />
                              </div>
                              <div>
                                {gift.duration && (
                                  <div className="text-[#000000] text-base md:text-xl font-medium mb-2">
                                    {formatDuration(gift.duration)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <Checkbox
                          className="w-8 h-8 border-[#737373] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                          checked={selectedGiftId === gift.id}
                          onCheckedChange={(checked) => {
                            setSelectedGiftId(checked ? gift.id : null)
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div>
            <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold mb-[14px]">
              Hướng dẫn
            </div>

            <div className="text-[#737373] text-base md:text-xl mb-7">
              Sau khi chuyển khoản thành công, hệ thống sẽ kích hoạt tài khoản và bạn có thể xem các khóa tập & thực
              đơn!
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block flex-1">
        <div className="w-full aspect-[2/3] relative">
          <Image src="/two-women-doing-exercises.avif" fill className="object-cover" alt="image" />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
    </div>
  )
}
