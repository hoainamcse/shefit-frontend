'use client'

import type { Course } from '@/models/course'

import { toast } from 'sonner'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { addUserSavedResource, checkUserAccessedResource, checkUserSavedResource } from '@/network/client/users'

interface ActionButtonsProps {
  courseID: Course['id']
}

export function ActionButtons({ courseID }: ActionButtonsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { session } = useSession()
  const [openLogin, setOpenLogin] = useState(false)
  const [openBuyPackage, setOpenBuyPackage] = useState(false)
  const { redirectToLogin } = useAuthRedirect()

  const saveQuery = useQuery({
    queryKey: ['user-saved-resources', session?.userId, 'course', courseID],
    queryFn: () => checkUserSavedResource(session!.userId, 'course', courseID),
    enabled: !!session,
  })
  const isSaved = saveQuery.data?.data || false

  const accessQuery = useQuery({
    queryKey: ['user-accessed-resources', session?.userId, 'course', courseID],
    queryFn: () => checkUserAccessedResource(session!.userId, 'course', courseID),
    enabled: !!session,
  })
  const isAccessed = accessQuery.data?.data || false

  const saveMutation = useMutation({
    mutationFn: () => addUserSavedResource(session!.userId, 'course', courseID),
    onSuccess: () => {
      saveQuery.refetch()
      toast.success('Đã thêm khoá học vào danh sách!')
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi lưu khoá học!')
    },
  })

  const handleStartCourse = () => {
    if (!session) {
      setOpenLogin(true)
      return
    }

    if (!isAccessed) {
      setOpenBuyPackage(true)
      return
    }

    router.push(`/courses/${courseID}/detail${searchParams ? `?${searchParams.toString()}` : ''}`)
  }

  const handleSaveCourse = () => {
    if (!session) {
      setOpenLogin(true)
      return
    }

    saveMutation.mutate()
  }

  const handleLoginClick = () => {
    setOpenLogin(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setOpenBuyPackage(false)
    router.push(`/account/packages?redirect=${encodeURIComponent(pathname)}`)
  }

  return (
    <>
      <div className="lg:gap-5 gap-3 w-2/3 mx-auto mb-10 flex justify-center md:mt-20 mt-12 max-lg:w-full max-lg:px-3">
        <div className="w-1/2">
          <Button
            className="w-full rounded-full text-lg bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
            onClick={handleStartCourse}
          >
            Bắt đầu
          </Button>
        </div>
        <div className="w-1/2">
          <Button
            onClick={() => handleSaveCourse()}
            disabled={isSaved || saveQuery.isLoading || saveMutation.isPending}
            className={`w-full rounded-full text-sm lg:text-lg h-14 border-2 ${
              isSaved
                ? 'bg-transparent text-[#11c296] border-[#11c296] cursor-not-allowed'
                : 'bg-[#13D8A7] text-white hover:bg-[#11c296] border-[#13D8A7]'
            }`}
          >
            {saveMutation.isPending
              ? 'Đang lưu'
              : saveQuery.isLoading
              ? 'Đang kiểm tra...'
              : isSaved
              ? 'Đã Lưu'
              : 'Lưu'}
          </Button>
        </div>
      </div>

      <Dialog open={openBuyPackage} onOpenChange={setOpenBuyPackage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">MUA GÓI MEMBER ĐỂ TRUY CẬP KHOÁ HỌC</p>
            <div className="w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleBuyPackageClick}>
                Mua gói Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openLogin} onOpenChange={setOpenLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">ĐĂNG NHẬP ĐỂ LƯU KHÓA TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
