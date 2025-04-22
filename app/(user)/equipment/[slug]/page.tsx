import Image from "next/image"
import ShoppingImage from "@/assets/image/Shopping.png"
import Link from "next/link"
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
export default async function Equipment({ params }: { params: { slug: string } }) {
  const { slug } = params
  const productResponse = await getProduct(slug)
  const product = productResponse.data
  const colorsResponse = await getColors()
  const colors = colorsResponse.data
  const sizesResponse = await getSizes()
  const sizes = sizesResponse.data
  const muscleGroup = await getMuscleGroups()
  const filteredMuscleGroups = muscleGroup.data.filter((mg) => product.muscle_group_ids)

  return (
    <div className="flex flex-col gap-10">
      <div className="mb-20 p-6 mt-20">
        <div className="xl:w-[80%] max-lg:w-full xl:flex justify-between mb-20 max-lg:block">
          <div className="xl:w-3/4 max-lg:w-full">
            <img
              src={product.image_urls[0] || ""}
              alt={product.name}
              className="xl:aspect-[5/3] max-lg:aspect-1 object-cover rounded-xl mb-4"
            />
          </div>
          <div className="xl:w-1/5 max-lg:w-full xl:text-xl flex flex-col gap-3">
            <div className="flex gap-2 mb-2">
              {product.variants.map((variant: any) => {
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
            <p className="font-medium xl:text-[30px] max-lg:text-xl">{product.name}</p>
            <p className="text-[#737373]">{colors.find((color) => color.id === product.variants[0].color_id)?.name}</p>
            <p className="text-[#00C7BE] text-2xl font-semibold">{product.price.toLocaleString()} vnđ</p>
            <div className="flex gap-3 items-center">
              <div className="text-xl">Size:</div>
              {product.variants.map((variant: any) => {
                const sizeName = sizes.find((size: any) => size.id === variant.size_id)?.size || variant.size_id
                return (
                  <Button key={variant.id} className="w-8 h-8 d" disabled={!variant.in_stock}>
                    {sizeName}
                  </Button>
                )
              })}
            </div>
            <div className="flex gap-3 items-center">
              <div className="text-nowrap">Số lượng:</div>
              <div className="flex items-center gap-2">
                <Button className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] size-9 text-xl font-bold items-center flex border-2">
                  <MinusIcon />
                </Button>
                <Input className="w-24 text-center border-2 border-[#737373] text-2xl font-bold pr-0" type="number" />
                <Button className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] size-9 text-xl font-bold items-center flex border-2">
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
              <Button className="border-button border-2 text-button rounded-full w-full bg-white hover:bg-[#11c29628]">
                Lưu
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
            {filteredMuscleGroups.map((muscleGroup) => (
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
