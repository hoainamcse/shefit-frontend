import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import ImagteTitle from "@/assets/image/ImageTitle.png"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

function SelectHero({ placeholder }: { placeholder: string }) {
  const data = [
    {
      value: "ao",
      label: "Áo",
    },
    {
      value: "quan",
      label: "Quần",
    },
    {
      value: "ta",
      label: "Tạ",
    },
    {
      value: "balo",
      label: "Balo",
    },
  ]

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function Equipment() {
  return (
    <div className="flex flex-col gap-10">
      <Image src={ImagteTitle} className="w-full object-cover xl:h-[628px]" alt="" />
      <div className="mb-20 p-6 mt-20">
        <div className="flex flex-col gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Title</div>
          <p className="text-[#737373] text-xl">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit.
          </p>
          <div className="flex gap-4 xl:w-1/3">
            <SelectHero placeholder="Loại" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-10">
          {Array.from({ length: 15 }).map((_, index) => (
            <Link href={`/equipment/${index}`} key={index}>
              <div key={`menu-${index}`} className="text-xl">
                <div className="relative group">
                  <Image src={ShoppingImage} alt="" className="aspect-1 object-cover rounded-xl mb-4" />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <div className="flex gap-2 mb-2">
                  <Button className="rounded-full w-8 h-8 bg-[#000000]"></Button>
                  <Button className="rounded-full w-8 h-8 bg-[#AFA69F]"></Button>
                </div>
                <p className="font-medium">Áo Jump Suit V12</p>
                <p className="text-[#737373]">Đen</p>
                <p className="text-[#737373]">350.000 vnđ</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
