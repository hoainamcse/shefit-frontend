'use client'

import Link from 'next/link'
import { Ellipsis } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { getMenuList } from '@/lib/menu-list'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { CollapseMenuButton } from '@/components/admin-panel/collapse-menu-button'

import { useSession } from '@/hooks/use-session'
import { Spinner } from '../spinner'

interface MenuProps {
  isOpen: boolean | undefined
}

export function Menu({ isOpen }: MenuProps) {
  const { session, isLoading } = useSession()
  const pathname = usePathname()
  const menuList = getMenuList(pathname || '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  // Define restricted menu items for non-admin users
  const restrictedMenuItems = ['Blog', 'E-commerce', 'Content Input', 'Body quiz', 'Bài viết', 'Huấn luyện viên']

  const visibleMenuList = menuList.map(({ groupLabel, menus }) => ({
    groupLabel,
    menus: menus.filter((item) => session?.role === 'admin' || !restrictedMenuItems.includes(item.label)),
  }))

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {visibleMenuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div className="w-full flex justify-center items-center">
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{groupLabel}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
                !submenus || submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <Tooltip disableHoverableContent>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            (active === undefined && pathname?.startsWith(href)) || active ? 'secondary' : 'ghost'
                          }
                          className="w-full justify-start h-10 mb-1"
                          asChild
                        >
                          <Link href={href}>
                            <span className={cn(isOpen === false ? '' : 'mr-4')}>
                              <Icon size={18} />
                            </span>
                            <p
                              className={cn(
                                'max-w-[200px] truncate',
                                isOpen === false ? '-translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
                              )}
                            >
                              {label}
                            </p>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      {isOpen === false && <TooltipContent side="right">{label}</TooltipContent>}
                    </Tooltip>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={active === undefined ? !!pathname?.startsWith(href) : active}
                      submenus={submenus}
                      isOpen={isOpen}
                    />
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  )
}
