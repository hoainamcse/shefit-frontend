import { ModeToggle } from '@/components/mode-toggle'
import { UserNav } from '@/components/admin-panel/user-nav'
import { SheetMenu } from '@/components/admin-panel/sheet-menu'

interface NavbarProps {
  title: string
  leftSection?: React.ReactNode
  rightSection?: React.ReactNode
}

export function Navbar({ title, leftSection, rightSection }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          {leftSection}
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          {rightSection}
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
