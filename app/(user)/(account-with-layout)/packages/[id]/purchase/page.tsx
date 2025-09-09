'use client'

// React and hooks
import { useState, useEffect, useRef } from 'react'

// Next.js
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'

// Third-party libraries
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useQRCode } from 'next-qrcode'
import { Download } from 'lucide-react'

// Custom hooks
import { useSession } from '@/hooks/use-session'

// UI Components
import { CloseIcon } from '@/components/icons/CloseIcon'
import { BackIcon } from '@/components/icons/BackIcon'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogTrigger,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { HTMLRenderer } from '@/components/html-renderer'

// Network and Models
import { getSubscription, queryKeySubscriptions } from '@/network/client/subscriptions'
import { createUserSubscription } from '@/network/client/users'
import { checkCoupon } from '@/network/client/coupons'
import { UserSubscriptionPayload } from '@/models/user-subscriptions'
import { queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'

// Assets
import ShefitLogo from '@/public/logo-vertical-dark.png'
import { formatDuration } from '@/lib/helpers'

export default function PurchasePage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { session } = useSession()
  const { Canvas } = useQRCode()
  const query = searchParams ? `?${searchParams.toString()}` : ''
  const queryClient = useQueryClient()

  // Format time function for the countdown display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Fetch subscription data with React Query with error handling and retry
  const {
    data: subscription,
    isLoading: isDataLoading,
    error: subscriptionError,
  } = useQuery({
    queryKey: [queryKeySubscriptions, id],
    queryFn: async () => getSubscription(Number(id)),
    retry: 2, // Retry failed requests twice
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })

  // State for handling gift selection, pricing, and payment flow
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null)
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [originalPrice, setOriginalPrice] = useState<number>(0)
  const [qrData, setQrData] = useState<any>(null)
  const [orderId, setOrderId] = useState<string>('')
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60) // 15 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // State for coupon handling
  const [couponCode, setCouponCode] = useState<string>('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: number
    discount_type: 'fixed_amount' | 'percentage' | 'membership_plan'
    discount_value: number
    max_usage?: number | null
    usage_count?: number | null
  } | null>(null)
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false)
  const [isMembershipPlan, setIsMembershipPlan] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Set default price when subscription data loads
  useEffect(() => {
    if (subscription?.data) {
      // Set default price if available
      if (subscription.data.price) {
        setTotalPrice(subscription.data.price)
        setOriginalPrice(subscription.data.price)
      }

      // Set the first price option as selected if available
      if (subscription.data.prices && subscription.data.prices.length > 0) {
        const firstPrice = subscription.data.prices[0]
        setSelectedPriceId(firstPrice.id)
        setTotalPrice(firstPrice.price)
        setOriginalPrice(firstPrice.price)
      }
    }
  }, [subscription])

  // Effect for handling the countdown timer
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Timer expired
            clearInterval(timerRef.current as NodeJS.Timeout)
            setIsTimerActive(false)
            // Set QR code as expired
            setQrData((prevData: any) => (prevData ? { ...prevData, expired: true } : null))
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (timeRemaining === 0) {
      // Handle timer expiration
      setIsTimerActive(false)
      // Set QR code as expired
      setQrData((prevData: any) => (prevData ? { ...prevData, expired: true } : null))
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerActive, timeRemaining])

  // Effect to handle dialog close - cleanup timer
  useEffect(() => {
    if (!isPaymentDialogOpen && timerRef.current) {
      clearInterval(timerRef.current)
      setIsTimerActive(false)
    }
  }, [isPaymentDialogOpen])

  // Handler for login button
  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
  }

  // Generate a random order ID
  const generateOrderId = () => {
    return Math.floor(Math.random() * 900 + 100).toString()
  }

  // Handler for price selection
  const handlePriceSelect = (priceId: number, price: number) => {
    if (selectedPriceId === priceId || isMembershipPlan) return
    setSelectedPriceId(priceId)
    setOriginalPrice(price)

    // Recalculate total price based on applied coupon if any
    if (appliedCoupon) {
      applyDiscountToPrice(price)
    } else {
      setTotalPrice(price)
    }
  }

  /**
   * Applies the discount from the coupon to the original price
   * @param basePrice The original price before discount
   */
  const applyDiscountToPrice = (basePrice: number) => {
    if (!appliedCoupon) {
      setTotalPrice(basePrice)
      return
    }

    const { discount_type, discount_value } = appliedCoupon

    if (discount_type === 'fixed_amount') {
      // Apply fixed amount discount
      const discounted = Math.max(0, basePrice - discount_value)
      setTotalPrice(discounted)
    } else if (discount_type === 'percentage') {
      // Apply percentage discount
      const discounted = basePrice * (1 - discount_value / 100)
      setTotalPrice(Math.round(discounted))
    } else if (discount_type === 'membership_plan') {
      // For membership plan, price becomes 0
      setTotalPrice(0)
      setIsMembershipPlan(true)
    }
  }

  // Removed duplicate declaration of couponError state

  // Handle coupon verification
  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) return

    setCouponError(null)
    setIsCheckingCoupon(true)

    try {
      // Ensure the code is uppercase and has no spaces
      const formattedCode = couponCode.replace(/\s/g, '').toUpperCase()
      const response = await checkCoupon(formattedCode, { subscription_id: Number(id), user_id: session?.userId })
      const coupon = response.data

      // Check if coupon has reached max usage
      if (typeof coupon.max_usage === 'number' && coupon.usage_count >= coupon.max_usage) {
        setCouponError('Mã khuyến mãi đã hết lượt sử dụng. Vui lòng thử mã khác.')
        setAppliedCoupon(null)
      } else {
        // If we already have an applied coupon, remove it first
        if (appliedCoupon) {
          // If it was a membership plan, reset options
          if (appliedCoupon.discount_type === 'membership_plan') {
            setIsMembershipPlan(false)
          }
        }

        // Apply the new coupon and update the price immediately
        const currentPrice = originalPrice
        setAppliedCoupon(coupon)

        // Apply discount based on the coupon type
        if (coupon.discount_type === 'fixed_amount') {
          setTotalPrice(Math.max(0, currentPrice - coupon.discount_value))
        } else if (coupon.discount_type === 'percentage') {
          setTotalPrice(Math.round(currentPrice * (1 - coupon.discount_value / 100)))
        } else if (coupon.discount_type === 'membership_plan') {
          setTotalPrice(0)
          setIsMembershipPlan(true)
        }

        // If it's a membership plan, disable price selection
        if (coupon.discount_type === 'membership_plan') {
          setIsMembershipPlan(true)
        }
      }
    } catch (error: any) {
      setCouponError(
        error.message === 'INVALID_FOR_SUBSCRIPTION'
          ? 'Mã khuyến mãi không áp dụng cho gói này. Vui lòng thử mã khác.'
          : error.message === 'USAGE_LIMIT_EXCEEDED'
          ? 'Bạn đã sử dụng mã này quá số lần cho phép. Vui lòng thử mã khác.'
          : error.message === 'COUPON_USAGE_LIMIT_REACHED'
          ? 'Mã khuyến mãi đã hết lượt sử dụng. Vui lòng thử mã khác.'
          : 'Mã khuyến mãi không hợp lệ. Vui lòng thử mã khác.'
      )
      setAppliedCoupon(null)
    } finally {
      setIsCheckingCoupon(false)
    }
  }

  /**
   * Removes the currently applied coupon and resets prices
   */
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setTotalPrice(originalPrice)

    // Reset membership plan status if applicable
    if (isMembershipPlan) {
      setIsMembershipPlan(false)
    }
  }

  /**
   * Payment Processing Flow:
   * 1. Generate QR Token - Get authentication token for VietQR API
   * 2. Create QR Code - Generate QR code with payment info
   * 3. Generate Transaction Token - Get token for payment verification
   * 4. Check Payment Status - Poll for payment completion
   * 5. Create Subscription - Add subscription to user account
   */

  // 1. Generate QR token mutation
  const generateTokenMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/vietqr/generate-qr-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.NEXT_PUBLIC_VIETQR_BASIC_AUTH}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to generate QR token: ${response.status} ${response.statusText}`)
        }

        const tokenData = await response.json()
        return tokenData.access_token
      } catch (error) {
        console.error('QR token generation error:', error)
        throw new Error('Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.')
      }
    },
  })

  // 2. Create QR Code mutation
  const createQrCodeMutation = useMutation({
    mutationFn: async ({ token, providedOrderId }: { token: string; providedOrderId: string }) => {
      const username = session?.userId || 'guest'
      const content = `${username} ${providedOrderId}`

      const directQrResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/vietqr/create-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalPrice,
          content: content,
          order_id: providedOrderId,
        }),
      })

      if (!directQrResponse.ok) {
        throw new Error(`Failed to create QR: ${directQrResponse.status} ${directQrResponse.statusText}`)
      }

      const qrResponse = await directQrResponse.json()
      const responseData = qrResponse.data || qrResponse

      return {
        ...responseData,
        qrCode: responseData.qrCode || null,
      }
    },
    onSuccess: (data) => {
      setQrData(data)

      // Start the countdown timer when QR code is generated
      setTimeRemaining(15 * 60) // Reset to 15 minutes (in seconds)
      setIsTimerActive(true)

      // Proceed with transaction token generation if QR code exists
      if (data.qrCode) {
        transactionTokenMutation.mutate(data.qrCode)
      }
    },
  })

  // 3. Generate transaction token for verification
  const transactionTokenMutation = useMutation({
    mutationFn: async (qrCode: string) => {
      const credentials = 'shefit-vietqr:IlhtYFpFkh1ztl2hkJXuRgTpr+Ef9BZbL9Z9oYXk'
      const encodedCredentials =
        typeof window !== 'undefined' ? btoa(credentials) : Buffer.from(credentials).toString('base64')

      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/vietqr/api/token_generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify({ qrToken: qrCode }),
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to generate transaction token')
      }

      const tokenData = await tokenResponse.json()
      return tokenData.access_token || tokenData.data?.access_token
    },
    onSuccess: (syncToken, qrCode) => {
      // Wait before checking payment status
      setTimeout(() => {
        checkPaymentStatusMutation.mutate({
          syncToken,
          providedOrderId: orderId,
          attemptCount: 0,
        })
      }, 5000)
    },
  })

  // 4. Check payment transaction status
  const checkPaymentStatusMutation = useMutation({
    mutationFn: async ({
      syncToken,
      providedOrderId,
      attemptCount,
    }: {
      syncToken: string
      providedOrderId: string
      attemptCount: number
    }) => {
      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/payments/order-number/${providedOrderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${syncToken}`,
          },
        }
      )

      if (!paymentResponse.ok) {
        console.warn('Payment check warning:', await paymentResponse.text())
        return { success: false, retry: true, attemptCount }
      }

      const paymentData = await paymentResponse.json()

      if (paymentData.status === 'success' && paymentData.data && paymentData.data.order_number === providedOrderId) {
        return { success: true, retry: false, attemptCount }
      } else {
        return { success: false, retry: true, attemptCount }
      }
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        // If payment is successful, create subscription
        createSubscriptionMutation.mutate()
      } else if (result.retry && result.attemptCount < 10) {
        // If still need to retry and haven't exceeded max attempts
        setTimeout(() => {
          checkPaymentStatusMutation.mutate({
            syncToken: variables.syncToken,
            providedOrderId: variables.providedOrderId,
            attemptCount: result.attemptCount + 1,
          })
        }, 5000)
      }
    },
  })

  // 5. Create subscription after successful payment
  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!session?.userId) {
        throw new Error('User ID is not available')
      }

      const now = new Date()
      const endDate = new Date(now)

      // Find the selected gift if any
      const selectedGift = selectedGiftId
        ? subscription?.data.relationships.gifts?.find((g: any) => g.id === selectedGiftId)
        : null

      // Check if selected gift is a membership plan
      const giftDuration = selectedGift?.type === 'membership_plan' ? selectedGift.duration || 0 : 0

      // Calculate end date based on coupon type and gift
      if (isMembershipPlan && appliedCoupon?.discount_type === 'membership_plan') {
        // For membership plan, the discount_value is the total number of days
        // Add any additional days from a membership gift
        endDate.setDate(endDate.getDate() + appliedCoupon.discount_value + giftDuration)
      } else {
        // For regular subscriptions, use the selected price duration
        const subscriptionDuration = subscription?.data.prices.find((p: any) => p.id === selectedPriceId)?.duration || 1
        // Add any additional days from a membership gift
        endDate.setDate(endDate.getDate() + subscriptionDuration + giftDuration)
      }

      const subscriptionData = {
        user_id: session.userId,
        course_format: subscription?.data.course_format || 'both',
        status: 'active',
        subscription_start_at: now.toISOString(),
        subscription_end_at: endDate.toISOString(),
        order_number: `HD${new Date().getTime()}`,
        total_price: totalPrice,
        coupon_id: appliedCoupon?.id || null,
        gift_id: selectedGiftId,
        subscription_id: Number(id),
        exercise_ids: [],
        meal_plan_ids: [],
        dish_ids: [],
      } as UserSubscriptionPayload

      await createUserSubscription(session.userId, subscriptionData)
      return true
    },
    onSuccess: () => {
      setPurchaseSuccess(true)
      queryClient.invalidateQueries({ queryKey: [queryKeyUserSubscriptions, session?.userId] })
    },
  })

  // Combined loading state for all mutations
  const isProcessing =
    generateTokenMutation.isPending ||
    createQrCodeMutation.isPending ||
    transactionTokenMutation.isPending ||
    // checkPaymentStatusMutation.isPending ||
    createSubscriptionMutation.isPending

  // Combined error state
  const errorMessage =
    generateTokenMutation.error?.message ||
    createQrCodeMutation.error?.message ||
    transactionTokenMutation.error?.message ||
    // checkPaymentStatusMutation.error?.message ||
    createSubscriptionMutation.error?.message

  /**
   * Handles the purchase flow when user clicks "Buy Now" button
   * Checks for login, initiates payment process or directly creates subscription for free items
   */
  const handleBuyNow = () => {
    if (!session) {
      setIsLoginDialogOpen(true)
      return
    }

    if (!selectedPriceId) {
      return
    }

    setIsPaymentDialogOpen(true)
    setQrData(null)
    setPurchaseSuccess(false)
    // Reset timer state when starting a new payment
    setTimeRemaining(15 * 60)
    setIsTimerActive(false)

    // For free subscriptions (total price <= 0), skip payment steps and go directly to subscription creation
    if (totalPrice <= 0) {
      console.log('Free subscription detected, skipping payment steps')
      createSubscriptionMutation.mutate()
      return
    }

    const generatedOrderId = generateOrderId()
    setOrderId(generatedOrderId)

    // Start the payment flow by generating QR token
    generateTokenMutation.mutate(undefined, {
      onSuccess: (token) => {
        createQrCodeMutation.mutate({ token, providedOrderId: generatedOrderId })
      },
    })
  }

  // Loading state with skeleton
  if (isDataLoading) {
    return (
      <div className="flex flex-col px-4 py-10 md:px-10 xl:p-[60px] space-y-8 animate-pulse">
        {/* Skeleton for back button */}
        <div className="h-8 w-24 bg-gray-200 rounded"></div>

        {/* Skeleton for title */}
        <div className="h-12 w-3/4 bg-gray-200 rounded-lg"></div>

        {/* Skeleton for description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>

        {/* Skeleton for checkboxes */}
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
          <div className="flex space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Skeleton for price options */}
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
          <div className="flex space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Skeleton for total price */}
        <div className="flex justify-between">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Skeleton for button */}
        <div className="h-12 w-full bg-gray-200 rounded-full"></div>
      </div>
    )
  }

  // Session check with user-friendly message
  if (!session) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-6">
        <div className="text-lg text-center">Vui lòng đăng nhập để mua gói</div>
        <Button
          onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)}
          className="bg-[#13D8A7] hover:bg-[#11c296] text-white rounded-full px-8"
        >
          Đăng nhập
        </Button>
      </div>
    )
  }

  // Error handling with retry option
  if (subscriptionError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="text-red-500 text-lg text-center">
          Đã xảy ra lỗi khi tải thông tin gói.
          <div className="text-sm mt-2 text-gray-600">{(subscriptionError as Error).message}</div>
        </div>
        <Button
          onClick={() => router.refresh()}
          className="bg-[#13D8A7] hover:bg-[#11c296] text-white rounded-full px-8"
        >
          Thử lại
        </Button>
      </div>
    )
  }

  // Check if subscription exists
  if (!subscription) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="text-red-500 text-lg text-center">Gói không tồn tại hoặc đã bị xóa.</div>
        <Link href="/packages">
          <Button className="bg-[#13D8A7] hover:bg-[#11c296] text-white rounded-full px-8">Xem các gói khác</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="lg:py-16 py-4 px-4 md:py-16 md:px-10 xl:p-[60px] flex-1 max-w-[832px]">
        <Link href={`/packages/${id}${query}`} className="flex items-center gap-2 mb-4 md:mb-16 cursor-pointer">
          <BackIcon color="#000000" className="mb-1" />
          <div className="text-xl text-[#000000] font-semibold">Quay về</div>
        </Link>

        <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold mb-7">
          Gói {subscription.data.name}
        </div>

        <div className="text-base md:text-xl mb-7">
          <HTMLRenderer content={subscription.data.description_1} className="whitespace-pre-line text-[#737373]" />
        </div>

        <div className="mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">Loại hình</div>
          <div className="flex items-center gap-[26px]">
            <div className="flex items-center gap-[14px]">
              <Checkbox
                className="w-8 h-8 border-[#737373] disabled:opacity-100 disabled:cursor-default data-[state=checked]:bg-primary data-[state=checked]:text-white"
                checked={subscription.data.course_format === 'live' || subscription.data.course_format === 'both'}
                disabled
              />
              <div className="text-base md:text-xl text-[#737373]">Zoom HLV</div>
            </div>

            <div className="flex items-center gap-[14px]">
              <Checkbox
                className="w-8 h-8 border-[#737373] disabled:opacity-100 disabled:cursor-default data-[state=checked]:bg-primary data-[state=checked]:text-white"
                checked={subscription.data.course_format === 'video' || subscription.data.course_format === 'both'}
                disabled
              />
              <div className="text-base md:text-xl text-[#737373]">Video</div>
            </div>
          </div>
        </div>

        {/* Package Payment Section - Integrated from package-payment.tsx */}
        <div className="mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">Thời gian</div>
          <div className="flex items-center flex-wrap gap-y-[30px] gap-x-[52px]">
            {subscription.data.prices.map((price: any) => (
              <div className="flex items-center gap-[14px]" key={price.id}>
                <Checkbox
                  className="w-8 h-8 border-[#737373]"
                  checked={selectedPriceId === price.id}
                  onCheckedChange={() => handlePriceSelect(price.id, price.price)}
                  disabled={isMembershipPlan}
                />
                <div className={`text-base md:text-xl ${isMembershipPlan ? 'text-gray-400' : 'text-[#737373]'}`}>
                  {formatDuration(price.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-2.5">Code khuyến mãi</div>
          {!appliedCoupon ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập code của bạn"
                  className={`h-[54px] text-base md:text-[18px] ${couponError ? 'border-red-500' : 'border-[#E2E2E2]'}`}
                  value={couponCode}
                  onChange={(e) => {
                    // Remove spaces and convert to uppercase
                    const formattedValue = e.target.value.replace(/\s/g, '').toUpperCase()
                    setCouponCode(formattedValue)
                    if (couponError) setCouponError(null)
                  }}
                />
                <Button
                  className="h-[54px] bg-[#13D8A7] hover:bg-[#11c296] text-white"
                  onClick={handleCheckCoupon}
                  disabled={isCheckingCoupon || !couponCode.trim()}
                >
                  {isCheckingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
                </Button>
              </div>
              {couponError && <div className="text-red-500 text-sm mt-1">{couponError}</div>}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-4 bg-[#F8F8F8] rounded-md">
                <div className="flex flex-col">
                  <span className="font-semibold">{couponCode}</span>
                  <span className="text-green-600">
                    {appliedCoupon.discount_type === 'fixed_amount'
                      ? `Giảm ${appliedCoupon.discount_value.toLocaleString()} VNĐ`
                      : appliedCoupon.discount_type === 'percentage'
                      ? `Giảm ${appliedCoupon.discount_value}%`
                      : `Ngày miễn phí (${appliedCoupon.discount_value} ngày)`}
                  </span>
                </div>
                <Button variant="ghost" className="text-gray-500 hover:text-red-500 p-2" onClick={handleRemoveCoupon}>
                  <CloseIcon />
                </Button>
              </div>
              {isMembershipPlan && appliedCoupon && (
                <div className="text-amber-600 text-sm">
                  Ngày miễn phí đã được áp dụng. Thời hạn sử dụng là {appliedCoupon.discount_value} ngày.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="font-semibold text-[#000000] text-xl md:text-2xl">Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold text-2xl">{(totalPrice || 0).toLocaleString()} vnđ</div>
        </div>

        <div className="w-full flex gap-3 justify-center mb-10">
          <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-lg w-full rounded-full bg-[#13D8A7] hover:bg-[#11c296] text-white hover:text-white"
                onClick={(e) => {
                  if (!session) {
                    e.preventDefault()
                    setIsLoginDialogOpen(true)
                    return
                  }
                  handleBuyNow()
                }}
                disabled={!selectedPriceId || isProcessing}
              >
                {isProcessing ? 'Đang xử lý...' : totalPrice <= 0 ? 'Kích hoạt gói' : 'Mua gói'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
              {purchaseSuccess ? (
                <div className="flex flex-col items-center py-6">
                  <AlertDialogTitle className="text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-3xl mb-4">
                    ĐÃ MUA GÓI THÀNH CÔNG
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-lg">
                    Hãy vào trang tài khoản của bạn để bắt đầu làm bảng khảo sát số đo, các khóa tập & thực đơn
                  </AlertDialogDescription>
                  <Link href="/account/resources">
                    <Button
                      onClick={() => {
                        setIsPaymentDialogOpen(false)
                      }}
                      className="mt-6 bg-[#13D8A7] hover:bg-[#11c296] text-white rounded-full px-8 text-lg"
                    >
                      Tài khoản
                    </Button>
                  </Link>
                </div>
              ) : errorMessage ? (
                <div className="flex flex-col items-center py-6">
                  <AlertDialogTitle className="text-red-500 font-semibold text-xl mb-4">Đã xảy ra lỗi</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-lg text-red-500">
                    {errorMessage}
                  </AlertDialogDescription>
                  <Button
                    onClick={() => {
                      setIsPaymentDialogOpen(false)
                    }}
                    className="mt-6 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full px-8 text-lg"
                  >
                    Đóng
                  </Button>
                </div>
              ) : qrData ? (
                <div className="flex flex-col items-center gap-4">
                  <AlertDialogTitle className="text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-2xl">
                    Thanh toán đơn hàng
                  </AlertDialogTitle>
                  <div className="border rounded-md p-4 w-full flex flex-col items-center justify-center">
                    {qrData.expired ? (
                      <div className="p-8 text-center text-red-500 flex flex-col items-center gap-4">
                        <div className="font-bold text-lg">Mã QR đã hết hạn</div>
                        <div className="text-base text-gray-700">Mã QR chỉ có hiệu lực trong 15 phút</div>
                        <Button
                          className="bg-[#13D8A7] hover:bg-[#11c296] text-white mt-2"
                          onClick={() => {
                            // Generate new QR code
                            const newOrderId = generateOrderId()
                            setOrderId(newOrderId)
                            generateTokenMutation.mutate(undefined, {
                              onSuccess: (token) => {
                                createQrCodeMutation.mutate({ token, providedOrderId: newOrderId })
                              },
                            })
                          }}
                        >
                          Tạo mã QR mới
                        </Button>
                      </div>
                    ) : qrData.qrCode ? (
                      <Canvas
                        text={qrData.qrCode}
                        options={{
                          errorCorrectionLevel: 'M',
                          margin: 0,
                          scale: 4,
                          width: 256,
                        }}
                      />
                    ) : (
                      <div className="p-8 text-center text-gray-500">QR code không khả dụng</div>
                    )}
                  </div>
                  <div className="w-full space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngân hàng:</span>
                      <span className="font-medium">{qrData.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số tài khoản:</span>
                      <span className="font-medium">{qrData.bankAccount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chủ tài khoản:</span>
                      <span className="font-medium">{qrData.userBankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số tiền:</span>
                      <span className="font-medium text-[#00C7BE]">{Number(qrData.amount).toLocaleString()} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã đơn hàng:</span>
                      <span className="font-medium">{qrData.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nội dung:</span>
                      <span className="font-medium">{qrData.content}</span>
                    </div>
                  </div>
                  <div className="text-center text-sm space-y-1">
                    <div className="font-semibold">
                      Thời gian còn lại:{' '}
                      <span className={`${timeRemaining < 60 ? 'text-red-600 font-bold' : 'text-red-500'}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <div className="text-amber-500">
                      Mã thanh toán có hiệu lực trong 15 phút. Sau khi thanh toán thành công Shefit sẽ kích hoạt toàn
                      khoản cho bạn.
                    </div>
                    {timeRemaining < 60 && (
                      <div className="text-red-500 font-medium mt-1">
                        Sắp hết thời gian! Vui lòng hoàn tất thanh toán hoặc tạo mã QR mới.
                      </div>
                    )}
                  </div>
                  <AlertDialogFooter className="flex flex-row items-center gap-2">
                    <AlertDialogCancel className="mt-0">Huỷ thanh toán</AlertDialogCancel>
                    {qrData.qrCode && !qrData.expired && (
                      <Button
                        onClick={() => handleDownloadQR(qrData)}
                        className="flex items-center gap-2 bg-[#13D8A7] hover:bg-[#11c296] text-white"
                      >
                        <Download size={16} />
                        Tải mã QR
                      </Button>
                    )}
                  </AlertDialogFooter>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <AlertDialogTitle className="text-ring font-[family-name:var(--font-roboto-condensed] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-xl">
                    Đang tạo đơn hàng
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center mt-4">
                    Vui lòng đợi trong giây lát...
                  </AlertDialogDescription>
                </div>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center text-center gap-6">
              <p className="text-lg">HÃY ĐĂNG NHẬP ĐỂ MUA GÓI</p>
              <div className="flex gap-4 justify-center w-full px-10">
                <div className="flex-1">
                  <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div>
          {subscription.data.relationships.gifts?.length > 0 && (
            <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold mb-[14px]">
              Chọn quà tặng
              <div className="text-base md:text-xl text-[#737373] mb-7">Được ship đến tận nhà!</div>
              <div className="flex flex-col gap-7 mb-7">
                {subscription.data.relationships.gifts?.map(
                  (gift: { id: number; type: string; name?: string; image?: string; duration?: number }) => (
                    <div key={gift.id}>
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          {gift.type === 'item' ? (
                            <>
                              <img
                                src={gift.image}
                                alt={gift.name}
                                className="rounded-[10px] aspect-square w-[85px] object-cover"
                              />
                              <div>
                                <div className="text-[#000000] text-base md:text-xl font-medium mb-2">{gift.name}</div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-[85px] h-[85px] flex items-center justify-center rounded-[10px]">
                                <Image
                                  src={ShefitLogo}
                                  width={100}
                                  height={100}
                                  className="object-contain"
                                  alt="Shefit"
                                />
                              </div>
                              <div>
                                {gift.duration && (
                                  <div className="text-[#000000] text-base md:text-xl font-medium mb-2">
                                    {formatDuration(gift.duration)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <Checkbox
                          className="w-8 h-8 border-[#737373] data-[state=checked]:bg-primary data-[state=checked]:text-white"
                          checked={selectedGiftId === gift.id}
                          onCheckedChange={(checked) => {
                            setSelectedGiftId(checked ? gift.id : null)
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div>
            <div className="text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold mb-[14px]">
              Hướng dẫn
            </div>

            <div className="text-[#737373] text-base md:text-xl mb-7">
              Sau khi chuyển khoản thành công, hệ thống sẽ kích hoạt tài khoản và bạn có thể xem các khóa tập & thực
              đơn!
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block flex-1">
        <div className="w-full aspect-[2/3] relative">
          <Image src="/two-women-doing-exercises.avif" fill className="object-cover" alt="image" />
        </div>
      </div>
    </div>
  )
}

/**
 * Function to handle QR code download
 * Creates a custom image with QR code and payment information
 * @param qrData The QR code data containing payment information
 */
const handleDownloadQR = (qrData: any | null) => {
  if (!qrData?.qrCode) return

  // Create a canvas element for the complete payment info
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set up dimensions for the full image
  const padding = 30
  const qrSize = 300
  const width = qrSize + padding * 2
  const lineHeight = 30

  // Calculate height based on payment info
  const infoLines = 6 // Number of information lines (bank, account, name, amount, order ID, content)
  const titleHeight = 60
  const headerHeight = titleHeight + padding
  const infoHeight = infoLines * lineHeight + padding * 2
  const height = headerHeight + qrSize + infoHeight + padding

  // Set canvas dimensions
  canvas.width = width
  canvas.height = height

  // Fill background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)

  // Draw header with title
  ctx.fillStyle = '#FFADAF'
  ctx.fillRect(0, 0, width, titleHeight)

  // Add title text
  ctx.font = 'bold 20px Helvetica'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText('Thanh toán đơn hàng', width / 2, titleHeight / 2 + 8)

  // Load logo for watermark
  const logo = new window.Image()
  logo.src = '/logo-vertical-dark.png'

  // Load QR code image
  const qrImage = new window.Image()

  // Wait for both images to load
  Promise.all([
    new Promise((resolve) => {
      logo.onload = resolve
      logo.onerror = () => {
        console.error('Failed to load logo')
        resolve(null)
      }
    }),
    new Promise((resolve) => {
      const qrCanvas = document.querySelector('canvas')
      if (qrCanvas) {
        qrImage.onload = resolve
        qrImage.src = qrCanvas.toDataURL('image/png')
      } else {
        resolve(null)
      }
    }),
  ]).then(() => {
    // Draw the QR code
    ctx.drawImage(qrImage, padding, headerHeight, qrSize, qrSize)

    // Draw the logo as a watermark
    const logoWidth = 120
    const logoHeight = 120
    const logoX = width - logoWidth - 10
    const logoY = height - logoHeight - 10

    // Apply watermark with transparency
    ctx.globalAlpha = 0.3
    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)
    ctx.globalAlpha = 1.0

    // Draw payment information
    ctx.font = '16px Arial'
    ctx.fillStyle = '#333'
    ctx.textAlign = 'left'

    const infoStartY = headerHeight + qrSize + padding

    // Helper function to draw a label-value pair
    const drawInfoLine = (label: string, value: string, lineNumber: number) => {
      const y = infoStartY + lineNumber * lineHeight
      ctx.fillStyle = '#737373'
      ctx.fillText(label, padding, y)

      ctx.fillStyle = '#000'
      ctx.font = 'bold 16px Helvetica'
      ctx.textAlign = 'right'
      ctx.fillText(value, width - padding, y)

      ctx.textAlign = 'left'
      ctx.font = '16px Helvetica'
    }

    // Draw payment details
    drawInfoLine('Ngân hàng:', qrData.bankName || 'N/A', 0)
    drawInfoLine('Số tài khoản:', qrData.bankAccount || 'N/A', 1)
    drawInfoLine('Chủ tài khoản:', qrData.userBankName || 'N/A', 2)
    drawInfoLine('Số tiền:', `${Number(qrData.amount).toLocaleString()} VNĐ`, 3)
    drawInfoLine('Mã đơn hàng:', qrData.orderId || 'N/A', 4)
    drawInfoLine('Nội dung:', qrData.content || 'N/A', 5)

    // Convert canvas to data URL and download
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `qr-payment-${qrData.orderId}.png`
    link.href = dataURL
    link.click()
  })
}
