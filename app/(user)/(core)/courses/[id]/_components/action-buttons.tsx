'use client'

import type { Course } from '@/models/course'

import { toast } from 'sonner'
import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { checkUserAccessedResource, checkUserSavedResource, trackCourseClick } from '@/network/client/users'
import { addFavouriteCourse, queryKeyFavouriteCourses } from '@/network/client/user-favourites'

interface ActionButtonsProps {
  courseID: Course['id']
  enableSave?: boolean
}

export function ActionButtons({ courseID, enableSave }: ActionButtonsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams ? `?${searchParams.toString()}` : ''
  const { session } = useSession()
  const queryClient = useQueryClient()
  const [openLogin, setOpenLogin] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const pathname = usePathname()
  const path = pathname + query

  // Use useQueries to batch multiple queries
  const queries = useQueries({
    queries: [
      // Check access status
      {
        queryKey: ['user-accessed-resources', session?.userId, 'course', courseID],
        queryFn: () => checkUserAccessedResource(session!.userId, 'course', courseID),
        enabled: !!session,
      },
      // Check saved status
      {
        queryKey: ['saved-resource-status', session?.userId, 'course', courseID],
        queryFn: () => checkUserSavedResource(session!.userId, 'course', courseID),
        enabled: !!session && showSaveDialog,
      },
    ],
  })

  const accessQuery = queries[0]
  const savedStatusQuery = queries[1]

  const isAccessed = accessQuery.data?.data || false

  const favouriteMutation = useMutation({
    mutationFn: () => addFavouriteCourse(session!.userId, courseID),
    onSuccess: () => {
      setSaving(false)
      setShowSaveDialog(false)
      savedStatusQuery.refetch()

      // Invalidate favourite courses query to refresh the list
      queryClient.invalidateQueries({ queryKey: [queryKeyFavouriteCourses, session?.userId] })

      toast.success('Đã thêm khóa tập vào danh sách yêu thích!')
    },
    onError: (error) => {
      setSaving(false)
      toast.error(error.message || 'Có lỗi xảy ra khi thêm vào yêu thích!')
    },
  })

  const handleStartCourse = async () => {
    if (session && isAccessed) {
      try {
        // Track course click before redirecting
        await trackCourseClick(session.userId)
      } catch (error) {
        console.error('Failed to track course click:', error)
        // Continue with redirection even if tracking fails
      }
    }

    router.push(`/courses/${courseID}/detail?back=${encodeURIComponent(path)}`)
  }

  const handleShowSaveOptions = () => {
    if (!session) {
      setOpenLogin(true)
      return
    }

    setShowSaveDialog(true)
  }

  const handleSaveFavorite = () => {
    setSaving(true)
    favouriteMutation.mutate()
  }

  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(path)}`)
  }

  // Extract saved status
  const alreadySavedInFavorite = savedStatusQuery.data?.data?.in_favourite || false

  return (
    <>
      <div className="lg:gap-5 gap-3 w-2/3 mx-auto mb-10 flex justify-center md:mt-20 mt-12 max-lg:w-full max-lg:px-3">
        <div className={`w-${enableSave ? '1/2' : 'full'}`}>
          <Button
            className="w-full rounded-full text-lg bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
            onClick={handleStartCourse}
          >
            Bắt đầu
          </Button>
        </div>
        {enableSave && (
          <div className="w-1/2">
            <Button
              onClick={handleShowSaveOptions}
              disabled={saving}
              className="w-full rounded-full text-sm lg:text-lg h-14 border-2 bg-[#13D8A7] text-white hover:bg-[#11c296] border-[#13D8A7]"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        )}
      </div>

      {/* Login Dialog */}
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

      {/* Save Options Dialog - Only Favorites */}
      <Dialog open={showSaveDialog} onOpenChange={(open) => setShowSaveDialog(open)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#13D8A7]">Lưu khóa tập</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Loading state */}
            {savedStatusQuery.isLoading && (
              <div className="py-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#13D8A7]"></div>
              </div>
            )}

            {/* Error state */}
            {savedStatusQuery.error && (
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
                <Button
                  onClick={() => savedStatusQuery.refetch()}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  Thử lại
                </Button>
              </div>
            )}

            {!savedStatusQuery.isLoading && !savedStatusQuery.error && (
              <>
                {/* Favorite option */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="font-medium text-lg">Yêu thích</h3>
                      <p className="text-gray-500 text-sm">Lưu vào danh sách yêu thích</p>
                    </div>
                    <Button
                      onClick={handleSaveFavorite}
                      disabled={alreadySavedInFavorite || saving}
                      size="sm"
                      className={
                        alreadySavedInFavorite
                          ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 cursor-default'
                          : 'bg-[#13D8A7] hover:bg-[#11c296] text-white'
                      }
                    >
                      {alreadySavedInFavorite ? (
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Đã lưu
                        </span>
                      ) : (
                        'Lưu'
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
