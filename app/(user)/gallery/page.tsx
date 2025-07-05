'use client'

import Link from 'next/link'
import { getMuscleGroups } from '@/network/client/muscle-groups'
import { getDiets } from '@/network/server/diets'
import { useState, useEffect } from 'react'
import { ListResponse } from '@/models/response'
import { MuscleGroup } from '@/models/muscle-group'
import { Diet } from '@/models/diet'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

export const dynamic = 'force-dynamic'

export default function Gallery() {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [dialogOpen, setDialogOpen] = useState<string | false>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [muscleGroupsData, setMuscleGroupsData] = useState<ListResponse<MuscleGroup>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [dietsData, setDietsData] = useState<ListResponse<Diet>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }

  useEffect(() => {
    async function fetchMuscleGroups() {
      try {
        setIsLoading(true)
        const data = await getMuscleGroups()
        setMuscleGroupsData(data)
      } catch (error) {
        console.error('Error fetching muscle groups:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMuscleGroups()
  }, [])

  useEffect(() => {
    async function fetchDiets() {
      try {
        setIsLoading(true)
        const data = await getDiets()
        setDietsData(data)
      } catch (error) {
        console.error('Error fetching diets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiets()
  }, [])
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-ring xl:text-[40px] font-bold">Bài tập theo nhóm cơ</div>
          <p className="text-[#737373] text-xl">
            Xem video hướng dẫn chi tiết 1000+ bài đốt mỡ và cắt nét cơ theo từng vùng hình thể nữ giới
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {muscleGroupsData.data.map((muscleGroup) =>
            session ? (
              <Link href={`/gallery/muscle/${muscleGroup.id}`} key={muscleGroup.id}>
                <div key={`menu-${muscleGroup.id}`} className="text-xl">
                  <div className="relative group">
                    <img
                      src={muscleGroup.image ?? undefined}
                      alt=""
                      className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-bold">{muscleGroup.name}</p>
                </div>
              </Link>
            ) : (
              <div key={muscleGroup.id}>
                <Dialog
                  open={dialogOpen === `muscle-${muscleGroup.id}`}
                  onOpenChange={(open) => {
                    if (!open) setDialogOpen(false)
                  }}
                >
                  <DialogTrigger asChild>
                    <div
                      key={`menu-${muscleGroup.id}`}
                      className="text-xl cursor-pointer"
                      onClick={() => setDialogOpen(`muscle-${muscleGroup.id}`)}
                    >
                      <div className="relative group">
                        <img
                          src={muscleGroup.image ?? undefined}
                          alt=""
                          className="aspect-[5/3] object-cover rounded-xl mb-4"
                          width={585}
                          height={373}
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                      </div>
                      <p className="font-bold">{muscleGroup.name}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center text-center gap-6">
                      <p className="text-lg">ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP BÀI TẬP & MÓN ĂN</p>
                      <div className="flex gap-4 justify-center w-full px-10">
                        <div className="flex-1">
                          <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleBuyPackageClick}>
                            Mua gói Member
                          </Button>
                        </div>
                        <div className="flex-1">
                          <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
                            Đăng nhập
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
          )}
        </div>
      </div>
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-ring xl:text-[40px] font-bold">Món theo chế độ ăn</div>
          <p className="text-[#737373] text-xl">
            Khám phá 500+ món ăn theo các chế độ ăn khác nhau phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {dietsData.data?.map((diet) =>
            session ? (
              <Link href={`/gallery/meal/${diet.id}`} key={diet.id}>
                <div key={`menu-${diet.id}`} className="text-xl">
                  <div className="relative group">
                    <img src={diet.image} alt="" className="aspect-[5/3] object-cover rounded-xl mb-4 w-full" />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-bold">{diet.name}</p>
                </div>
              </Link>
            ) : (
              <div key={diet.id}>
                <Dialog
                  open={dialogOpen === `diet-${diet.id}`}
                  onOpenChange={(open) => {
                    if (!open) setDialogOpen(false)
                  }}
                >
                  <DialogTrigger asChild>
                    <div
                      key={`menu-${diet.id}`}
                      className="text-xl cursor-pointer"
                      onClick={() => setDialogOpen(`diet-${diet.id}`)}
                    >
                      <div className="relative group">
                        <img
                          src={diet.image}
                          alt=""
                          className="aspect-[5/3] object-cover rounded-xl mb-4"
                          width={585}
                          height={373}
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                      </div>
                      <p className="font-bold">{diet.name}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center text-center gap-6">
                      <p className="text-lg">ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP BÀI TẬP & MÓN ĂN</p>
                      <div className="flex gap-4 justify-center w-full px-10">
                        <div className="flex-1">
                          <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleBuyPackageClick}>
                            Mua gói Member
                          </Button>
                        </div>
                        <div className="flex-1">
                          <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
                            Đăng nhập
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
