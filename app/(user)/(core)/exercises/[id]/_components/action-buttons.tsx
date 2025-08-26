'use client'

import type { Exercise } from '@/models/exercise'

import { toast } from 'sonner'
import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { addUserSavedResource, checkUserSavedResource } from '@/network/client/users'

interface ActionButtonsProps {
  exerciseID: Exercise['id']
}

export default function ActionButtons({ exerciseID }: ActionButtonsProps) {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const saveQuery = useQuery({
    queryKey: ['user-saved-resources', session?.userId, 'dish', exerciseID],
    queryFn: () => checkUserSavedResource(session!.userId, 'exercise', exerciseID),
    enabled: !!session,
  })
  const isSaved = saveQuery.data?.data || false

  const saveMutation = useMutation({
    mutationFn: () => addUserSavedResource(session!.userId, 'exercise', exerciseID),
    onSuccess: () => {
      saveQuery.refetch()
      toast.success('Đã thêm động tác vào danh sách!')
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi lưu động tác!')
    },
  })

  const handleSaveExercise = () => {
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
    <div className="w-2/3 mx-auto mb-10 flex justify-center mt-6 md:mt-10 max-lg:w-full max-lg:px-5">
      <Button
        onClick={() => handleSaveExercise()}
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
            <p className="text-sm lg:text-lg">ĐĂNG NHẬP ĐỂ LƯU ĐỘNG TÁC</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
