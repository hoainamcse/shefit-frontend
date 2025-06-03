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
  Dumbbell,
  User2Icon,
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
          label: 'Content Input',
          icon: LayoutGrid,
          submenus: [
            {
              href: '/admin/homepage',
              label: 'Trang chủ',
            },
            {
              href: '/admin/about-us',
              label: 'Về chúng tôi',
            },
            {
              href: '#',
              label: 'Chính sách',
            }
          ],
        },
      ],
    },
    {
      groupLabel: 'Quản lý',
      menus: [
        {
          href: '',
          label: 'Khoá tập',
          icon: BookTextIcon,
          submenus: [
            {
              href: '/admin/video-classes',
              label: 'Khoá tập Video',
            },
            {
              href: '/admin/live-classes',
              label: 'Khoá tập Zoom',
            },
            {
              href: '/admin/one-on-one-classes',
              label: 'Khoá tập 1-on-1',
            },
            {
              href: '/admin/exercises',
              label: 'Thư viện bài tập',
            },
            {
              href: '/admin/muscle-groups-equipments',
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
            {
              href: '/admin/diets-calories',
              label: 'Chế độ ăn & calories',
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
              label: 'Danh sách khảo sát',
            },
            {
              href: '/admin/quizzes/results',
              label: 'Kết quả khảo sát',
            },
          ],
        },
        {
          href: '/admin/membership',
          label: 'Membership',
          icon: CreditCardIcon,
        },
        {
          href: '/admin/blog',
          label: 'Bài viết',
          icon: RssIcon,
        },
        {
          href: '/admin/coaches',
          label: 'Huấn luyện viên',
          icon: User2Icon,
        },
      ],
    },
    {
      groupLabel: 'Chung',
      menus: [
        // {
        //   href: '#',
        //   label: 'Users',
        //   icon: Users,
        // },
        {
          href: '/admin/account',
          label: 'Tài khoản',
          icon: Settings,
        },
      ],
    },
  ]
}
