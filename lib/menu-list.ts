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
              href: '/admin/video-classes',
              label: 'Khoá học Video',
            },
            {
              href: '/admin/live-classes',
              label: 'Khoá học Zoom',
            },
            {
              href: '#',
              label: 'Khoá học 1-on-1',
            },
            {
              href: '/admin/exercises',
              label: 'Thư viện bài tập',
            },
            {
              href: '/admin/muscle-groups-and-equipments',
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
          href: '',
          label: 'E-commerce',
          icon: ShoppingBagIcon,
          submenus: [
            {
              href: '#',
              label: 'Phân loại',
            },
            {
              href: '#',
              label: 'Sản phẩm',
            },
            {
              href: '#',
              label: 'Đơn hàng',
            },
          ],
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
