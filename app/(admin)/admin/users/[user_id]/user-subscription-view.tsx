'use client'

import type { Course, LiveDay, DaySession, DayOfWeek } from '@/models/course'

import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, Video, Edit, Trash2, Gift } from 'lucide-react'

import { sortByKey } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { SheetEdit } from '@/components/dialogs/sheet-edit'
import { deleteDaySession, deleteLiveDay, getLiveDays, queryKeyLiveDays } from '@/network/client/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EditUserSubscriptionForm } from '@/components/forms/edit-user-subscription-form'
import { User } from '@/models/user'
import { deleteUserSubscription, getUserSubscriptions } from '@/network/client/users'
import { queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'
import { UserSubscription } from '@/models/user-subscriptions'
import { useSession } from '@/hooks/use-session'
import { getSubAdminSubscriptions, getSubscriptions, queryKeySubscriptions } from '@/network/client/subscriptions'
import { MultiSelectOptionItem } from '@/components/nyxb-ui/multi-select'

export function UserSubscriptionView({ userID, userRole }: { userID: User['id']; userRole: User['role'] }) {
  // Form states
  const [showUserSubscriptionForm, setShowUserSubscriptionForm] = useState(false)
  const [editingUserSubscription, setEditingUserSubscription] = useState<UserSubscription | null>(null)

  // const queryClient = useQueryClient()

  // Queries
  const {
    data: userSubscriptionsData,
    isLoading: userSubscriptionsLoading,
    refetch: userSubscriptionsRefetch,
  } = useQuery({
    queryKey: [queryKeyUserSubscriptions, userID],
    queryFn: () => getUserSubscriptions(userID),
  })

  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery({
    queryKey: [queryKeySubscriptions],
    queryFn: () => (userRole === 'sub_admin' ? getSubAdminSubscriptions() : getSubscriptions()),
    enabled: !!userRole,
  })

  const handleAddUserSubscription = () => {
    setEditingUserSubscription(null)
    setShowUserSubscriptionForm(true)
  }

  const handleEditUserSubscription = (userSubscription: UserSubscription) => {
    setEditingUserSubscription(userSubscription)
    setShowUserSubscriptionForm(true)
  }

  const handleDeleteUserSubscription = (userSubscription: UserSubscription) => {
    // setDeleteItem({ type: 'day', item: day })
    const deletePromise = () => deleteUserSubscription(userID, userSubscription.subscription.id.toString())

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        userSubscriptionsRefetch()
        return 'Xoá gói tập người dùng thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={handleAddUserSubscription} text="Thêm gói tập" />
      </div>

      {userSubscriptionsLoading && subscriptionsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userSubscriptionsData?.data.map((userSubscription) => (
            <Card key={userSubscription.id}>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        {subscriptionsData?.data?.find((s) => s.id === userSubscription.subscription.id)?.name ||
                          'No name available'}
                      </CardTitle>
                      <CardDescription>{getCourseFormatLabel(userSubscription.course_format)}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MainButton
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditUserSubscription(userSubscription)}
                      icon={Edit}
                    />
                    <MainButton
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteUserSubscription(userSubscription)}
                      icon={Trash2}
                      className="hover:text-destructive"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Subscription details */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Subscription Details</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                        <p className="text-sm font-medium">
                          {new Date(userSubscription.subscription_start_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">End Date</p>
                        <p className="text-sm font-medium">
                          {new Date(userSubscription.subscription_end_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Coupon</p>
                        <div className="flex items-center gap-2">
                          {userSubscription.coupon ? (
                            <Badge variant="secondary" className="text-xs">
                              {userSubscription.coupon.code}
                            </Badge>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No coupon applied</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Gift</p>
                        {userSubscription.gift ? (
                          <div className="bg-card/50 rounded-md p-3 border border-border">
                            <div className="flex items-start gap-3">
                              {userSubscription.gift.type === 'item' ? (
                                <>
                                  <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {userSubscription.gift.image ? (
                                      <img
                                        src={userSubscription.gift.image}
                                        alt={userSubscription.gift.name || 'Gift item'}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                                        <Gift className="h-6 w-6 text-primary" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200 mb-1"
                                    >
                                      Item
                                    </Badge>
                                    <h4 className="font-medium text-sm">
                                      {userSubscription.gift.name || 'Unnamed gift'}
                                    </h4>
                                  </div>
                                </>
                              ) : userSubscription.gift.type === 'membership_plan' ? (
                                <>
                                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Gift className="h-6 w-6 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-1">
                                      Membership Plan
                                    </Badge>
                                    <h4 className="font-medium text-sm">
                                      {userSubscription.gift.duration % 35 === 0
                                        ? `${userSubscription.gift.duration / 35} tháng`
                                        : `${userSubscription.gift.duration} ngày`}
                                    </h4>
                                  </div>
                                </>
                              ) : (
                                <div className="flex-1 text-sm text-muted-foreground italic">Unknown gift type</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                            <Gift className="h-4 w-4" />
                            No gifts available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content access */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Content Access</h3>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">Meal Plans</h4>
                        <Badge variant="outline" className="text-xs">
                          {userSubscription.meal_plans.length}
                        </Badge>
                      </div>
                      {userSubscription.meal_plans.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userSubscription.meal_plans.map((plan) => (
                            <Badge
                              key={plan.id}
                              variant="secondary"
                              className="text-xs py-1 px-2 bg-muted hover:bg-muted/80 transition-colors"
                            >
                              {plan.title}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No meal plans assigned</p>
                      )}
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">Exercises</h4>
                        <Badge variant="outline" className="text-xs">
                          {userSubscription.exercises.length}
                        </Badge>
                      </div>
                      {userSubscription.exercises.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userSubscription.exercises.map((exercise) => (
                            <Badge
                              key={exercise.id}
                              variant="secondary"
                              className="text-xs py-1 px-2 bg-muted hover:bg-muted/80 transition-colors"
                            >
                              {exercise.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No exercises assigned</p>
                      )}
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">Dishes</h4>
                        <Badge variant="outline" className="text-xs">
                          {userSubscription.dishes.length}
                        </Badge>
                      </div>
                      {userSubscription.dishes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userSubscription.dishes.map((dish) => (
                            <Badge
                              key={dish.id}
                              variant="secondary"
                              className="text-xs py-1 px-2 bg-muted hover:bg-muted/80 transition-colors"
                            >
                              {dish.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No dishes assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {userSubscriptionsData?.data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-xl border border-dashed border-muted">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Calendar className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Subscriptions Found</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                This user doesn't have any active subscriptions yet. Add a subscription to give them access to meal
                plans, exercises, and dishes.
              </p>
              <Button onClick={handleAddUserSubscription} className="gap-2">
                <Calendar className="h-4 w-4" />
                Add Subscription
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Sheets and Forms */}
      <SheetEdit
        title={editingUserSubscription ? 'Chỉnh sửa gói tập' : 'Thêm gói tập'}
        description="Make changes to your profile here. Click save when you're done."
        open={showUserSubscriptionForm}
        onOpenChange={setShowUserSubscriptionForm}
      >
        <EditUserSubscriptionForm
          userID={userID}
          userRole={userRole}
          subscriptions={subscriptionsData?.data || []}
          userSubscriptions={userSubscriptionsData?.data || []}
          data={editingUserSubscription}
          onSuccess={() => {
            setShowUserSubscriptionForm(false)
            setEditingUserSubscription(null)
            userSubscriptionsRefetch()
            // queryClient.invalidateQueries({ queryKey: ['liveDays'] })
          }}
        />
      </SheetEdit>
    </div>
  )
}

function getCourseFormatLabel(subscription_format: string) {
  switch (subscription_format) {
    case 'video':
      return 'Video'
    case 'live':
      return 'Zoom'
    case 'both':
      return 'Video & Zoom'
    default:
      return subscription_format
  }
}
