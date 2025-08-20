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
    <div className="flex flex-col pt-10 lg:pt-16">
      <img
        src={aboutUsData['thumbnail_image']}
        alt="About Us"
        className="lg:aspect-[1790/680] object-cover w-full h-auto rounded-lg mb-12"
      />
      <div>
        <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold lg:text-4xl text-2xl mb-6">
          Về Shefit
        </div>
        <HtmlContent
          content={aboutUsData.description.replace(/\n/g, '<br />')}
          className="text-gray-500 lg:text-lg text-sm font-normal whitespace-pre-line text-justify"
        />
      </div>
    </div>
  )
}
