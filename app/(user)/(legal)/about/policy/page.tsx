import { HTMLRenderer } from '@/components/html-renderer'
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
      <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold xl:text-4xl max-lg:text-2xl">
        Chính sách bảo mật
      </div>
      <HTMLRenderer content={policyData.privacy_policy} className="text-gray-500 xl:text-lg max-lg:text-sm" />
      <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold xl:text-4xl max-lg:text-2xl">
        Chính Sách Bảo Vệ Thông Tin Cá Nhân Khách Hàng
      </div>
      <HTMLRenderer content={policyData.personal_policy} className="text-gray-500 xl:text-lg max-lg:text-sm" />
    </div>
  )
}
