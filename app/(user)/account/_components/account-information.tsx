"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

import { FormInputField, FormSelectField } from "@/components/forms/fields"
import { getValuable } from "@/lib/helpers"

import { getUserById } from "@/network/server/user"
import { PROVINCES } from "@/lib/label"
import { useSession } from "@/hooks/use-session"

export default function AccountInformation() {
  const [showNewForm, setShowNewForm] = useState(false)
  const [data, setData] = useState<any>(null)

  const { session } = useSession()

  useEffect(() => {
    async function fetchUser() {
      if (!session) return
      const res = await getUserById(session.userId as string)
      if (res && res.data) {
        setData({
          username: res.data.username || "",
          fullname: res.data.fullname || "",
          phone_number: res.data.phone_number || "",
          province: res.data.province || "",
          address: res.data.address || "",
          password: "",
          new_password: "",
          role: res.data.role || "",
        })
      }
    }
    fetchUser()
  }, [session])

  const form = useForm({
    defaultValues: {
      username: data?.username || "",
      fullname: data?.fullname || "",
      phone_number: data?.phone_number || "",
      province: data?.province || "",
      address: data?.address || "",
      password: "",
      new_password: "",
      role: data?.role || "",
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        username: data.username || "",
        fullname: data.fullname || "",
        phone_number: data.phone_number || "",
        province: data.province || "",
        address: data.address || "",
        password: "",
        new_password: "",
        role: data.role || "",
      })
    }
  }, [data])

  const onSubmit = (data: any) => {
    console.log(getValuable(data))
  }

  return (
    <div className="flex">
      <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px] flex-1 lg:max-w-[832px]">
        {showNewForm ? (
          <Form {...form} key="password-form">
            <form className="space-y-8">
              <FormInputField
                form={form}
                name="password"
                label="Mật khẩu cũ"
                placeholder="Nhập mật khẩu cũ"
                type="password"
              />
              <FormInputField
                form={form}
                name="new_password"
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                type="password"
              />
              <FormInputField form={form} name="fullname" label="Họ & tên" placeholder="Nhập họ & tên" type="text" />
              <FormInputField
                form={form}
                name="phone_number"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                type="text"
              />
              <FormSelectField
                form={form}
                name="province"
                label="Tỉnh / thành phố"
                placeholder="Chọn tỉnh/thành phố của bạn đang sống"
                data={PROVINCES}
              />
              <FormInputField form={form} name="address" label="Địa chỉ" placeholder="Nhập địa chỉ" type="text" />
              <Button
                type="button"
                className="bg-[#13D8A7] h-[38px] w-full text-base md:text-xl font-normal rounded-[26px]"
                onClick={() => {
                  form.reset({
                    ...form.getValues(),
                    password: "",
                    new_password: "",
                  })
                  setShowNewForm(false)
                }}
              >
                Xác nhận thay đổi thông tin
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...form} key="info-form">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormInputField
                form={form}
                name="username"
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập của bạn"
              />

              <FormInputField form={form} name="fullname" label="Họ & tên" placeholder="Nhập tên của bạn" />

              <FormInputField
                form={form}
                name="phone_number"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại của bạn"
              />

              <FormInputField
                form={form}
                name="province"
                label="Tỉnh / thành phố"
                placeholder="Chọn tỉnh/thành phố của bạn đang sống"
              />

              <FormInputField form={form} name="address" label="Địa chỉ chi tiết" placeholder="Nhập địa chỉ của bạn" />

              <Button
                type="button"
                className="bg-[#13D8A7] h-[38px] w-full text-base md:text-xl font-normal rounded-[26px]"
                onClick={() => {
                  form.reset({
                    ...form.getValues(),
                    password: "",
                    new_password: "",
                  })
                  setShowNewForm(true)
                }}
              >
                Cập nhật thông tin
              </Button>
            </form>
          </Form>
        )}
      </div>

      <div className="hidden lg:block flex-1">
        <div className="w-full aspect-[2/3] relative">
          <Image src="/two-women-doing-exercises.avif" fill className="object-cover" alt="image" />
        </div>
      </div>
    </div>
  )
}
