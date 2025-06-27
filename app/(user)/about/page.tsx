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
    <div className="flex flex-col gap-10 mt-10 xl:p-10 max-lg:p-0">
      <img src={aboutUsData['thumbnail_image']} alt="About Us" className="h-[680px] object-cover w-full" />
      <div>
        <div className="font-[family-name:var(--font-coiny)] xl:text-[40px] text-3xl font-bold mb-6">Về Shefit</div>
        <div
          className="text-gray-500 xl:text-xl max-lg:base font-normal whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: aboutUsData.description.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  )
}
