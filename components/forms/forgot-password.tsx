'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CustomInput } from '../ui/custom-input'
import { MainButton } from '@/components/buttons/main-button'
import { resetPassword } from '@/network/client/auth'
import { sendResetPasswordOTP, verifyResetPasswordOTP } from '@/network/client/emails'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [otpCounter, setOtpCounter] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(email))
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [cooldown])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    validateEmail(newEmail)
  }

  const handleSendOTP = async () => {
    if (!isEmailValid || cooldown > 0) return

    setIsLoading(true)
    try {
      const response = await sendResetPasswordOTP(email)
      if (response && response.status === 'success') {
        setOtpCounter(response.data.otp_counter)
        setIsOtpSent(true)
        setCooldown(60)
        toast.success('OTP đã được gửi đến email của bạn!')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('Không thể gửi OTP. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  const resetFormState = () => {
    setIsOtpSent(false)
    setIsOtpVerified(false)
    setOtpCounter(null)
    setCooldown(0)
  }

  const validatePasswords = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!')
      return false
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!')
      return false
    }

    return true
  }

  const checkForEmailNotFoundError = (error: any) => {
    if (error && error.message) {
      const message = error.message.toLowerCase()
      if (message.includes('not found') || message.includes('không tìm thấy') || message.includes('email not exist')) {
        return true
      }
    }

    if (typeof error === 'string') {
      const errorString = error.toLowerCase()
      if (
        errorString.includes('not found') ||
        errorString.includes('không tìm thấy') ||
        errorString.includes('email not exist')
      ) {
        return true
      }
    }

    return false
  }

  async function handleSubmit(formData: FormData) {
    try {
      const emailValue = formData.get('email')?.toString() || ''
      const otpValue = formData.get('otp')?.toString() || ''
      const password = formData.get('password')?.toString() || ''
      const confirmPassword = formData.get('confirm_password')?.toString() || ''

      if (!validatePasswords(password, confirmPassword)) {
        return false
      }

      if (!isOtpVerified) {
        if (!otpCounter) {
          toast.error('Vui lòng gửi OTP trước khi đổi mật khẩu!')
          return false
        }

        setIsLoading(true)
        let otpVerified = false

        try {
          const verifyResponse = await verifyResetPasswordOTP(emailValue, otpValue, otpCounter)

          if (!verifyResponse || verifyResponse.status !== 'success') {
            toast.error('Xác thực OTP thất bại!')
            setIsLoading(false)
            return false
          }

          if (verifyResponse.data && verifyResponse.data.verified === false) {
            const errorMessage = verifyResponse.data.error || 'Mã OTP không hợp lệ hoặc đã hết hạn!'
            toast.error(errorMessage)
            setIsLoading(false)
            return false
          }

          setIsOtpVerified(true)
          otpVerified = true
        } catch (error) {
          console.error('Error verifying OTP:', error)
          toast.error('Xác thực OTP thất bại!')
          setIsLoading(false)
          return false
        }

        if (!otpVerified) {
          return false
        }
      }

      const resetData = {
        email: emailValue,
        new_password: password,
        otp: otpValue,
        counter: otpCounter || 0,
      }

      const response = await resetPassword(resetData)

      if (response.status === 400) {
        toast.error('Đổi mật khẩu thất bại!')
      } else if (response.status === 200 || response.status === 201) {
        toast.success('Đổi mật khẩu thành công!')
        router.push('/auth/login')
      } else {
        toast.error('Đã xảy ra lỗi khi đổi mật khẩu.')
      }
    } catch (error) {
      console.error('Error during password reset:', error)

      // Check if the error is about email not found
      if (checkForEmailNotFoundError(error)) {
        toast.error('Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại!')
        resetFormState()
      } else {
        toast.error('Đã xảy ra lỗi khi đổi mật khẩu.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    await handleSubmit(formData)
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex lg:flex-row flex-col gap-2">
        <div className="lg:w-3/5 w-full">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="Nhập email của bạn"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="lg:w-2/5 w-full relative">
          <Label htmlFor="otp">OTP</Label>
          <div className="relative">
            <Input
              placeholder="Nhập OTP của bạn"
              id="otp"
              name="otp"
              type="text"
              className="pr-24"
              disabled={!isOtpSent}
              required
            />
            <Button
              type="button"
              variant="secondary"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-xs bg-[#13D8A7] text-white hover:bg-[#13D8A7] hover:text-white"
              disabled={!isEmailValid || isLoading || cooldown > 0}
              onClick={handleSendOTP}
            >
              {isLoading
                ? 'Đang gửi...'
                : cooldown > 0
                ? `Gửi lại sau (${cooldown}s)`
                : isOtpSent
                ? 'Gửi lại'
                : 'Gửi OTP'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto space-y-2">
        <Label htmlFor="password">Mật khẩu mới</Label>
        <CustomInput placeholder="Nhập mật khẩu mới của bạn" id="password" name="password" type="password" required />
      </div>
      <div className="mx-auto space-y-2">
        <Label htmlFor="confirm_password">Xác nhận mật khẩu</Label>
        <CustomInput
          placeholder="Nhập lại mật khẩu mới của bạn"
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
        />
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
