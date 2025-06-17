'use client'

import { useState, useEffect, useCallback } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSession } from '@/components/providers/session-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createUserSubscription } from '@/network/server/user-subscriptions'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

import { useQRCode } from 'next-qrcode'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CloseIcon } from '@/components/icons/CloseIcon'

interface Price {
  id: number
  duration: number
  price: number
}

interface PackagePaymentProps {
  prices: Price[]
  defaultPrice: number
  packageName: string
}

export function PackagePayment({ prices, defaultPrice, packageName }: PackagePaymentProps) {
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const { Canvas } = useQRCode()
  const params = useParams()
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(defaultPrice || 0)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const [qrData, setQrData] = useState<any>(null)
  const [orderId, setOrderId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  useState<number | null>(null)

  const handleLoginClick = () => {
    setIsLoginDialogOpen(false)
    redirectToLogin()
  }

  const generateOrderId = () => {
    return Math.floor(Math.random() * 900 + 100).toString()
  }

  const handleBuyNow = () => {
    if (!session) {
      return
    }
    setQrData(null)
    setAccessToken(null)
    setOrderId('')
    setPaymentError(null)
    setIsPaymentDialogOpen(true)
    getQrTokenAndCreateQr()
  }

  const getQrTokenAndCreateQr = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      setPaymentError(null)

      const response = await fetch('https://shefit-stg.rockship.co/api/v1/vietqr/generate-qr-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic Y3VzdG9tZXItc2hlZml0LXVzZXIyNTMwNjpZM1Z6ZEc5dFpYSXRjMmhsWm1sMExYVnpaWEl5TlRNd05nPT0=',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to generate QR token: ${response.status} ${response.statusText}`)
      }

      const tokenData = await response.json()
      const token = tokenData.access_token
      console.log('QR Token Access Token:', token)
      setAccessToken(token)

      console.log('Full token before createQr:', token)

      const newOrderId = generateOrderId()
      setOrderId(newOrderId)

      const username = session?.userId || 'guest'
      const content = `${username} ${newOrderId}`

      const directQrResponse = await fetch('https://shefit-stg.rockship.co/api/v1/vietqr/create-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalPrice,
          content: content,
          order_id: newOrderId,
        }),
      })

      if (!directQrResponse.ok) {
        throw new Error(`Failed to create QR: ${directQrResponse.status} ${directQrResponse.statusText}`)
      }

      const qrResponse = await directQrResponse.json()

      console.log('QR Creation Response:', qrResponse)

      const responseData = qrResponse.data || qrResponse
      const qrCode = responseData.qrCode || null

      setQrData({
        ...responseData,
        qrCode: qrCode,
      })

      if (qrCode) {
        console.log('Received QR Code string for rendering:', qrCode)

        try {
          const credentials = 'shefit-vietqr:IlhtYFpFkh1ztl2hkJXuRgTpr+Ef9BZbL9Z9oYXk'
          const encodedCredentials =
            typeof window !== 'undefined' ? btoa(credentials) : Buffer.from(credentials).toString('base64')

          const tokenResponse = await fetch('https://shefit-stg.rockship.co/api/v1/vietqr/api/token_generate', {
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
          console.log('Token generate response:', tokenData)

          const syncToken = tokenData.access_token || tokenData.data?.access_token

          if (syncToken) {
            const syncResponse = await fetch('https://shefit-stg.rockship.co/api/v1/vietqr/bank/api/transaction-sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${syncToken}`,
              },
              body: JSON.stringify({
                bankaccount: responseData.bankAccount || 'string',
                amount: totalPrice,
                transType: 'string',
                content: `${session?.userId} ${orderId}`,
                orderId: orderId,
              }),
            })

            if (!syncResponse.ok) {
              console.warn('Transaction sync warning:', await syncResponse.text())
            } else {
              const syncData = await syncResponse.json()
              console.log('Transaction sync response:', syncData)

              if (syncData.error === false || (syncData.data && syncData.data.error === false)) {
                try {
                  const now = new Date()
                  const endDate = new Date(now)
                  endDate.setMonth(endDate.getMonth() + (prices.find((p) => p.id === selectedPriceId)?.duration || 1))
                  const subscriptionData = {
                    user_id: session?.userId,
                    subscription_id: Number(params?.slug),
                    course_format: 'video',
                    coupon_code: '',
                    status: 'active',
                    subscription_start_at: now.toISOString(),
                    subscription_end_at: endDate.toISOString(),
                    order_number: `ORDER-${Date.now()}`,
                    total_price: totalPrice,
                  }
                  if (session?.userId) {
                    await createUserSubscription(subscriptionData, session.userId.toString())
                    setPurchaseSuccess(true)
                  } else {
                    throw new Error('User ID is not available')
                  }
                } catch (error) {
                  console.error('Error creating subscription:', error)
                  setPaymentError('Payment successful but failed to activate subscription. Please contact support.')
                  setPurchaseSuccess(false)
                }
              }
            }
          }
        } catch (syncError) {
          console.error('Error in transaction sync process:', syncError)
        }
      }
    } catch (error: any) {
      console.error('Error in QR process:', error)
      setErrorMessage(error.message || 'Failed to generate QR code')
    } finally {
      setIsLoading(false)
    }
  }, [session, totalPrice])

  const handlePriceSelect = (priceId: number, price: number) => {
    if (selectedPriceId === priceId) return
    setSelectedPriceId(priceId)
    setTotalPrice(price)
  }

  return (
    <>
      <div className="mb-8">
        <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-3">Thời gian</div>
        <div className="flex items-center flex-wrap gap-y-[30px] gap-x-[52px]">
          {prices.map((price) => (
            <div className="flex items-center gap-[14px]" key={price.id}>
              <Checkbox
                className="w-8 h-8 border-[#737373]"
                checked={selectedPriceId === price.id}
                onCheckedChange={() => handlePriceSelect(price.id, price.price)}
              />
              <div className="text-base md:text-xl text-[#737373]">{price.duration} tháng</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="font-semibold text-[#000000] text-xl md:text-2xl mb-2.5">Code khuyến mãi</div>
        <Input placeholder="Nhập code của bạn" className="h-[54px] text-base md:text-[18px] border-[#E2E2E2]" />
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
              disabled={!selectedPriceId || isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Mua gói'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogCancel className="absolute top-4 right-4 border-none hover:bg-white shadow-none active:bg-none">
                <CloseIcon />
              </AlertDialogCancel>
              {purchaseSuccess ? (
                <div className="flex flex-col items-center py-6">
                  <AlertDialogTitle className="text-ring font-[family-name:var(--font-coiny)] text-xl">
                    ĐÃ MUA GÓI THÀNH CÔNG
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-base">
                    Hãy vào trang tài khoản của bạn để bắt đầu làm bảng khảo sát số đo, các khóa tập & thực đơn
                  </AlertDialogDescription>
                  <Link href="/account">
                    <Button
                      onClick={() => {
                        setIsPaymentDialogOpen(false)
                      }}
                      className="mt-6 bg-[#13D8A7] hover:bg-[#11c296] text-white rounded-full px-8"
                    >
                      Tài khoản
                    </Button>
                  </Link>
                </div>
              ) : qrData ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <AlertDialogTitle className="text-ring font-[family-name:var(--font-coiny)] text-2xl">
                    Thanh toán đơn hàng
                  </AlertDialogTitle>
                  <div className="border rounded-md p-4 w-full flex justify-center">
                    {qrData.qrCode ? (
                      <Canvas
                        text={qrData.qrCode}
                        options={{
                          errorCorrectionLevel: 'M',
                          margin: 3,
                          scale: 4,
                          width: 300,
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
                  <AlertDialogDescription className="text-center mt-4">
                    Quét mã QR để thanh toán đơn hàng của bạn.
                  </AlertDialogDescription>
                </div>
              ) : paymentError ? (
                <div className="flex flex-col items-center py-6">
                  <AlertDialogTitle className="text-ring font-[family-name:var(--font-coiny)] text-xl text-red-500">
                    Lỗi thanh toán
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center mt-4">{paymentError}</AlertDialogDescription>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <AlertDialogTitle className="text-ring font-[family-name:var(--font-coiny)] text-xl">
                    Đang tạo đơn hàng
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center mt-4">
                    Vui lòng đợi trong giây lát...
                  </AlertDialogDescription>
                </div>
              )}
            </AlertDialogHeader>
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
    </>
  )
}
