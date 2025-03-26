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
              href: '/admin/one-on-one-classes',
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
              href: '/admin/meal-plans',
              label: 'Danh sách thực đơn',
            },
            {
              href: '/admin/dishes',
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
              href: '/admin/categories',
              label: 'Phân loại',
            },
            {
              href: '/admin/products',
              label: 'Sản phẩm',
            },
            {
              href: '/admin/orders',
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
              href: '/admin/quizzes',
              label: 'Tạo quiz',
            },
            {
              href: '/admin/quizzes/results',
              label: 'Kết quả quiz',
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
