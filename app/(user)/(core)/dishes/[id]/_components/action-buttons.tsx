'use client'

import type { Dish } from '@/models/dish'
import type { UserSubscriptionDetail } from '@/models/user-subscriptions'

import { toast } from 'sonner'
import { useState } from 'react'
import { format } from 'date-fns'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { addFavouriteDish } from '@/network/client/user-favourites'
import { getUserSubscriptions, checkUserSavedResource } from '@/network/client/users'
import { addUserSubscriptionDish, queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'

interface ActionButtonsProps {
  dishID: Dish['id']
}

export default function ActionButtons({ dishID }: ActionButtonsProps) {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSaveOptionsDialog, setShowSaveOptionsDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  // Check saved status
  const savedStatusQuery = useQuery({
    queryKey: ['saved-resource-status', session?.userId, 'dish', dishID],
    queryFn: () => checkUserSavedResource(session!.userId, 'dish', dishID),
    enabled: !!session && showSaveOptionsDialog,
  })

  // Fetch user subscriptions
  const subscriptionsQuery = useQuery({
    queryKey: [queryKeyUserSubscriptions, session?.userId],
    queryFn: () => getUserSubscriptions(session!.userId),
    enabled: !!session && showSaveOptionsDialog,
  })

  const favouriteMutation = useMutation({
    mutationFn: () => addFavouriteDish(session!.userId, dishID),
    onSuccess: () => {
      setSaving(false)
      setShowSaveOptionsDialog(false)
      savedStatusQuery.refetch()
      toast.success('Đã thêm vào danh sách yêu thích!')
    },
    onError: (error) => {
      setSaving(false)
      toast.error(error.message || 'Có lỗi xảy ra khi thêm vào yêu thích!')
    },
  })

  const subscriptionMutation = useMutation({
    mutationFn: ({ subscriptionId }: { subscriptionId: UserSubscriptionDetail['id'] }) =>
      addUserSubscriptionDish(session!.userId, subscriptionId, dishID),
    onSuccess: () => {
      setSaving(false)
      setShowSaveOptionsDialog(false)
      savedStatusQuery.refetch()
      toast.success('Đã thêm món ăn vào gói tập!')
    },
    onError: (error) => {
      setSaving(false)
      toast.error(error.message || 'Có lỗi xảy ra khi thêm vào gói tập!')
    },
  })

  const handleShowSaveOptions = () => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    setShowSaveOptionsDialog(true)
  }

  const handleSaveToFavorite = () => {
    setSaving(true)
    favouriteMutation.mutate()
  }

  const handleAddToSubscription = (subscriptionId: UserSubscriptionDetail['id']) => {
    setSaving(true)
    subscriptionMutation.mutate({ subscriptionId })
  }

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  // Extract saved status
  const alreadySavedInFavorite = savedStatusQuery.data?.data?.in_favourite || false
  const savedSubscriptionIds = savedStatusQuery.data?.data?.user_subscription_ids || []

  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-6 md:mt-16 max-lg:w-full max-lg:px-5">
      <Button
        onClick={handleShowSaveOptions}
        disabled={saving}
        className="w-full rounded-full text-sm lg:text-lg h-14 border-2 bg-[#13D8A7] text-white hover:bg-[#11c296] border-[#13D8A7]"
      >
        {saving ? 'Đang lưu...' : 'Lưu'}
      </Button>

      {/* Login Dialog */}
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

      {/* Save Options Dialog */}
      <Dialog open={showSaveOptionsDialog} onOpenChange={(open) => setShowSaveOptionsDialog(open)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-[#13D8A7]">Lưu món ăn</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Loading state */}
            {(savedStatusQuery.isLoading || subscriptionsQuery.isLoading) && (
              <div className="py-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#13D8A7]"></div>
              </div>
            )}

            {/* Error state */}
            {(savedStatusQuery.error || subscriptionsQuery.error) && (
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
                <Button
                  onClick={() => {
                    savedStatusQuery.refetch()
                    subscriptionsQuery.refetch()
                  }}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  Thử lại
                </Button>
              </div>
            )}

            {!savedStatusQuery.isLoading &&
              !savedStatusQuery.error &&
              !subscriptionsQuery.isLoading &&
              !subscriptionsQuery.error && (
                <>
                  {/* Favorite option */}
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h3 className="font-medium text-lg">Yêu thích</h3>
                        <p className="text-gray-500 text-sm">Lưu vào danh sách yêu thích</p>
                      </div>
                      <Button
                        onClick={handleSaveToFavorite}
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

                  {/* Subscriptions Header */}
                  <div className="mt-3 mb-1">
                    <h3 className="font-medium text-lg">Gói tập (còn hạn)</h3>
                    <p className="text-gray-500 text-sm">Lưu vào các gói tập của bạn</p>
                  </div>

                  {subscriptionsQuery.data?.data && subscriptionsQuery.data.data.length > 0 ? (
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                      {/* Subscription options */}
                      {subscriptionsQuery.data.data
                        .filter((dt) => isActiveSubscription(dt.status, dt.subscription_end_at))
                        .map((us: UserSubscriptionDetail) => (
                          <div key={us.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <h3 className="font-medium">{us.subscription?.name || `Gói #${us.id}`}</h3>
                                <p className="text-gray-500 text-xs">
                                  {format(us.subscription_start_at, 'dd/MM/yyyy')} -{' '}
                                  {format(us.subscription_end_at, 'dd/MM/yyyy')}
                                </p>
                              </div>
                              <Button
                                onClick={() => handleAddToSubscription(us.subscription.id)}
                                disabled={savedSubscriptionIds.includes(us.id) || saving}
                                size="sm"
                                className={
                                  savedSubscriptionIds.includes(us.id)
                                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 cursor-default'
                                    : 'bg-[#13D8A7] hover:bg-[#11c296] text-white'
                                }
                              >
                                {savedSubscriptionIds.includes(us.id) ? (
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
                        ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-500">Bạn chưa có gói tập nào</p>
                    </div>
                  )}
                </>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function isActiveSubscription(status: string, endDate: string) {
  const now = new Date()
  const end = new Date(endDate)
  return status === 'active' && end > now
}
