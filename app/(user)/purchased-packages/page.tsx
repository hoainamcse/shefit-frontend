'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BackIcon } from '@/components/icons/BackIcon'
import { Button } from '@/components/ui/button'

export default function PurchasesPackages() {
  const router = useRouter()

  return (
    <div className="py-16 px-5 md:py-16 md:px-10 lg:p-[60px] max-w-[1543px]">
      <div className="flex items-center gap-[10px] mb-10 md:mb-16 cursor-pointer" onClick={() => router.back()}>
        <BackIcon color="#000000" style={{ marginBottom: '4px' }} />
        <div className="text-xl text-[#000000] font-semibold">Tóm tắt gói đã mua</div>
      </div>

      <div className="mb-7">
        <div className="text-3xl font-[family-name:var(--font-coiny)] font-bold text-[#FF7873] mb-7">
          Gói 1: Easy Slim
        </div>

        <ul className="list-disc pl-7 text-[#737373] text-base md:text-xl mb-7">
          <li>
            Gói TONE BODY <b>EASY SLIM</b> (người mới)
          </li>
          <li>4 lợi ích gói:</li>

          <li>
            <b>1- Tư vấn 5 loại phom dáng</b>:
          </li>
          <li>
            Dựa trên số đo 3 vòng, cân nặng & chiều cao, HLV Shefit sẽ phân tích phom dáng học viên (Quả Lê, Táo, Đồng
            Hồ Cát, Tam Giác Ngược, Chữ Nhật) và các phần cơ thể nên tập trung để đạt Tone Body nhanh nhất.
          </li>

          <li>
            <b>2- Giáo Án tập vừa sức, dễ theo</b>:
          </li>
          <li>
            Bí quyết nằm ở phối bài tập khoa học: kết hợp Cardio đốt mỡ tổng lực toàn thân và tập kháng lực tăng cơ ưu
            tiên <b>mông & rãnh bụng</b>
          </li>

          <li>
            <b>3- Thiết kế Menu</b>:
          </li>
          <li>
            Lượng calo, đạm, đường béo dựa trên chỉ số của từng chị, hỗ trợ dinh dưỡng giảm mỡ tăng cơ. Công thức món
            đơn giản dễ chuẩn bị hàng ngày.
          </li>

          <li>
            <b>4-</b> TẶNG <b>Detox Thuần Tự Nhiên</b>:
          </li>
          <li>
            Gói kèm theo Lá Thảo Mộc từ lá ổi, giảo cổ lam, lá sen giúp thải mỡ bụng dưới hay Bột Cải Xoăn Organic bổ
            sung chất xơ, no lâu giảm cân (chọn 1 trong 2)
          </li>

          <li>----</li>

          <li>
            KẾT QUẢ sau 1 tháng: hơn 90% học viên giảm trung bình 3-4kg mỡ, giảm 7-10cm vòng eo, 𝐛𝐮̣𝐧𝐠 𝐝𝐮̛𝐨̛́𝐢 𝐩𝐡𝐚̆̉𝐧𝐠, tay &
            chân thon gọn, nhưng MÔNG không giảm mà cao săn chắc căng tròn.
          </li>
        </ul>

        <div className="text-[#000000] font-medium text-base md:text-xl">
          <div>Bắt Đầu: 2/9/2024</div>
          <div>Kết Thúc: 2/12/2024</div>
        </div>
      </div>

      <div className="mb-7">
        <div className="text-3xl font-[family-name:var(--font-coiny)] font-bold text-[#FF7873] mb-7">
          Gói 2: Body Shape
        </div>

        <ul className="list-disc pl-7 text-[#737373] text-base md:text-xl mb-7">
          <li>
            Gói TONE BODY <b>BODY SHAPE</b> (người có kinh nghiệm)
          </li>
          <li>4 lợi ích gói:</li>

          <li>
            <b>1- Tư vấn 5 loại phom dáng</b>:
          </li>
          <li>
            Dựa trên số đo 3 vòng, cân nặng & chiều cao, HLV Shefit phân tích phom dáng học viên (Quả Lê, Táo, Đồng Hồ
            Cát, Tam Giác Ngược, Chữ Nhật) biết được các phần hình thể nào cần tập trung để đạt Tone Body.
          </li>

          <li>
            <b>2- Giáo Án tập</b> chuyên sâu "Bơm" Mông:
          </li>
          <li>
            Bí quyết nằm ở phối bài tập khoa học: đan xen Đốt Mỡ HIIT cường độ cao toàn thân và tập kháng lực nhiều vòng
            lặp Cắt Nét Cơ mông & bụng.
          </li>

          <li>
            <b>3- Thiết kế Menu</b>:
          </li>
          <li>
            Lượng calo, đạm, đường béo thực đơn dựa trên chỉ số của từng chị, đảm bảo dinh dưỡng giảm mỡ tăng cơ. Công
            thức món đơn giản dễ chuẩn bị hàng ngày.
          </li>

          <li>
            <b>4-</b> TẶNG <b>Detox Thuần Tự Nhiên</b>:
          </li>
          <li>
            Gói kèm theo Lá Thảo Mộc từ lá ổi, giảo cổ lam, lá sen thải mỡ bụng dưới hay Bột Cải Xoăn Organic bổ sung
            chất xơ, no lâu giảm cân (chọn 1 trong 2)
          </li>

          <li>----</li>

          <li>
            KẾT QUẢ SAU 1 tháng: hơn 90% học viên giảm mỡ cơ thể xuống dưới 22% lộ đường cong thắt eo giảm 7-10cm, lên
            rãnh bụng 11, rãnh lưng S, đặc biệt MÔNG đào siêu cao tròn
          </li>
        </ul>

        <div className="text-[#000000] font-medium text-base md:text-xl">
          <div>Bắt Đầu: 2/9/2024</div>
          <div>Kết Thúc: 2/12/2024</div>
        </div>
      </div>

      <Link href="/packages">
        <Button className="w-full bg-[#13D8A7] h-[38px] md:h-[48px] lg:h-[60px] rounded-[58px] text-base md:text-xl">
          Mua thêm gói
        </Button>
      </Link>
    </div>
  )
}
