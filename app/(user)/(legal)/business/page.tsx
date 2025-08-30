import { getConfiguration } from '@/network/server/configurations'
import { HTMLRenderer } from '@/components/html-renderer'

export const dynamic = 'force-dynamic'

const configurationID = 4

export default async function BusinessPage() {
  const response = await getConfiguration(configurationID)
  const businessData = response.data.data

  if (!businessData) {
    return <div>Không có dữ liệu</div>
  }

  return (
    <div className="flex flex-col pt-10 lg:pt-16">
      <img
        src={businessData['thumbnail_image'] || '/temp/homepage-9.png'}
        alt="Doanh Nghiệp & VIP"
        className="lg:aspect-[1790/680] object-cover w-full h-auto rounded-lg mb-12"
      />
      <div>
        <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold lg:text-4xl text-2xl mb-6">
          Doanh Nghiệp & VIP
        </div>
        <HTMLRenderer
          content={businessData?.description?.replace(/\n/g, '<br />')}
          className="text-gray-500 lg:text-lg text-sm font-normal whitespace-pre-line text-justify"
        />
      </div>
    </div>
  )
}
