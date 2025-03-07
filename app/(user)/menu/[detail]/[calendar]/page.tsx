"use client"

import Image from "next/image"
import MenuDetailImage from "@/assets/image/MenuDetail.png"
import { Button } from "@/components/ui/button"
import Header from "@/components/common/Header"
import MenuResponsive from "@/assets/image/MenuResponsive.png"
import { useState } from "react"
import Link from "next/link"
import { BackIcon } from "@/components/icons/BackIcon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MenuDetailCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(1)

  const handleDayClick = (day: number) => {
    setSelectedDay(day)
  }
  const data: Array<{
    id: number
    name: string
    sales: string
  }> = [
    {
      id: 1,
      name: "Thịt cá",
      sales: "",
    },
    {
      id: 2,
      name: "Rau củ",
      sales: "",
    },
    {
      id: 3,
      name: "Tinh bột",
      sales: "",
    },
    {
      id: 4,
      name: "Gia vị",
      sales: "",
    },
    {
      id: 5,
      name: "Khác",
      sales: "",
    },
  ]
  return (
    <div>
      <div className="xl:block max-lg:hidden">
        <Header />
      </div>
      <div className="flex flex-col items-center justify-center mt-16 max-lg:mt-0 mx-auto xl:w-[1800px] max-lg:w-full">
        <div className="relative w-full">
          <Link
            href="#"
            className="absolute top-0 left-0 mt-8 ml-2 xl:hidden max-lg:block hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <Button className="flex items-center gap-2 text-xl bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent">
              <BackIcon /> Quay về
            </Button>
          </Link>
          <Image src={MenuDetailImage} alt="Menu detail image" className="xl:block max-lg:hidden" />
          <Image src={MenuResponsive} alt="Menu detail image" className="xl:hidden max-lg:block" />
        </div>
        <div className="mr-auto text-xl mt-8 max-lg:p-4">
          <p className="font-bold">Giảm cân</p>
          <p className="text-[#737373]">Ăn chay giảm cân</p>
          <p className="text-[#737373]">Chef Phương Anh - 30 ngày</p>
        </div>
        <div className="w-full max-lg:p-4">
          <div className="bg-primary h-[228px] w-full rounded-[20px] my-20 max-lg:my-2">
            <div className="xl:w-[696px] max-lg:w-full mx-auto text-white h-full flex flex-col items-center justify-center">
              <div className="text-center text-[40px] font-bold mb-10">Kết quả</div>
              <ul className="text-[#F7F7F7] text-xl list-disc mr-auto max-lg:px-8">
                <li>Giảm cân</li>
                <li>Chay thanh đạm</li>
                <li>Nhiều rau xanh</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mr-auto text-xl my-20 max-lg:my-0 max-lg:p-4">
          <div className="font-[family-name:var(--font-coiny)] text-text text-[40px] max-lg:text-[30px] mb-5">
            Menu theo lịch
          </div>
          <div>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </div>
        </div>
        <div className="text-xl mt-10 w-full flex flex-wrap justify-start">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              onClick={() => handleDayClick(i + 1)}
              className={`rounded-full mx-[10px] my-5 w-[63px] h-[64px] flex flex-col items-center justify-center font-medium text-xl cursor-pointer ${
                selectedDay === i + 1 ? "bg-[#91EBD5] text-white" : ""
              }`}
            >
              <div>Ngày</div>
              <div>{i + 1}</div>
            </div>
          ))}
        </div>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={MenuDetailImage} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Sáng: Món ABC</div>
            <div className="text-[#737373]">KCAL 300 Pro 11 Fat 9 Carb 8 Fiber 7</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHead>
              <TableRow>
                <TableHeader className="text-center border">Thành phần</TableHeader>
                <TableHeader className="text-center border">Nguyên liệu</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody className="text-[#737373]">
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border">{item.name}</TableCell>
                  <TableCell className="border text-right">{item.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </div>
        </div>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={MenuDetailImage} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Trưa: Món ABC</div>
            <div className="text-[#737373]">KCAL 300 Pro 11 Fat 9 Carb 8 Fiber 7</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHead>
              <TableRow>
                <TableHeader className="text-center border">Thành phần</TableHeader>
                <TableHeader className="text-center border">Nguyên liệu</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody className="text-[#737373]">
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border">{item.name}</TableCell>
                  <TableCell className="border text-right">{item.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </div>
        </div>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={MenuDetailImage} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Tối: Món ABC</div>
            <div className="text-[#737373]">KCAL 300 Pro 11 Fat 9 Carb 8 Fiber 7</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHead>
              <TableRow>
                <TableHeader className="text-center border">Thành phần</TableHeader>
                <TableHeader className="text-center border">Nguyên liệu</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody className="text-[#737373]">
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border">{item.name}</TableCell>
                  <TableCell className="border text-right">{item.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </div>
        </div>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={MenuDetailImage} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Phụ: Món ABC</div>
            <div className="text-[#737373]">KCAL 300 Pro 11 Fat 9 Carb 8 Fiber 7</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHead>
              <TableRow>
                <TableHeader className="text-center border">Thành phần</TableHeader>
                <TableHeader className="text-center border">Nguyên liệu</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody className="text-[#737373]">
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border">{item.name}</TableCell>
                  <TableCell className="border text-right">{item.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </div>
        </div>
      </div>
    </div>
  )
}
