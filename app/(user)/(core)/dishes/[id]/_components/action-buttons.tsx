'use client'

import type { Dish } from '@/models/dish'

import { toast } from 'sonner'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { addUserSavedResource, checkUserSavedResource } from '@/network/client/users'

interface ActionButtonsProps {
  dishID: Dish['id']
}

export default function ActionButtons({ dishID }: ActionButtonsProps) {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const saveQuery = useQuery({
    queryKey: ['user-saved-resources', session?.userId, 'dish', dishID],
    queryFn: () => checkUserSavedResource(session!.userId, 'dish', dishID),
    enabled: !!session,
  })
  const isSaved = saveQuery.data?.data || false

  const saveMutation = useMutation({
    mutationFn: () => addUserSavedResource(session!.userId, 'dish', dishID),
    onSuccess: () => {
      saveQuery.refetch()
      toast.success('Đã thêm món ăn vào danh sách!')
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi lưu món ăn!')
    },
  })

  const handleSaveDish = () => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    saveMutation.mutate()
  }

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-6 md:mt-16 max-lg:w-full max-lg:px-5">
      <Button
        onClick={() => handleSaveDish()}
        disabled={isSaved || saveQuery.isLoading || saveMutation.isPending}
        className={`w-full rounded-full text-sm lg:text-lg h-14 border-2 ${
          isSaved
            ? 'bg-transparent text-[#11c296] border-[#11c296] cursor-not-allowed'
            : 'bg-[#13D8A7] text-white hover:bg-[#11c296] border-[#13D8A7]'
        }`}
      >
        {saveMutation.isPending ? 'Đang lưu' : saveQuery.isLoading ? 'Đang kiểm tra...' : isSaved ? 'Đã Lưu' : 'Lưu'}
      </Button>
      <Dialog open={showLoginDialog} onOpenChange={(open) => setShowLoginDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg lg:text-xl">ĐĂNG NHẬP ĐỂ LƯU MÓN ĂN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-lg lg:text-xl" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
