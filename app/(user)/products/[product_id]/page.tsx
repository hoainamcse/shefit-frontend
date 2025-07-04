'use client'

import { use, useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AddIcon } from '@/components/icons/AddIcon'
import { MinusIcon } from '@/components/icons/MinusIcon'
import { getProduct, getColors, getSizes } from '@/network/server/products'
import { getMuscleGroups } from '@/network/server/muscle-groups'
import { addCart, getCarts, createCart } from '@/network/server/cart'
import { getUserCart, createUserCart } from '@/network/server/user-cart'
import { toast } from 'sonner'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useSession } from '@/components/providers/session-provider'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

export default function ProductPage({ params }: { params: Promise<{ product_id: string }> }) {
  const { product_id } = use(params)
  const { session } = useSession()
  const [product, setProduct] = useState<any>(null)
  const [colors, setColors] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [muscleGroups, setMuscleGroups] = useState<any[]>([])
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [colorOptions, setColorOptions] = useState<number[]>([])
  const [cartId, setCartId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [hasDefaultVariant, setHasDefaultVariant] = useState(false)
  const [defaultVariantId, setDefaultVariantId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { redirectToLogin } = useAuthRedirect()

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(
        (variant: any) => variant.color_id === null && variant.size_id === null
      )

      if (defaultVariant) {
        setHasDefaultVariant(true)
        setDefaultVariantId(defaultVariant.id)
        setSelectedVariantId(defaultVariant.id)
      } else {
        setHasDefaultVariant(false)
        setDefaultVariantId(null)
      }

      const uniqueColorIds = Array.from<number>(
        new Set(
          product.variants.filter((variant: any) => variant.color_id !== null).map((variant: any) => variant.color_id)
        )
      )
      setColorOptions(uniqueColorIds)

      if (uniqueColorIds.length > 0 && selectedColorId === null && !defaultVariant) {
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
        const productResponse = await getProduct(product_id)
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
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [product_id])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  if (!product)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )

  const handleBuyNow = async () => {
    let variantIdToUse = selectedVariantId

    if (hasDefaultVariant && defaultVariantId) {
      variantIdToUse = defaultVariantId
    } else if (!selectedVariantId) {
      return
    }

    if (!product) return
    setIsBuyingNow(true)
    try {
      const cartResponse = await createCart()
      if (!cartResponse?.data?.id) {
        throw new Error('Không thể tạo giỏ hàng mới')
      }
      const newCartId = cartResponse.data.id
      if (session) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const userCartResponse = await createUserCart(Number(session.userId), newCartId)
          if (userCartResponse?.cart?.id) {
          }
        } catch (linkError) {}
      }
      const currentQuantity = Math.max(1, Number(quantity))
      const variantIdToUse = hasDefaultVariant && defaultVariantId ? defaultVariantId : selectedVariantId
      if (variantIdToUse === null) {
        throw new Error('Không có biến thể sản phẩm hợp lệ')
      }
      await addCart(newCartId, variantIdToUse, currentQuantity)
      window.location.href = `/products/${product_id}/buy-now?cart_id=${newCartId}`
    } catch (error: any) {
      let message = 'Không thể mua ngay. Vui lòng thử lại!'
      if (error?.response?.data?.message) {
        message = error.response.data.message
      }
      toast.error(message)
      setIsBuyingNow(false)
    }
  }

  const handleAddToCart = async () => {
    let variantIdToUse = selectedVariantId
    if (hasDefaultVariant && defaultVariantId) {
      variantIdToUse = defaultVariantId
    } else if (!selectedVariantId) {
      return
    }
    if (!session) {
      setLoginDialogOpen(true)
      return
    }
    const currentQuantity = Math.max(1, Number(quantity))
    setIsAdding(true)
    try {
      const cartsRes = await getUserCart(Number(session.userId))
      let currentCartId = cartId
      let pendingCart = Array.isArray(cartsRes?.data)
        ? cartsRes.data.find((item) => item?.cart?.status === 'pending' || item?.cart?.status === 'not_decided')
        : null
      if (!pendingCart) {
        const emptyCartResponse = await createCart()

        if (!emptyCartResponse?.data?.id) {
          throw new Error('Không thể tạo giỏ hàng mới')
        }

        const newCartId = emptyCartResponse.data.id
        await new Promise((resolve) => setTimeout(resolve, 500))

        const userCartResponse = await createUserCart(Number(session.userId), newCartId)

        if (userCartResponse?.cart?.id) {
          currentCartId = userCartResponse.cart.id
          setCartId(currentCartId)
        } else {
          throw new Error('Không thể liên kết giỏ hàng với người dùng')
        }
      } else {
        currentCartId = pendingCart.cart.id
        setCartId(currentCartId)
      }

      if (!currentCartId) {
        throw new Error('Không có giỏ hàng hợp lệ')
      }

      if (variantIdToUse === null) {
        throw new Error('Không có biến thể sản phẩm hợp lệ')
      }

      const result = await addCart(currentCartId, variantIdToUse, currentQuantity)
      toast.success(`Đã thêm ${currentQuantity} sản phẩm vào giỏ hàng!`)
    } catch (error: any) {
      console.error('Add to cart error:', error)
      let message = 'Không thể thêm vào giỏ hàng. Vui lòng thử lại!'
      if (error?.response?.data?.message) {
        message = error.response.data.message
      } else if (error?.message?.includes('422')) {
        message = 'Sản phẩm đã có trong giỏ hàng hoặc dữ liệu không hợp lệ.'
      }
      toast.error(message)
    } finally {
      setIsAdding(false)
    }
  }

  const handleLoginClick = () => {
    setLoginDialogOpen(false)
    redirectToLogin()
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="mb-20 p-10 mt-20">
        <div className="xl:w-[80%] max-lg:w-full xl:flex justify-between mb-20 max-lg:block">
          <div className="xl:w-3/4 max-lg:w-full px-8">
            <Carousel
              opts={{
                align: 'center',
              }}
            >
              <CarouselContent>
                {Array.from({ length: product.image_urls.length }).map((_, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={product.image_urls[index]}
                      alt={product.name}
                      className="xl:aspect-[5/3] max-lg:aspect-1 object-cover rounded-xl mb-4 w-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="xl:w-1/5 max-lg:w-full xl:text-xl flex flex-col gap-3">
            {product.variants.some((variant: any) => variant.color_id !== null) && (
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex gap-2">
                  {Array.from(
                    new Set(
                      product.variants
                        .filter((variant: any) => variant.color_id !== null)
                        .map((variant: any) => variant.color_id)
                    )
                  ).map((colorId: any) => {
                    const color = colors.find((c: any) => c.id === colorId)
                    const hex = color?.hex_code || '#fff'
                    const colorName = color?.name || ''
                    const isSelected = selectedColorId === colorId
                    const hasInStockVariants = product.variants.some(
                      (variant: any) => variant.color_id === colorId && variant.in_stock
                    )

                    return (
                      <div key={colorId} className="relative group">
                        <Button
                          style={{
                            backgroundColor: hex,
                            border: isSelected ? '2px solid #00C7BE' : '1px solid #ddd',
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
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                          {colorName}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="font-medium xl:text-[30px] max-lg:text-xl">{product.name}</p>
            <p className="text-[#737373] text-xl mt-1">
              {selectedColorId ? colors.find((color) => color.id === selectedColorId)?.name : ''}
            </p>
            <p className="text-[#00C7BE] text-2xl font-semibold">{product.price.toLocaleString()} vnđ</p>

            {product.variants.some(
              (variant: any) => variant.size_id !== null && (!selectedColorId || variant.color_id === selectedColorId)
            ) && (
              <div className="flex gap-2 my-4 items-center">
                <div className="text-xl">Size:</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      product.variants
                        .filter(
                          (variant: any) =>
                            variant.size_id !== null && (!selectedColorId || variant.color_id === selectedColorId)
                        )
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
                          border: selectedVariantId === variant?.id ? '2px solid #00C7BE' : '1px solid #ddd',
                          color: selectedVariantId === variant?.id ? '#fff' : '#fff',
                        }}
                      >
                        {size}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
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
              <Button
                variant="outline"
                className="w-full rounded-full bg-[#13D8A7] hover:bg-[#11c296] text-white hover:text-white"
                disabled={!(hasDefaultVariant || selectedVariantId) || isBuyingNow}
                onClick={handleBuyNow}
              >
                {isBuyingNow ? 'Đang xử lý...' : 'Mua ngay'}
              </Button>
              <Button
                className="border-[#13D8A7] border-2 text-[#13D8A7] rounded-full w-full bg-white hover:bg-[#11c29628]"
                disabled={!(hasDefaultVariant || selectedVariantId) || isAdding}
                onClick={handleAddToCart}
              >
                {isAdding ? 'Đang thêm...' : 'Lưu'}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] font-bold text-ring xl:text-[40px] max-lg:text-[30px]">
            Title
          </div>
          <p className="text-[#737373] xl:text-xl max-lg:text-base">{product.description}</p>
        </div>

        {muscleGroups.length > 0 && (
          <div>
            <div className="font-[family-name:var(--font-coiny)] font-bold text-ring xl:text-[40px] mb-5 max-lg:text-[30px]">
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
        )}
      </div>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg text-[#737373] uppercase">Đăng nhập để thêm sản phẩm vào giỏ hàng</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button
                  className="bg-[#13D8A7] hover:bg-[#13D8A7]/90 rounded-full w-full text-lg"
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
