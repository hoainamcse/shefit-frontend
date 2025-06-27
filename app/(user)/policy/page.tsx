import { HtmlContent } from '@/components/html-content'
import { getConfiguration } from '@/network/server/configurations'

export const dynamic = 'force-dynamic'

const configurationID = 2

export default async function PolicyPage() {
  const response = await getConfiguration(configurationID)
  const policyData = response.data.data

  if (!policyData) {
    return <div>No data available</div>
  }
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="font-[family-name:var(--font-coiny)] xl:text-[40px] max-lg:text-2xl font-bold">
        Chính sách bảo mật
      </div>
      <HtmlContent content={policyData.privacy_policy} className="text-gray-500 xl:text-xl max-lg:text-base" />
      <div className="font-[family-name:var(--font-coiny)] xl:text-[40px] max-lg:text-2xl font-bold">
        Chính Sách Bảo Vệ Thông Tin Cá Nhân Khách Hàng
      </div>
      <HtmlContent content={policyData.personal_policy} className="text-gray-500 xl:text-xl max-lg:text-base" />
    </div>
  )
}
