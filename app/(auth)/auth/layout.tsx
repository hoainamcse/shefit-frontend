import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
