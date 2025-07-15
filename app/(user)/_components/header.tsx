"use client"

import Image from "next/image"
import { MainButton } from "@/components/buttons/main-button"
import Link from "next/link"
import { ExerciseYogaIcon } from "@/components/icons/ExerciseYogaIcon"
import { FoodGrainsIcon } from "@/components/icons/FoodGrainsIcon"
import { GymIcon } from "@/components/icons/GymIcon"
import { FitnessLineIcon } from "@/components/icons/FitnessLineIcon"
import { BookIcon } from "@/components/icons/BookIcon"
import { AboutIcon } from "@/components/icons/AboutIcon"
import { AccountIcon } from "@/components/icons/AccountIcon"
import { MenuIcon } from "@/components/icons/MenuIcon"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { GalleryIcon } from "@/components/icons/GalleryIcon"
import { MemberShipIcon } from "@/components/icons/MemberShipIcon"
import { FacebookIcon } from "@/components/icons/FacebookIcon"
import { useSession } from "@/hooks/use-session"
import { signOut } from "@/network/server/auth"

export function Header() {
  const { session } = useSession()

  const authButton = session ? (
    <MainButton onClick={signOut} className="rounded-full w-32 md:w-36 lg:w-40 xl:w-44" text="Đăng xuất" variant="secondary" />
  ) : (
    <Link href="/auth/login">
      <MainButton className="rounded-full w-32 md:w-36 lg:w-40 xl:w-44" text="Đăng nhập" />
    </Link>
  )

  const navItems = [
    {
      label: "Gói Member",
      icon: MemberShipIcon,
      url: "/account?tab=buy-package",
    },
    {
      label: "Khoá tập",
      icon: ExerciseYogaIcon,
      url: "/courses",
    },
    {
      label: "Thực đơn",
      icon: FoodGrainsIcon,
      url: "/meal-plans",
    },
    {
      label: "Sản phẩm",
      icon: GymIcon,
      url: "/products",
    },
    {
      label: "Team HLV",
      icon: FitnessLineIcon,
      url: "/coaches",
    },
    {
      label: "Về Shefit",
      icon: AboutIcon,
      url: "/about",
    },
    {
      label: "Blog healthy",
      icon: BookIcon,
      url: "/blog",
    },
    {
      label: "Thư viện",
      icon: GalleryIcon,
      url: "/gallery",
    },
    {
      label: "Tài khoản",
      icon: AccountIcon,
      url: "/account",
    },
  ]

  return (
    <header className="bg-ring sticky top-0 inset-x-0 z-50">
      <div className="mx-auto flex justify-between items-center p-3 lg:px-16">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo-mono-horizontal.png" alt="logo-mono-horizontal" width={136} height={40} />
        </Link>
        <div className="justify-center items-center gap-2 xl:gap-6 text-background hidden lg:flex">
          {navItems.map((item, index) =>
            item.label === "Gói Member" ? (
              <button
                key={`navItem-${index}`}
                onClick={() => (window.location.href = item.url)}
                className="flex flex-col items-center gap-1 bg-transparent border-none text-white cursor-pointer whitespace-nowrap text-xs md:text-sm lg:text-base xl:text-lg"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center">
                  <item.icon />
                </div>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ) : (
              <Link key={`navItem-${index}`} href={item.url} className="flex flex-col items-center gap-1">
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center">
                  <item.icon />
                </div>
                <span className="whitespace-nowrap text-xs md:text-sm lg:text-base xl:text-lg">{item.label}</span>
              </Link>
            )
          )}
          {authButton}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="lg:hidden">
              <MenuIcon />
            </button>
          </SheetTrigger>
          <SheetContent className="max-w-sm">
            <SheetHeader>
              <SheetTitle className="text-ring uppercase text-xl font-bold">Menu</SheetTitle>
              <SheetDescription />
            </SheetHeader>
            <div>
              {navItems.map((item, index) =>
                item.label === "Gói Member" ? (
                  <button
                    key={`navItem-${index}`}
                    onClick={() => (window.location.href = item.url)}
                    className="flex items-center gap-1 mb-3 bg-transparent border-none text-foreground cursor-pointer w-full text-left"
                  >
                    <item.icon />
                    {item.label}
                  </button>
                ) : (
                  <Link key={`navItem-${index}`} href={item.url} className="flex items-center gap-1 mb-3">
                    <item.icon />
                    {item.label}
                  </Link>
                )
              )}
            </div>
            <div className="flex flex-col items-center gap-8 absolute bottom-10 left-1/2 -translate-x-1/2">
              <SheetFooter className="mt-6">{authButton}</SheetFooter>
              <FacebookIcon />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
