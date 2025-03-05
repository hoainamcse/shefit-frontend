import {
  Users,
  Settings,
  LayoutGrid,
  LucideIcon,
  HandPlatterIcon,
  BookTextIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ChartPieIcon,
  RssIcon,
} from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active?: boolean
}

type Menu = {
  href: string
  label: string
  active?: boolean
  icon: LucideIcon
  submenus?: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '#',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          href: '',
          label: 'Khoá học',
          icon: BookTextIcon,
          submenus: [
            {
              href: '/admin/video-courses',
              label: 'Khoá học Video',
            },
            {
              href: '#',
              label: 'Khoá học Zoom',
            },
            {
              href: '#',
              label: 'Khoá học 1-on-1',
            },
            {
              href: '#',
              label: 'Thư viện bài tập',
            },
            {
              href: '#',
              label: 'Nhóm cơ & dụng cụ',
            },
          ],
        },
        {
          href: '',
          label: 'Thực đơn',
          icon: HandPlatterIcon,
          submenus: [
            {
              href: '#',
              label: 'Danh sách thực đơn',
            },
            {
              href: '#',
              label: 'Thư viện món ăn',
            },
          ],
        },
        {
          href: '#',
          label: 'E-commerce',
          icon: ShoppingBagIcon,
        },
        {
          href: '',
          label: 'Body quiz',
          icon: ChartPieIcon,
          submenus: [
            {
              href: '#',
              label: 'Tạo quiz',
            },
            {
              href: '#',
              label: 'User data',
            },
          ],
        },
        {
          href: '#',
          label: 'Membership',
          icon: CreditCardIcon,
        },
        {
          href: '#',
          label: 'Blog',
          icon: RssIcon,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '#',
          label: 'Users',
          icon: Users,
        },
        {
          href: '#',
          label: 'Tài khoản',
          icon: Settings,
        },
      ],
    },
  ]
}
