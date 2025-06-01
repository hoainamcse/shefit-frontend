import { PropsWithChildren } from "react"
import { Header } from "@/app/(user)/_components/header"
import { cn } from "@/lib/utils"
import { Footer } from "@/app/(user)/_components/footer"

interface LayoutProps extends PropsWithChildren {
  withFooter?: boolean
  className?: string
}

export default function Layout({ children, withFooter, className }: LayoutProps) {
  return (
    <>
      <Header />
      <div className={cn("p-4", className)}>{children}</div>
      <Footer />
    </>
  )
}
