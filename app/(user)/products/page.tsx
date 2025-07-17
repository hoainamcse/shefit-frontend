'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getProducts, getColors, getCategories } from '@/network/client/products'
import type { Product } from '@/models/product'
import FilterCategory from './_components/FilterCategory'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [colors, setColors] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const productsResponse = await getProducts()
      setProducts(productsResponse.data || [])
      const colorsResponse = await getColors()
      setColors(colorsResponse.data || [])
      const categoriesResponse = await getCategories()
      setCategories(categoriesResponse.data || [])
      console.log(productsResponse.data)
      setIsLoading(false)
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
    <>
      <img src="/body-quiz-image.jpg" className="w-full object-cover lg:aspect-[1800/681] aspect-[440/280]" alt="" />
      <div className="flex flex-col gap-10 px-4 lg:px-12">
        <div className="mb-20 p-4 lg:mt-20 mt-0">
          <div className="flex flex-col gap-5 lg:mb-20 mb-10">
            <div className="font-[family-name:var(--font-coiny)] text-ring xl:text-[40px] text-3xl font-bold">
              Dụng Cụ & Thực Phẩm
            </div>
            <p className="text-[#737373] text-base lg:text-xl">Dụng cụ tập tại nhà & các loại thực phẩm Eat Clean</p>
            <div className="gap-2 w-full hidden md:flex">
              <FilterCategory
                placeholder="Loại"
                options={categories.map((category) => ({ value: category.id.toString(), label: category.name }))}
                value={selectedCategory}
                onChange={setSelectedCategory}
                isLoading={isLoading}
              />
            </div>
            <div className="flex gap-2 w-full md:hidden">
              <Select onValueChange={setSelectedCategory} value={selectedCategory || undefined}>
                <SelectTrigger className="w-full" disabled={isLoading}>
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isLoading && (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {filteredProducts.map((product: Product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div key={`menu-${product.id}`} className="text-xl">
                  <div className="relative group">
                    <img
                      src={product.image_urls[0] || ''}
                      alt={product.name}
                      className="aspect-square object-cover rounded-xl mb-4 w-full"
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <div className="flex gap-2 mb-2">
                    {(() => {
                      const uniqueColorIds = new Set(product.variants.map((variant) => variant.color_id))
                      return Array.from(uniqueColorIds)
                        .filter(Boolean)
                        .map((colorId) => {
                          const hex = colors.find((color) => color.id === colorId)?.hex_code || '#fff'
                          const inStock = product.variants.some((v) => v.color_id === colorId && v.in_stock)
                          return (
                            <Button
                              key={`color-${colorId}`}
                              style={{ backgroundColor: hex }}
                              className="rounded-full lg:w-8 lg:h-8 w-[19px] h-[19px] p-0"
                              disabled={!inStock}
                            />
                          )
                        })
                    })()}
                  </div>
                  <p className="font-medium lg:text-xl text-base">{product.name}</p>
                  <p className="text-[#737373] lg:text-xl text-base">
                    {Array.from(new Set(product.variants.map((variant) => variant.color_id)))
                      .map((colorId) => colors.find((color) => color.id === colorId)?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <p className="text-[#737373] lg:text-xl text-base">{product.price.toLocaleString()} VNĐ</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
