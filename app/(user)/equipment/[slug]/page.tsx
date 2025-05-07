"use client"
import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CloseIcon } from "@/components/icons/CloseIcon"
import { AddIcon } from "@/components/icons/AddIcon"
import { MinusIcon } from "@/components/icons/MinusIcon"
import { getProduct, getColors, getSizes } from "@/network/server/products"
import { getMuscleGroups } from "@/network/server/muscle-group"
import { addCart, getCarts } from "@/network/server/cart"
import { toast } from "sonner"

export default function Equipment({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [colors, setColors] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [muscleGroups, setMuscleGroups] = useState<any[]>([])
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [colorOptions, setColorOptions] = useState<number[]>([])
  const [cartId, setCartId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const uniqueColorIds = Array.from<number>(new Set(product.variants.map((variant: any) => variant.color_id)))
      setColorOptions(uniqueColorIds)

      if (uniqueColorIds.length > 0 && selectedColorId === null) {
        const inStockColorIds = uniqueColorIds.filter((colorId) =>
          product.variants.some((variant: any) => variant.color_id === colorId && variant.in_stock)
        )

        if (inStockColorIds.length > 0) {
          setSelectedColorId(inStockColorIds[0])
        } else {
          setSelectedColorId(uniqueColorIds[0])
        }
      }
    }
  }, [product, selectedColorId])

  useEffect(() => {
    async function fetchData() {
      try {
        const productResponse = await getProduct(slug)
        setProduct(productResponse.data)

        const colorsResponse = await getColors()
        setColors(colorsResponse.data)

        const sizesResponse = await getSizes()
        setSizes(sizesResponse.data)

        const muscleGroup = await getMuscleGroups()
        setMuscleGroups(muscleGroup.data.filter((mg: any) => productResponse.data.muscle_group_ids))

        const carts = await getCarts()
        if (carts.data && carts.data.length > 0) {
          setCartId(carts.data[0].id)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [slug])

  if (!product) return <div>Loading...</div>

  const handleAddToCart = async () => {
    if (!cartId || !selectedVariantId) return
    setIsAdding(true)
    try {
      await addCart(cartId, selectedVariantId)
      toast.success("Đã thêm vào giỏ hàng!")
    } catch (error: any) {
      console.error("Add to cart error:", error)
      let message = "Không thể thêm vào giỏ hàng. Vui lòng thử lại!"
      if (error?.response?.data?.message) {
        message = error.response.data.message
      } else if (error?.message?.includes("422")) {
        message = "Sản phẩm đã có trong giỏ hàng hoặc dữ liệu không hợp lệ."
      }
      toast.error(message)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="mb-20 p-6 mt-20">
        <div className="xl:w-[80%] max-lg:w-full xl:flex justify-between mb-20 max-lg:block">
          <div className="xl:w-3/4 max-lg:w-full">
            <img
              src={product.image_urls[0] || ""}
              alt={product.name}
              className="xl:aspect-[5/3] max-lg:aspect-1 object-cover rounded-xl mb-4 w-full"
            />
          </div>
          <div className="xl:w-1/5 max-lg:w-full xl:text-xl flex flex-col gap-3">
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                {Array.from(new Set(product.variants.map((variant: any) => variant.color_id))).map((colorId: any) => {
                  const color = colors.find((c: any) => c.id === colorId)
                  const hex = color?.hex_code || "#fff"
                  const isSelected = selectedColorId === colorId
                  const hasInStockVariants = product.variants.some(
                    (variant: any) => variant.color_id === colorId && variant.in_stock
                  )

                  return (
                    <Button
                      key={colorId}
                      style={{
                        backgroundColor: hex,
                        border: isSelected ? "2px solid #00C7BE" : "1px solid #ddd",
                      }}
                      className="rounded-full w-10 h-10 relative"
                      disabled={!hasInStockVariants}
                      onClick={() => {
                        setSelectedColorId(colorId)
                        setSelectedVariantId(null)
                      }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-white opacity-80"></div>
                        </div>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>

            <p className="font-medium xl:text-[30px] max-lg:text-xl">{product.name}</p>
            <p className="text-[#737373] text-xl mt-1">
              {selectedColorId ? colors.find((color) => color.id === selectedColorId)?.name : ""}
            </p>
            <p className="text-[#00C7BE] text-2xl font-semibold">{product.price.toLocaleString()} vnđ</p>

            <div className="flex gap-2 my-4 items-center">
              <div className="text-xl">Size:</div>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(
                    product.variants
                      .filter((variant: any) => !selectedColorId || variant.color_id === selectedColorId)
                      .map((variant: any) => variant.size_id)
                  )
                ).map((sizeId: any) => {
                  const size = sizes.find((s: any) => s.id === sizeId)?.size || sizeId
                  const variantsWithSize = product.variants.filter(
                    (variant: any) =>
                      variant.size_id === sizeId && (!selectedColorId || variant.color_id === selectedColorId)
                  )
                  const hasInStockVariant = variantsWithSize.some((v: any) => v.in_stock)
                  const variant = selectedColorId
                    ? product.variants.find((v: any) => v.color_id === selectedColorId && v.size_id === sizeId)
                    : variantsWithSize[0]

                  return (
                    <Button
                      key={sizeId}
                      className="w-10 h-10 text-xl font-semibold"
                      disabled={!hasInStockVariant || !selectedColorId}
                      onClick={() => {
                        if (variant) {
                          setSelectedVariantId(variant.id)
                        }
                      }}
                      style={{
                        border: selectedVariantId === variant?.id ? "2px solid #00C7BE" : "1px solid #ddd",
                        color: selectedVariantId === variant?.id ? "#fff" : "#fff",
                      }}
                    >
                      {size}
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="text-nowrap">Số lượng:</div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] size-9 text-xl font-bold items-center flex border-2"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <MinusIcon />
                </Button>
                <Input
                  className="w-24 text-center border-2 border-[#737373] text-2xl font-bold pr-0"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                />
                <Button
                  className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] size-9 text-xl font-bold items-center flex border-2"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <AddIcon />
                </Button>
              </div>
            </div>
            <div className="w-full flex gap-3 justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-full bg-button hover:bg-[#11c296] text-white hover:text-white"
                  >
                    Mua ngay
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader className="flex flex-col items-center text-center">
                    <AlertDialogCancel className="absolute top-4 right-4 border-none hover:bg-white shadow-none active:bg-none">
                      <CloseIcon />
                    </AlertDialogCancel>
                    <AlertDialogTitle className="text-text font-[family-name:var(--font-coiny)] text-[40px] pt-10">
                      Đặt hàng thành công
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500 text-[20px] pb-10">
                      NV CSKH sẽ liên hệ để xác nhận đơn hàng
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                className="border-button border-2 text-button rounded-full w-full bg-white hover:bg-[#11c29628]"
                disabled={!selectedVariantId || !cartId || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding ? "Đang thêm..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] max-lg:text-[30px]">Title</div>
          <p className="text-[#737373] xl:text-xl max-lg:text-base">{product.description}</p>
        </div>
        <div>
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px] mb-5 max-lg:text-[30px]">
            Tính năng
          </div>
          <div className="grid xl:grid-cols-12 lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-10">
            {muscleGroups.map((muscleGroup) => (
              <div key={muscleGroup.id} className="xl:text-xl max-lg:text-base">
                <div className="group">
                  <img
                    src={muscleGroup.image}
                    alt={muscleGroup.name}
                    className="object-cover rounded-xl mb-4 size-[122px]"
                  />
                </div>
                <div className="font-medium">{muscleGroup.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
