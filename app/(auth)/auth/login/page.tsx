import { Suspense } from 'react'
import { LoginForm } from '@/components/forms/login-form'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <Suspense fallback={<p>Đang tải...</p>}>
      <LoginForm searchParams={searchParams} />
    </Suspense>
  )
}
