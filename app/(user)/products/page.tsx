"use client"

import Image from "next/image"
import ImagteTitle from "@/assets/image/ImageTitle.png"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/network/server/products"
import { getColors } from "@/network/server/products"
import { getCategories } from "@/network/server/products"
import type { Product } from "@/models/products"
import FilterCategory from "./_components/FilterCategory"
import { useEffect, useState } from "react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [colors, setColors] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchData() {
      const productsResponse = await getProducts()
      setProducts(productsResponse.data || [])
      const colorsResponse = await getColors()
      setColors(colorsResponse.data || [])
      const categoriesResponse = await getCategories()
      setCategories(categoriesResponse.data || [])
      console.log(productsResponse.data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category_id?.toString() === selectedCategory))
    }
  }, [selectedCategory, products])

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
            <FilterCategory
              placeholder="Loại"
              options={categories.map((category) => ({ value: category.id.toString(), label: category.name }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-10">
          {filteredProducts.map((product: Product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
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
                  {(() => {
                    const uniqueColorIds = new Set(product.variants.map((variant) => variant.color_id))
                    return Array.from(uniqueColorIds)
                      .filter(Boolean)
                      .map((colorId) => {
                        const hex = colors.find((color) => color.id === colorId)?.hex_code || "#fff"
                        const inStock = product.variants.some((v) => v.color_id === colorId && v.in_stock)
                        return (
                          <Button
                            key={`color-${colorId}`}
                            style={{ backgroundColor: hex }}
                            className="rounded-full w-8 h-8"
                            disabled={!inStock}
                          />
                        )
                      })
                  })()}
                </div>
                <p className="font-medium">{product.name}</p>
                <p className="text-[#737373]">
                  {Array.from(new Set(product.variants.map((variant) => variant.color_id)))
                    .map((colorId) => colors.find((color) => color.id === colorId)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-[#737373]">{product.price.toLocaleString()} VNĐ</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
