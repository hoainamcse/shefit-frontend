'use client'
import { Menu } from '@/components/admin-panel/menu'
import { SidebarToggle } from '@/components/admin-panel/sidebar-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PanelsTopLeft } from 'lucide-react'
import Link from 'next/link'
import { Footer } from './footer'
import { useSidebar } from '@/components/providers/sidebar-provider'

export function Sidebar() {
  const { toggleSidebar, isOpen } = useSidebar()

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        !isOpen ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleSidebar} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-neutral-800">
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            !isOpen ? 'translate-x-1' : 'translate-x-0'
          )}
          variant="link"
          asChild
        >
          <Link href="/admin" className="flex items-center gap-2">
            <PanelsTopLeft className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                !isOpen ? '-translate-x-96 opacity-0 hidden' : 'translate-x-0 opacity-100'
              )}
            >
              Shefit.vn
            </h1>
          </Link>
        </Button>
        <Menu isOpen={isOpen} />
      </div>
    </aside>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <>
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-background/95 dark:bg-neutral-900 transition-[margin-left] ease-in-out duration-300',
          !isOpen ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        {children}
      </main>
      <footer
        className={cn('transition-[margin-left] ease-in-out duration-300', !isOpen ? 'lg:ml-[90px]' : 'lg:ml-72')}
      >
        <Footer />
      </footer>
    </>
  )
}
