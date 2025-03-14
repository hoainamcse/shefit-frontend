import Link from "next/link";
import { BackIcon } from "@/components/icons/BackIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const PACKAGES = {
  "easy-slim": {
    number: 1,
    name: "Easy Slim",
    packageText: "Gói ",
    description: [
      "Cho người mới chưa có kinh nghiệm tập, sức yếu, sau sinh, béo lâu năm",
      "Lộ Trình Tập Dễ Theo",
      "Hơn 50 Khóa Tập và 500+ Động Tác",
      "20 Thực Đơn Siết Mỡ Tăng Cơ và 300 công thức món",
      "Tặng Kèm Detox thuần tự nhiên",
    ],
    detail: (
      <ul className="list-disc pl-5 text-[#737373] text-base md:text-xl">
        <li>
          Gói TONE BODY <b>EASY SLIM</b> (người mới)
        </li>
        <li>4 lợi ích gói:</li>

        <li>
          <b>1- Tư vấn 5 loại phom dáng</b>:
        </li>
        <li>
          Dựa trên số đo 3 vòng, cân nặng & chiều cao, HLV Shefit sẽ phân tích
          phom dáng học viên (Quả Lê, Táo, Đồng Hồ Cát, Tam Giác Ngược, Chữ
          Nhật) và các phần cơ thể nên tập trung để đạt Tone Body nhanh nhất.
        </li>

        <li>
          <b>2- Giáo Án tập vừa sức, dễ theo</b>:
        </li>
        <li>
          Bí quyết nằm ở phối bài tập khoa học: kết hợp Cardio đốt mỡ tổng lực
          toàn thân và tập kháng lực tăng cơ ưu tiên <b>mông & rãnh bụng</b>
        </li>

        <li>
          <b>3- Thiết kế Menu</b>:
        </li>
        <li>
          Lượng calo, đạm, đường béo dựa trên chỉ số của từng chị, hỗ trợ dinh
          dưỡng giảm mỡ tăng cơ. Công thức món đơn giản dễ chuẩn bị hàng ngày.
        </li>

        <li>
          <b>4-</b> TẶNG <b>Detox Thuần Tự Nhiên</b>:
        </li>
        <li>
          Gói kèm theo Lá Thảo Mộc từ lá ổi, giảo cổ lam, lá sen giúp thải mỡ
          bụng dưới hay Bột Cải Xoăn Organic bổ sung chất xơ, no lâu giảm cân
          (chọn 1 trong 2)
        </li>

        <li>----</li>

        <li>
          👉KẾT QUẢ sau 1 tháng: hơn 90% học viên giảm trung bình 3-4kg mỡ, giảm
          7-10cm vòng eo, 𝐛𝐮̣𝐧𝐠 𝐝𝐮̛𝐨̛́𝐢 𝐩𝐡𝐚̆̉𝐧𝐠, tay & chân thon gọn, nhưng MÔNG không
          giảm mà cao săn chắc căng tròn.
        </li>
      </ul>
    ),
  },
  "body-shape": {
    number: 2,
    packageText: "Gói ",
    name: "Body Shape",
    description: [
      "Cho chị đã tập aerobic, gym, yoga muốn cắt nét dáng hiệu quả hơn",
      "Lộ Trình Tập Cắt Nét Cơ",
      "Hơn 30 Khóa Tập và 400+ Động Tác",
      "10 Thực Đơn Giảm Mỡ Tăng Cơ và 200 công thức món",
      "Tặng Kèm Detox thuần tự nhiên",
    ],
    detail: (
      <ul className="list-disc pl-5 text-[#737373] text-base md:text-xl">
        <li>
          Gói TONE BODY <b>BODY SHAPE</b> (người có kinh nghiệm)
        </li>
        <li>4 lợi ích gói:</li>

        <li>
          <b>1- Tư vấn 5 loại phom dáng</b>:
        </li>
        <li>
          Dựa trên số đo 3 vòng, cân nặng & chiều cao, HLV Shefit phân tích phom
          dáng học viên (Quả Lê, Táo, Đồng Hồ Cát, Tam Giác Ngược, Chữ Nhật)
          biết được các phần hình thể nào cần tập trung để đạt Tone Body.
        </li>

        <li>
          <b>2- Giáo Án tập</b> chuyên sâu "Bơm" Mông:
        </li>
        <li>
          Bí quyết nằm ở phối bài tập khoa học: đan xen Đốt Mỡ HIIT cường độ cao
          toàn thân và tập kháng lực nhiều vòng lặp Cắt Nét Cơ mông & bụng.
        </li>

        <li>
          <b>3- Thiết kế Menu</b>:
        </li>
        <li>
          Lượng calo, đạm, đường béo thực đơn dựa trên chỉ số của từng chị, đảm
          bảo dinh dưỡng giảm mỡ tăng cơ. Công thức món đơn giản dễ chuẩn bị
          hàng ngày.
        </li>

        <li>
          <b>4-</b> TẶNG <b>Detox Thuần Tự Nhiên</b>:
        </li>
        <li>
          Gói kèm theo Lá Thảo Mộc từ lá ổi, giảo cổ lam, lá sen thải mỡ bụng
          dưới hay Bột Cải Xoăn Organic bổ sung chất xơ, no lâu giảm cân (chọn 1
          trong 2)
        </li>

        <li>----</li>

        <li>
          👉KẾT QUẢ SAU 1 tháng: hơn 90% học viên giảm mỡ cơ thể xuống dưới 22%
          lộ đường cong thắt eo giảm 7-10cm, lên rãnh bụng 11, rãnh lưng S, đặc
          biệt MÔNG đào siêu cao tròn
        </li>
      </ul>
    ),
  },
  "coaching-1-1": {
    number: 3,
    packageText: "",
    name: "Coaching 1:1",
    description: [
      "Cho chị muốn HLV thiết kế lộ trình riêng theo số đo & 5 loại Phom Dáng",
      "Lộ Trinh Tập & Thực Đơn riêng biệt",
      "Tặng Kèm Detox",
    ],
    detail: (
      <ul className="list-disc pl-5 text-[#737373] text-base md:text-xl">
        <li>
          <b>Gói Coaching 1 kèm 1 - Cá Nhân Hóa</b> dựa trên phom dáng & số đo
        </li>
        <li>🌟 Lộ Trình Tập + Thực Đơn Riêng</li>
        <li>
          💪 Thiết kế bởi các HLV NỮ nổi tiếng Maria Nguyen, Vi Salano, Thục
          Uyên top các giải thưởng fitness nữ.
        </li>
        <li>1️⃣Về body đẹp nhất so với phom dáng</li>
        <li>
          2️⃣Mỗi chị có một phom dáng riêng, Coaching 11 giúp đạt tỷ cân nặng, số
          đo hoàn hảo nhất với phom dáng.
        </li>
        <li>Thiết kế mỗi chị 1 Lộ Trình Duy Nhất:</li>
        <li>
          - Học viên làm bảng câu hỏi phom dáng, số đo & mục tiêu. (Phom Chữ
          Nhật, Đồng Hồ Cát, Quả Lê, Tam Giác, Táo)
        </li>
        <li>- HLV lên Giáo Án Tập & Thực Đơn riêng cho từng chị.</li>
        <li>
          - TẶNG <b>Detox Thuần Tự Nhiên</b> gói kèm theo Lá Thảo Mộc từ lá ổi,
          giảo cổ lam, lá sen hỗ trợ thải mỡ bụng dưới hay Bột Cải Xoăn Organic
          bổ sung chất xơ, no lâu giảm cân (chọn 1 trong 2)
        </li>
        <li>--------</li>
        <li>
          👉KẾT QUẢ sau 1 tháng: hơn 90% học viên giảm mỡ cơ thể xuống dưới 22%,
          lộ đường cong thắt eo giảm 7-10cm, lên rãnh bụng 11, rãnh lưng S, đặc
          biệt mông đào siêu cao tròn. Quan trọng nhất là đạt tỷ lệ chuẩn với
          phom dáng ạ😘
        </li>
      </ul>
    ),
  },
};

export default function PurchasePackage() {
  return (
    <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px]">
      <div className="font-[Coiny] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-3.5">
        Mua Gói Độ Dáng
      </div>

      <div className="text-[#737373] text-base md:text-xl max-w-[400px] mb-6">
        Mua gói độ dáng để bắt đầu các khóa tập và thực đơn
      </div>

      <div className="flex flex-col gap-16">
        {(Object.keys(PACKAGES) as Array<keyof typeof PACKAGES>).map((key) => (
          <div key={key} className="bg-[#FFAEB01A] rounded-[20px] py-7 px-5">
            <div>
              <div className="flex justify-between">
                <div className="font-[Coiny] text-[#000000] text-xl md:text-2xl mb-[18px]">
                  Gói {PACKAGES[key].name}
                </div>

                <Dialog>
                  <DialogTrigger className="h-fit text-base md:text-xl lg:text-2xl text-[#13D8A7] mb-[18px] max-md:font-light">
                    Chi tiết
                  </DialogTrigger>
                  <DialogContent className="max-md:px-2 max-w-[90%] lg:max-w-[824px]">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-[#FF7873] font-[Coiny] text-3xl md:text-[40px] md:leading-[44px] text-center">
                        {PACKAGES[key].packageText}
                        {PACKAGES[key].name}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="w-full h-[400px] overflow-y-auto">
                      <div>{PACKAGES[key].detail}</div>
                    </div>

                    <DialogFooter className="pt-6 text-center">
                      <Link href={`/packages/${key}`} className="w-full">
                        <Button className="bg-[#13D8A7] rounded-[26px] h-[38px] md:h-12 text-base md:text-xl w-[190px] md:w-full">
                          Chọn gói
                        </Button>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ul className="list-disc pl-7 text-base md:text-xl text-[#737373] max-w-[340px] mb-[18px]">
                {PACKAGES[key].description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <Link href={`/packages/${key}`}>
                <Button className="bg-[#13D8A7] w-[190px] h-[38px] rounded-[26px] text-base md:text-xl font-normal md:pt-2.5 md:pb-1.5">
                  Chọn gói
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
