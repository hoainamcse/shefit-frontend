"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { BackIcon } from "@/components/icons/BackIcon";
import { QrCodeIcon } from "@/components/icons/qr-code-icon";
import { PACKAGES } from "../const";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PackageDetail() {
  const params = useParams();
  const packageName = params.slug as keyof typeof PACKAGES;
  const router = useRouter();

  return PACKAGES[packageName] ? (
    <div className="flex">
      <div className="py-16 px-5 md:py-16 md:px-10 xl:p-[60px] flex-1 max-w-[832px]">
        <div
          className="flex items-center gap-[10px] mb-10 md:mb-16 cursor-pointer"
          onClick={() => router.back()}
        >
          <BackIcon color="#000000" style={{ marginBottom: "4px" }} />
          <div className="text-xl text-[#000000] font-semibold">Quay về</div>
        </div>

        <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[Coiny] mb-7">
          Gói {PACKAGES[packageName].number}: {PACKAGES[packageName].name}
        </div>

        <ul className="list-disc pl-7 text-base md:text-xl text-[#737373] mb-7">
          {PACKAGES[packageName].description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <div className="mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">
            Loại hình
          </div>
          <div className="flex items-center gap-[26px]">
            <div className="flex items-center gap-[14px]">
              <Checkbox className="w-8 h-8 border-[#737373]" />
              <div className="text-base md:text-xl text-[#737373]">
                Zoom HLV
              </div>
            </div>

            <div className="flex items-center gap-[14px]">
              <Checkbox className="w-8 h-8 border-[#737373]" />
              <div className="text-base md:text-xl text-[#737373]">Video</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">
            Thời gian
          </div>
          <div className="flex items-center flex-wrap gap-y-[30px] gap-x-[52px]">
            <div className="flex items-center gap-[14px]">
              <Checkbox className="w-8 h-8 border-[#737373]" />
              <div className="text-base md:text-xl text-[#737373]">1 tháng</div>
            </div>

            <div className="flex items-center gap-[14px]">
              <Checkbox className="w-8 h-8 border-[#737373]" />
              <div className="text-base md:text-xl text-[#737373]">3 tháng</div>
            </div>

            <div className="flex items-center gap-[14px]">
              <Checkbox className="w-8 h-8 border-[#737373]" />
              <div className="text-base md:text-xl text-[#737373]">6 tháng</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-2.5">
            Thời gian
          </div>
          <Input
            placeholder="Nhập code của bạn"
            className="h-[54px] text-base md:text-[18px] border-[#E2E2E2]"
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl">
            Tổng tiền
          </div>
          <div className="text-[#00C7BE] font-semibold text-2xl">
            1.150.000 vnđ
          </div>
        </div>

        <div>
          <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[Coiny] mb-[14px]">
            Chọn quà tặng
          </div>

          <div className="text-base md:text-xl text-[#737373] mb-7">
            Được ship đến tận nhà!
          </div>

          <div className="flex flex-col gap-7 mb-7">
            {[1, 2, 3].map((item) => (
              <div key={item}>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Image
                      src="/temp/gift.jpg"
                      width={85}
                      height={85}
                      alt="gift"
                      className="rounded-[10px]"
                    />

                    <div>
                      <div className="text-[#000000] text-base md:text-xl font-medium mb-2">
                        Áo Jump Suit V12
                      </div>
                      <div className="text-[#737373] text-base md:text-xl">
                        Size L
                      </div>
                    </div>
                  </div>

                  <Checkbox className="w-8 h-8 border-[#737373]" />
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[Coiny] mb-[14px]">
              Hướng dẫn
            </div>

            <div className="text-[#737373] text-base md:text-xl mb-7">
              Sau khi chuyển khoản thành công, hệ thống sẽ kích hoạt tài khoản
              và bạn có thể xem các khóa tập & thực đơn!
            </div>

            <Dialog>
              <DialogTrigger className="w-full h-[38px] rounded-[26px] text-base md:text-xl font-normal text-[#FFFFFF] bg-[#13D8A7]">
                Mua gói
              </DialogTrigger>

              <DialogContent className="px-7 py-12 md:px-20 md:py-10 max-w-[90%] lg:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center">
                  <QrCodeIcon className="w-[151px] h-[151px] md:w-[256px] md:h-[256px]" />

                  <div className="text-[#000000] text-base md:text-xl font-bold mt-5 mb-7 text-center">
                    <div>Số Tiền: 250,000đ</div>
                    <div>Stk: 00000000</div>
                    <div>Nội Dung: af2kghj</div>
                  </div>

                  <div className="text-[#737373] text-base md:text-xl">
                    <div className="mb-7 md:mb-8">
                      Vui lòng quét mã QR để thanh toán, chú ý đúng số tiền và
                      nội dung thanh toán
                    </div>

                    <div>
                      Vui Lòng Đợi Trong 30p để hệ thống kích hoạt gói cho bạn
                    </div>
                    <div>Hotline: 0852055516</div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="hidden lg:block flex-1">
        <div className="w-full aspect-[2/3] relative">
          <Image
            src="/two-women-doing-exercises.avif"
            fill
            className="object-cover"
            alt="image"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="p-[60px]">Gói này không tồn tại</div>
  );
}
