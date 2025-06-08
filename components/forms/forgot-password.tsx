'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainButton } from '@/components/buttons/main-button'
import { register } from '@/network/server/auth'
import { SendOTP, VerifyOTP } from '@/network/server/verify-email'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [otpCounter, setOtpCounter] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(email))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    validateEmail(newEmail)
  }

  const handleSendOTP = async () => {
    if (!isEmailValid) return

    setIsLoading(true)
    try {
      const response = await SendOTP(email)
      if (response && response.status === 'success') {
        setOtpCounter(response.data.otp_counter)
        setIsOtpSent(true)
        toast.success('OTP đã được gửi đến email của bạn!')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Không thể gửi OTP. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    try {
      const emailValue = formData.get('email')?.toString() || ''
      const otpValue = formData.get('otp')?.toString() || ''

      if (!isOtpVerified) {
        if (!otpCounter) {
          toast.error('Vui lòng gửi OTP trước khi đăng ký!')
          return false
        }

        setIsLoading(true)
        let otpVerified = false

        try {
          const verifyResponse = await VerifyOTP(emailValue, otpValue, otpCounter)

          if (!verifyResponse || verifyResponse.status !== 'success') {
            toast.error('Xác thực OTP thất bại!')
            setIsLoading(false)
            return false // Return false to indicate submission should not continue
          }

          if (verifyResponse.data && verifyResponse.data.verified === false) {
            const errorMessage = verifyResponse.data.error || 'Mã OTP không hợp lệ hoặc đã hết hạn!'
            toast.error(errorMessage)
            setIsLoading(false)
            return false // Return false to indicate submission should not continue
          }

          // OTP verification successful
          setIsOtpVerified(true)
          otpVerified = true
        } catch (error) {
          console.error('Error verifying OTP:', error)
          toast.error('Xác thực OTP thất bại!')
          setIsLoading(false)
          return false // Return false to indicate submission should not continue
        }

        if (!otpVerified) {
          return false // Return false to indicate submission should not continue
        }
      }

      const data = {
        fullname: formData.get('fullname')?.toString() || '',
        phone_number: formData.get('phone_number')?.toString() || '',
        email: emailValue,
        username: formData.get('username')?.toString() || '',
        password: formData.get('password')?.toString() || '',
      }

      const response = await register(data)

      if (response.status === 400) {
        toast.error('Đăng ký thất bại!')
      } else {
        toast.success('Đăng ký thành công!')
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Error during registration:', error)
      toast.error('Đã xảy ra lỗi khi đăng ký.')
    } finally {
      setIsLoading(false)
    }
  }

  // Custom form submission handler to prevent form clearing on OTP verification failure
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    await handleSubmit(formData)
  }
  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex gap-2">
        <div className="w-2/3">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="Nhập email của bạn"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="w-1/3 relative">
          <Label htmlFor="otp">OTP</Label>
          <div className="relative">
            <Input
              placeholder="Nhập OTP của bạn"
              id="otp"
              name="otp"
              type="text"
              className="pr-24"
              disabled={!isOtpSent}
            />
            <Button
              type="button"
              variant="secondary"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-xs bg-[#13D8A7] text-white hover:bg-[#13D8A7] hover:text-white"
              disabled={!isEmailValid || isLoading}
              onClick={handleSendOTP}
            >
              {isLoading ? 'Đang gửi...' : isOtpSent ? 'Gửi lại' : 'Gửi OTP'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input placeholder="Nhập mật khẩu của bạn" id="password" name="password" type="password" />
      </div>
      <div className="mx-auto space-y-2">
        <Label htmlFor="password">Xác nhận mật khẩu</Label>
        <Input placeholder="Nhập lại mật khẩu của bạn" id="password" name="password" type="password" />
      </div>
      <MainButton
        type="submit"
        className="w-full p-3 rounded-3xl"
        text="Đổi mật khẩu"
        disabled={isLoading || !isOtpSent}
      />
    </form>
  )
}

export { ForgotPassword }
