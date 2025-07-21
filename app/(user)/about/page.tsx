import { getConfiguration } from '@/network/server/configurations'
import { HtmlContent } from '@/components/html-content'

export const dynamic = 'force-dynamic'

const configurationID = 1

export default async function About() {
  const response = await getConfiguration(configurationID)
  const aboutUsData = response.data.data

  if (!aboutUsData) {
    return <div>No data available</div>
  }

  return (
    <div className="flex flex-col pt-10 lg:pt-16 xl:pt-[93px]">
      <img src={aboutUsData['thumbnail_image']} alt="About Us" className="w-full h-auto rounded-lg mb-12" />
      <div>
        <div className="font-[family-name:var(--font-coiny)] lg:text-4xl text-2xl font-bold mb-6">Về Shefit</div>
        <HtmlContent
          content={aboutUsData.description.replace(/\n/g, '<br />')}
          className="text-gray-500 lg:text-lg text-sm font-normal whitespace-pre-line text-justify"
        />
      </div>
    </div>
  )
}
