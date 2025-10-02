import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { verifySession } from '@/lib/dal'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await verifySession()

  if (session) {
    if (session.role === 'admin' || session.role === 'sub_admin') {
      return redirect('/admin')
    }
    return redirect('/account')
  }

  return (
    <div className="h-screen grid grid-cols-1 sm:grid-cols-7 overflow-auto">
      <div className="sm:col-span-4 sm:h-full h-64 overflow-clip relative bg-[url(/auth-background.jpg)] bg-cover bg-center">
        <Link href="/">
          <Image
            src="/logo-mono-horizontal.png"
            alt="logo-mono-horizontal"
            width={136}
            height={40}
            className="absolute top-4 left-4"
          />
        </Link>
      </div>
      <div className="sm:col-span-3 p-4 sm:p-10">{children}</div>
    </div>
  )
}
