'use client'

import { useState } from 'react'
import z from 'zod'
import Image from 'next/image'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'

import { FormInputField, FormSelectField } from '@/components/forms/fields'
import { zodResolver } from '@hookform/resolvers/zod'
import { getValuable } from '@/lib/utils'

const PROVINCES = [
  { value: 'An Giang', label: 'An Giang' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'Bắc Giang', label: 'Bắc Giang' },
  { value: 'Bắc Kạn', label: 'Bắc Kạn' },
  { value: 'Bạc Liêu', label: 'Bạc Liêu' },
  { value: 'Bắc Ninh', label: 'Bắc Ninh' },
  { value: 'Bến Tre', label: 'Bến Tre' },
  { value: 'Bình Định', label: 'Bình Định' },
  { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Bình Phước', label: 'Bình Phước' },
  { value: 'Bình Thuận', label: 'Bình Thuận' },
  { value: 'Cà Mau', label: 'Cà Mau' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Cao Bằng', label: 'Cao Bằng' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Đắk Lắk', label: 'Đắk Lắk' },
  { value: 'Đắk Nông', label: 'Đắk Nông' },
  { value: 'Điện Biên', label: 'Điện Biên' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Đồng Tháp', label: 'Đồng Tháp' },
  { value: 'Gia Lai', label: 'Gia Lai' },
  { value: 'Hà Giang', label: 'Hà Giang' },
  { value: 'Hà Nam', label: 'Hà Nam' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
  { value: 'Hải Dương', label: 'Hải Dương' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Hậu Giang', label: 'Hậu Giang' },
  { value: 'Hòa Bình', label: 'Hòa Bình' },
  { value: 'Hưng Yên', label: 'Hưng Yên' },
  { value: 'Khánh Hòa', label: 'Khánh Hòa' },
  { value: 'Kiên Giang', label: 'Kiên Giang' },
  { value: 'Kon Tum', label: 'Kon Tum' },
  { value: 'Lai Châu', label: 'Lai Châu' },
  { value: 'Lâm Đồng', label: 'Lâm Đồng' },
  { value: 'Lạng Sơn', label: 'Lạng Sơn' },
  { value: 'Lào Cai', label: 'Lào Cai' },
  { value: 'Long An', label: 'Long An' },
  { value: 'Nam Định', label: 'Nam Định' },
  { value: 'Nghệ An', label: 'Nghệ An' },
  { value: 'Ninh Bình', label: 'Ninh Bình' },
  { value: 'Ninh Thuận', label: 'Ninh Thuận' },
  { value: 'Phú Thọ', label: 'Phú Thọ' },
  { value: 'Phú Yên', label: 'Phú Yên' },
  { value: 'Quảng Bình', label: 'Quảng Bình' },
  { value: 'Quảng Nam', label: 'Quảng Nam' },
  { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Quảng Trị', label: 'Quảng Trị' },
  { value: 'Sóc Trăng', label: 'Sóc Trăng' },
  { value: 'Sơn La', label: 'Sơn La' },
  { value: 'Tây Ninh', label: 'Tây Ninh' },
  { value: 'Thái Bình', label: 'Thái Bình' },
  { value: 'Thái Nguyên', label: 'Thái Nguyên' },
  { value: 'Thanh Hóa', label: 'Thanh Hóa' },
  { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
  { value: 'Tiền Giang', label: 'Tiền Giang' },
  { value: 'TP Hồ Chí Minh', label: 'TP Hồ Chí Minh' },
  { value: 'Trà Vinh', label: 'Trà Vinh' },
  { value: 'Tuyên Quang', label: 'Tuyên Quang' },
  { value: 'Vĩnh Long', label: 'Vĩnh Long' },
  { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
  { value: 'Yên Bái', label: 'Yên Bái' },
]

export default function AccountInformation() {
  const [data, setData] = useState<any>(null)

  const FormSchema = z.object({
    username: z.string().min(6, {
      message: 'Tên đăng nhập phải có ít nhất 6 ký tự',
    }),
    password: z.string().min(6, {
      message: 'Mật khẩu phải có ít nhất 6 ký tự',
    }),
    fullname: z.string().min(6, {
      message: 'Tên phải có ít nhất 6 ký tự',
    }),
    phone_number: z.string().min(6, {
      message: 'Số điện thoại phải có ít nhất 6 ký tự',
    }),
    city: z.enum([...PROVINCES.map((province) => province.value)] as [string, ...string[]], {
      message: 'Bạn phải chọn tỉnh/thành phố',
    }),
    address: z.string().min(6, {
      message: 'Địa chỉ phải có ít nhất 6 ký tự',
    }),
  })

  type FormData = z.infer<typeof FormSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: data
      ? { ...data }
      : {
          username: '',
          password: '',
          fullname: '',
          phone_number: '',
          city: '',
          address: '',
        },
  })

  const onSubmit = (data: FormData) => {
    console.log(getValuable(data))
  }

  return (
    <div className="flex">
      <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px] flex-1 lg:max-w-[832px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormInputField
              form={form}
              name="username"
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập của bạn"
            />

            <FormInputField form={form} name="password" label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" />

            <FormInputField form={form} name="fullname" label="Họ & tên" placeholder="Nhập tên của bạn" />

            <FormInputField
              form={form}
              name="phone_number"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại của bạn"
            />

            <FormSelectField
              form={form}
              name="city"
              label="Tỉnh / thành phố"
              placeholder="Chọn tỉnh/thành phố của bạn đang sống"
              data={PROVINCES}
            />

            <FormInputField form={form} name="address" label="Địa chỉ chi tiết" placeholder="Nhập địa chỉ của bạn" />

            <Button
              type="submit"
              className="bg-[#13D8A7] h-[38px] w-full text-base md:text-xl font-normal rounded-[26px]"
            >
              Cập nhật thông tin
            </Button>
          </form>
        </Form>
      </div>

      <div className="hidden lg:block flex-1">
        <div className="w-full aspect-[2/3] relative">
          <Image src="/two-women-doing-exercises.avif" fill className="object-cover" alt="image" />
        </div>
      </div>
    </div>
  )
}
