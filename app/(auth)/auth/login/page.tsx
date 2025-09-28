import LoginForm from '@/components/forms/login-form'
import { Suspense } from 'react'

export default function Page({
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