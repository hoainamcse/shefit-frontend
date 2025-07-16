import { getConfiguration } from '@/network/server/configurations'

export const dynamic = 'force-dynamic'

const configurationID = 1

export default async function About() {
  const response = await getConfiguration(configurationID)
  const aboutUsData = response.data.data

  if (!aboutUsData) {
    return <div>No data available</div>
  }

  return (
    <div className="flex flex-col gap-10 mt-10 p-4 sm:p-6 md:p-8 xl:p-10">
      <img src={aboutUsData['thumbnail_image']} alt="About Us" className="w-full h-auto max-h-[680px] object-cover rounded-lg" />
      <div>
        <div className="font-[family-name:var(--font-coiny)] xl:text-[40px] text-3xl font-bold mb-6">Về Shefit</div>
        <div
          className="text-gray-500 xl:text-xl max-lg:base font-normal whitespace-pre-line text-justify"
          dangerouslySetInnerHTML={{ __html: aboutUsData.description.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  )
}
