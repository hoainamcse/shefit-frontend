'use client'

import { useState, useEffect, useCallback } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { createUserSubscription } from '@/network/client/users'

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
import { formatDuration } from '@/lib/helpers'
import { Download } from 'lucide-react'

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
  const router = useRouter()
  const pathname = usePathname()
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
  const [paymentVerified, setPaymentVerified] = useState(false)
  useState<number | null>(null)

  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
  }

  const generateOrderId = () => {
    return Math.floor(Math.random() * 900 + 100).toString()
  }

  const handleBuyNow = () => {
    if (!session) {
      setIsLoginDialogOpen(true)
      return
    }

    if (!selectedPriceId || !totalPrice) {
      return
    }

    setIsPaymentDialogOpen(true)
    setIsLoading(true)
    setQrData(null)
    setErrorMessage(null)
    setPaymentError(null)

    const generatedOrderId = generateOrderId()
    setOrderId(generatedOrderId)

    getQrTokenAndCreateQr(generatedOrderId)
  }

  const getQrTokenAndCreateQr = useCallback(
    async (providedOrderId: string) => {
      try {
        setIsLoading(true)
        setErrorMessage(null)
        setPaymentError(null)

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
        const token = tokenData.access_token
        setAccessToken(token)
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
        const qrCode = responseData.qrCode || null

        setQrData({
          ...responseData,
          qrCode: qrCode,
        })

        if (qrCode) {
          try {
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
            const syncToken = tokenData.access_token || tokenData.data?.access_token

            if (syncToken) {
              try {
                await new Promise((resolve) => setTimeout(resolve, 5000))
                const checkTransactionStatus = async () => {
                  try {
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
                      return { success: false, retry: true }
                    }

                    const paymentData = await paymentResponse.json()

                    if (
                      paymentData.status === 'success' &&
                      paymentData.data &&
                      paymentData.data.order_number === providedOrderId
                    ) {
                      setPaymentVerified(true)
                      return { success: true, retry: false }
                    } else {
                      return { success: false, retry: true }
                    }
                  } catch (error) {
                    return { success: false, retry: true }
                  }
                }

                let checkResult = await checkTransactionStatus()

                let attempts = 0
                const maxAttempts = 10

                while (checkResult.retry && attempts < maxAttempts) {
                  await new Promise((resolve) => setTimeout(resolve, 5000))
                  checkResult = await checkTransactionStatus()
                  attempts++
                }

                if (checkResult.success) {
                  try {
                    const now = new Date()
                    const endDate = new Date(now)
                    endDate.setDate(endDate.getDate() + (prices.find((p) => p.id === selectedPriceId)?.duration || 1))
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
                      await createUserSubscription(subscriptionData, session.userId)
                      setPurchaseSuccess(true)
                    } else {
                      throw new Error('User ID is not available')
                    }
                  } catch (error) {
                    console.error('Error creating subscription:', error)
                    setPaymentError('Payment successful but failed to activate subscription. Please contact support.')
                    setPurchaseSuccess(false)
                  }
                } else {
                  console.log('Transaction verification failed after multiple attempts')
                  setPaymentError('Payment verification failed. Please try again or contact support.')
                }
              } catch (transactionError) {
                console.error('Error in transaction verification process:', transactionError)
                setPaymentError('Error verifying payment. Please try again or contact support.')
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
    },
    [session, totalPrice]
  )

  const handlePriceSelect = (priceId: number, price: number) => {
    if (selectedPriceId === priceId) return
    setSelectedPriceId(priceId)
    setTotalPrice(price)
  }

  const handleDownloadQR = () => {
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
    const logo = new Image()
    logo.src = '/logo-vertical-dark.png'

    // Load QR code image
    const qrImage = new Image()

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
      link.download = `qr-payment-${orderId}.png`
      link.href = dataURL
      link.click()
    })
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
              <div className="text-base md:text-xl text-[#737373]">{formatDuration(price.duration)}</div>
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
          <AlertDialogContent className="max-w-lg">
            <AlertDialogHeader>
              <AlertDialogCancel className="absolute top-4 right-4 border-none hover:bg-white shadow-none active:bg-none">
                <CloseIcon />
              </AlertDialogCancel>
            </AlertDialogHeader>
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
            ) : qrData ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <AlertDialogTitle className="text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-2xl">
                  Thanh toán đơn hàng
                </AlertDialogTitle>
                <div className="border rounded-md p-4 w-full flex flex-col items-center justify-center">
                  {qrData.qrCode ? (
                    <>
                      <Canvas
                        text={qrData.qrCode}
                        options={{
                          errorCorrectionLevel: 'M',
                          margin: 3,
                          scale: 4,
                          width: 300,
                        }}
                      />
                      <Button
                        onClick={handleDownloadQR}
                        className="mt-3 flex items-center gap-2 bg-[#13D8A7] hover:bg-[#11c296] text-white"
                      >
                        <Download size={16} />
                        Tải mã QR
                      </Button>
                    </>
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
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <AlertDialogTitle className="text-ring font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-xl">
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
    </>
  )
}
