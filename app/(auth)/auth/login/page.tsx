import { Suspense } from 'react'
import { LoginForm } from '@/components/forms/login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Đang tải...</p>}>
      <LoginForm />
    </Suspense>
  )
}
