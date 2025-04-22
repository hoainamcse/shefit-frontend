import Image from "next/image"
import ImagteTitle from "@/assets/image/ImageTitle.png"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/network/server/products"
import { getColors } from "@/network/server/products"
import { getCategories } from "@/network/server/products"
import type { Product } from "@/models/products"

function SelectHero({
  placeholder,
  options,
  onChange,
  value,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  onChange?: (value: string) => void
  value: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default async function ProductPage() {
  const productsResponse = await getProducts()
  const products = productsResponse.data || []
  const colorsResponse = await getColors()
  const colors = colorsResponse.data || []
  const categoriesResponse = await getCategories()
  const categories = categoriesResponse.data || []

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
            <SelectHero
              placeholder="Loại"
              options={categories.map((category) => ({ value: category.id.toString(), label: category.name }))}
              value={""}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-10">
          {products.map((product: Product) => (
            <Link href={`/equipment/${product.id}`} key={product.id}>
              <div key={`menu-${product.id}`} className="text-xl">
                <div className="relative group">
                  <img
                    src={product.image_urls[0] || ""}
                    alt={product.name}
                    className="aspect-1 object-cover rounded-xl mb-4 w-full h-[373px]"
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <div className="flex gap-2 mb-2">
                  {product.variants.map((variant) => {
                    const hex = colors.find((color) => color.id === variant.color_id)?.hex_code || "#000"
                    return (
                      <Button
                        key={variant.id}
                        style={{ backgroundColor: hex }}
                        className="rounded-full w-8 h-8"
                        disabled={!variant.in_stock}
                      />
                    )
                  })}
                </div>
                <p className="font-medium">{product.name}</p>
                <p className="text-[#737373]">{product.description}</p>
                <p className="text-[#737373]">{product.price.toLocaleString()} vnđ</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
