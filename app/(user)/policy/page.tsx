import { getConfigurations } from "@/network/server/configuarations"

export default async function Policy() {
  const response = await getConfigurations("policy")
  const policyData = response.data[0]?.data as
    | {
        privacy_policy: string
        personal_policy: string
      }
    | undefined

  if (!policyData) {
    return <div>No data available</div>
  }
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="font-[family-name:var(--font-coiny)] xl:text-[40px] max-lg:text-2xl">Chính sách bảo mật</div>
      <p className="text-gray-500 xl:text-xl max-lg:text-base">{policyData.privacy_policy}</p>
      <div className="font-[family-name:var(--font-coiny)] xl:text-[40px] max-lg:text-2xl">
        Chính Sách Bảo Vệ Thông Tin Cá Nhân Khách Hàng
      </div>
      <p className="text-gray-500 xl:text-xl max-lg:text-base">{policyData.personal_policy}</p>
    </div>
  )
}
