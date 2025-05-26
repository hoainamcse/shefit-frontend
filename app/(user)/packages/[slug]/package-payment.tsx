"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCodeIcon } from "@/components/icons/qr-code-icon"
import { Input } from "@/components/ui/input"

interface Price {
  id: number
  duration: number
  price: number
}

interface PackagePaymentProps {
  prices: Price[]
  defaultPrice: number
  packageName: string
}

export function PackagePayment({ prices, defaultPrice, packageName }: PackagePaymentProps) {
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(defaultPrice || 0)

  const handlePriceSelect = (priceId: number, price: number) => {
    if (selectedPriceId === priceId) return
    setSelectedPriceId(priceId)
    setTotalPrice(price)
  }

  return (
    <>
      <div className="mb-8">
        <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">Thời gian</div>
        <div className="flex items-center flex-wrap gap-y-[30px] gap-x-[52px]">
          {prices.map((price) => (
            <div className="flex items-center gap-[14px]" key={price.id}>
              <Checkbox
                className="w-8 h-8 border-[#737373]"
                checked={selectedPriceId === price.id}
                onCheckedChange={() => handlePriceSelect(price.id, price.price)}
              />
              <div className="text-base md:text-xl text-[#737373]">{price.duration} tháng</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-2.5">Code khuyến mãi</div>
        <Input placeholder="Nhập code của bạn" className="h-[54px] text-base md:text-[18px] border-[#E2E2E2]" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="font-semibold text-[#000000] text-xl md:text-2xl">Tổng tiền</div>
        <div className="text-[#00C7BE] font-semibold text-2xl">{(totalPrice || 0).toLocaleString()} vnđ</div>
      </div>

      <Dialog>
        <DialogTrigger className="w-full h-[38px] rounded-[26px] text-base md:text-xl font-normal text-[#FFFFFF] bg-[#13D8A7] mb-8">
          Mua gói
        </DialogTrigger>

        <DialogContent className="px-7 py-12 md:px-20 md:py-10 max-w-[90%] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center">
            <QrCodeIcon className="w-[151px] h-[151px] md:w-[256px] md:h-[256px]" />

            <div className="text-[#000000] text-base md:text-xl font-bold mt-5 mb-7 text-center">
              <div>Số Tiền: {(totalPrice || 0).toLocaleString()}đ</div>
              <div>Stk: 00000000</div>
              <div>Nội Dung: {packageName}</div>
            </div>

            <div className="text-[#737373] text-base md:text-xl">
              <div className="mb-7 md:mb-8">
                Vui lòng quét mã QR để thanh toán, chú ý đúng số tiền và nội dung thanh toán
              </div>

              <div>Vui Lòng Đợi Trong 30p để hệ thống kích hoạt gói cho bạn</div>
              <div>Hotline: 0852055516</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
