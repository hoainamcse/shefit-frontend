import React from "react"
import Image from "next/image"
import MenuDetail from "@/assets/image/MenuDetail.png"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
export default function MuscleDetail() {
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
    <div className="flex flex-col gap-10 mt-10">
      <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5 text-center">
        Salad gà
      </div>
      <Image src={MenuDetail} alt="" className="h-[680px]" />
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
      <div className="text-xl text-[#737373]">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis. Molestie
        nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus bibendum ad curae
        consequat.
      </div>
    </div>
  )
}
