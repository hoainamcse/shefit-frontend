'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainButton } from '@/components/buttons/main-button'
import { register } from '@/network/server/auth'
import { sendOTP, verifyOTP } from '@/network/client/emails'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { CustomInput } from '../ui/custom-input'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_894_1146)">
        <path
          d="M8.86055 0.789433C6.46258 1.62131 4.39457 3.20024 2.96029 5.29431C1.526 7.38838 0.801037 9.8872 0.891883 12.4237C0.982729 14.9603 1.88459 17.4008 3.46501 19.3869C5.04543 21.373 7.22109 22.8 9.67243 23.4582C11.6598 23.971 13.7419 23.9935 15.7399 23.5238C17.5499 23.1173 19.2233 22.2476 20.5962 21.0001C22.0251 19.662 23.0623 17.9597 23.5962 16.0763C24.1763 14.0282 24.2796 11.8743 23.8981 9.78006H12.7381V14.4094H19.2012C19.072 15.1478 18.7952 15.8525 18.3873 16.4814C17.9795 17.1102 17.4489 17.6504 16.8274 18.0694C16.0383 18.5917 15.1486 18.943 14.2156 19.1007C13.2798 19.2747 12.32 19.2747 11.3843 19.1007C10.4358 18.9048 9.53863 18.5134 8.74993 17.9513C7.48271 17.0543 6.5312 15.7799 6.03118 14.3101C5.52285 12.8126 5.52285 11.1893 6.03118 9.69193C6.3871 8.64234 6.97549 7.68669 7.75243 6.89631C8.64154 5.97521 9.76718 5.3168 11.0058 4.99333C12.2445 4.66985 13.5484 4.6938 14.7743 5.06256C15.7321 5.35641 16.6079 5.87008 17.3318 6.56256C18.0606 5.83756 18.7881 5.11068 19.5143 4.38193C19.8893 3.99006 20.2981 3.61693 20.6674 3.21568C19.5622 2.18728 18.2649 1.387 16.8499 0.860683C14.2731 -0.0749616 11.4536 -0.100106 8.86055 0.789433Z"
          fill="url(#paint0_linear_894_1146)"
        />
        <path
          d="M8.8607 0.789367C11.4536 -0.100776 14.2731 -0.0762934 16.8501 0.858742C18.2653 1.38864 19.562 2.19277 20.6657 3.22499C20.2907 3.62624 19.8951 4.00124 19.5126 4.39124C18.7851 5.11749 18.0582 5.84124 17.332 6.56249C16.608 5.87001 15.7322 5.35635 14.7745 5.06249C13.5489 4.69244 12.2451 4.66711 11.0061 4.98926C9.76712 5.31141 8.64079 5.96861 7.7507 6.88874C6.97377 7.67912 6.38538 8.63477 6.02945 9.68437L2.14258 6.67499C3.53384 3.91604 5.94273 1.80566 8.8607 0.789367Z"
          fill="#E33629"
        />
        <path
          d="M1.1114 9.6563C1.32016 8.62087 1.66701 7.61816 2.14265 6.67505L6.02953 9.69192C5.52119 11.1893 5.52119 12.8126 6.02953 14.31C4.73453 15.3101 3.4389 16.3151 2.14265 17.3251C0.952308 14.9556 0.589275 12.256 1.1114 9.6563Z"
          fill="#F8BD00"
        />
        <path
          d="M12.7381 9.77808H23.8981C24.2797 11.8723 24.1764 14.0262 23.5963 16.0743C23.0623 17.9577 22.0252 19.66 20.5963 20.9981C19.3419 20.0193 18.0819 19.0481 16.8275 18.0693C17.4494 17.6499 17.9802 17.1091 18.3881 16.4796C18.796 15.85 19.0726 15.1446 19.2013 14.4056H12.7381C12.7363 12.8643 12.7381 11.3212 12.7381 9.77808Z"
          fill="#587DBD"
        />
        <path
          d="M2.14062 17.3251C3.43687 16.3251 4.7325 15.3201 6.0275 14.3101C6.52851 15.7804 7.48138 17.0549 8.75 17.9513C9.54116 18.5107 10.4403 18.899 11.39 19.0913C12.3257 19.2653 13.2855 19.2653 14.2212 19.0913C15.1543 18.9336 16.044 18.5823 16.8331 18.0601C18.0875 19.0388 19.3475 20.0101 20.6019 20.9888C19.2292 22.237 17.5558 23.1073 15.7456 23.5144C13.7476 23.9841 11.6655 23.9616 9.67812 23.4488C8.10632 23.0291 6.63814 22.2893 5.36562 21.2757C4.01886 20.2062 2.91882 18.8587 2.14062 17.3251Z"
          fill="#319F43"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_894_1146"
          x1="12.504"
          y1="0.140137"
          x2="12.504"
          y2="23.8602"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#74BBFC" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <clipPath id="clip0_894_1146">
          <rect width="24" height="24" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.1199 5.32003H16.9999V2.14003C16.0896 2.04538 15.175 1.99865 14.2599 2.00003C11.5399 2.00003 9.67986 3.66003 9.67986 6.70003V9.32003H6.60986V12.88H9.67986V22H13.3599V12.88H16.4199L16.8799 9.32003H13.3599V7.05003C13.3599 6.00003 13.6399 5.32003 15.1199 5.32003Z"
        fill="#007AFE"
      />
    </svg>
  )
}

function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [otpCounter, setOtpCounter] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

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
    if (!isEmailValid || cooldown > 0) return

    setIsLoading(true)
    try {
      const response = await sendOTP(email)
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

  const checkForEmailExistsError = (error: any) => {
    if (error && error.message) {
      const message = error.message.toLowerCase()
      if (message.includes('already registered') || message.includes('đã tồn tại')) {
        return true
      }
    }
    if (typeof error === 'string') {
      const errorString = error.toLowerCase()
      if (errorString.includes('already registered') || errorString.includes('đã tồn tại')) {
        return true
      }
    }

    return false
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
          const verifyResponse = await verifyOTP(emailValue, otpValue, otpCounter)

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

      const password = formData.get('password')?.toString() || ''
      if (password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự')
        setIsLoading(false)
        return false
      }

      const data = {
        fullname: formData.get('fullname')?.toString() || '',
        phone_number: formData.get('phone_number')?.toString() || '',
        email: emailValue,
        username: formData.get('username')?.toString() || '',
        password: password,
      }

      const response = await register(data)

      if (response.status === 400 || response.status === 401) {
        toast.error('Đăng ký thất bại!')
      } else {
        toast.success('Đăng ký thành công!')
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Error during registration:', error)

      if (checkForEmailExistsError(error)) {
        toast.error('Email này đã tồn tại trong hệ thống. Vui lòng sử dụng email khác!')
        resetFormState()
      } else {
        toast.error('Đã xảy ra lỗi khi đăng ký.')
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
      <div className="mx-auto space-y-2">
        <Label htmlFor="fullname">Tên</Label>
        <Input placeholder="Nhập tên của bạn" id="fullname" name="fullname" type="text" />
      </div>
      <div className="mx-auto space-y-2">
        <Label htmlFor="phoneNumber">Số điện thoại</Label>
        <Input placeholder="Nhập số điện thoại của bạn" id="phoneNumber" name="phone_number" type="text" />
      </div>
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
        <Label htmlFor="username">Tên đăng nhập</Label>
        <Input placeholder="Nhập tên đăng nhập của bạn" id="username" name="username" type="text" />
      </div>
      <div className="mx-auto space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <CustomInput placeholder="Nhập mật khẩu của bạn" id="password" name="password" type="password" />
      </div>
      <MainButton type="submit" className="w-full p-3 rounded-3xl" text="Đăng ký" disabled={isLoading || !isOtpSent} />
      {/* <p className="text-sm text-center text-[#8E8E93]">Hoặc</p> */}
      {/* <Button type="submit" variant="secondary" className="w-full p-3 rounded-3xl gap-2">
        <GoogleIcon />
        Đăng nhập bằng Google
      </Button>
      <Button type="submit" variant="secondary" className="w-full p-3 rounded-3xl gap-2">
        <FacebookIcon />
        Đăng nhập bằng Facebook
      </Button> */}
    </form>
  )
}

export { RegisterForm }
