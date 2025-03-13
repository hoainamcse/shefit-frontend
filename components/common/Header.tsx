import Image from "next/image"
import { Button } from "@/components/ui/button"
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

export default function Header() {
  const navItems = [
    {
      label: "Khoá tập",
      icon: ExerciseYogaIcon,
      url: "/training-courses",
    },
    {
      label: "Thực đơn",
      icon: FoodGrainsIcon,
      url: "/menu",
    },
    {
      label: "Dụng cụ",
      icon: GymIcon,
      url: "/equipment",
    },
    {
      label: "Team HLV",
      icon: FitnessLineIcon,
      url: "/trainers",
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
      label: "Tài khoản",
      icon: AccountIcon,
      url: "/account",
    },
  ]

  const contactButton = <Button className="rounded-2xl bg-button hover:bg-[#11c296]">Liên hệ với chúng tôi</Button>

  return (
    <header className="bg-primary sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center p-3">
        <Link href="/">
          <Image src="/logo-light.png" alt="logo-light" width={136} height={40} />
        </Link>
        <div className="justify-center items-center gap-6 text-background hidden lg:flex">
          {navItems.map((item, index) => (
            <Link key={`navItem-${index}`} href={item.url} className="flex flex-col items-center gap-1">
              <item.icon />
              {item.label}
            </Link>
          ))}
          {contactButton}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="lg:hidden">
              <MenuIcon />
            </button>
          </SheetTrigger>
          <SheetContent className="max-w-sm">
            <SheetHeader>
              <SheetTitle className="text-text uppercase text-xl font-bold">Menu</SheetTitle>
              <SheetDescription />
            </SheetHeader>
            <div>
              {navItems.map((item, index) => (
                <Link key={`navItem-${index}`} href={item.url} className="flex items-center gap-1 mb-3">
                  <item.icon />
                  {item.label}
                </Link>
              ))}
            </div>
            <SheetFooter className="mt-6">{contactButton}</SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
