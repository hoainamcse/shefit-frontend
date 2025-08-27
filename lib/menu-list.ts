import {
  Settings,
  LayoutGrid,
  LucideIcon,
  HandPlatterIcon,
  BookTextIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ChartPieIcon,
  RssIcon,
  Brain,
  User2Icon,
  HomeIcon,
  Images,
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
          href: '/admin',
          label: 'Dashboard',
          icon: HomeIcon,
        },
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
              href: '/admin/policy',
              label: 'Chính sách',
            },
            {
              href: '/admin/business-vip',
              label: 'Doanh nghiệp & VIP',
            },
          ],
        },
        {
          href: '/admin/ai-hub',
          label: 'AI Hub',
          icon: Brain,
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
              href: '/admin/courses?course_format=video',
              label: 'Khoá tập video',
            },
            {
              href: '/admin/courses?course_format=live',
              label: 'Khoá tập Zoom',
            },
            {
              href: '/admin/courses?is_one_on_one=true',
              label: 'Khoá tập 1:1',
            },
            {
              href: '/admin/exercises',
              label: 'Thư viện động tác',
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
              label: 'Danh sách quiz',
            },
            {
              href: '/admin/users/quizzes',
              label: 'Kết quả quiz',
            },
            {
              href: '/admin/auto-meal',
              label: 'Tự động thực đơn',
            },
          ],
        },
        {
          href: '/admin/subscriptions',
          label: 'Gói tập',
          icon: CreditCardIcon,
        },
        {
          href: '',
          label: 'Bài viết',
          icon: RssIcon,
          submenus: [
            { href: '/admin/blogs', label: 'Danh sách' },
            { href: '/admin/topics', label: 'Chủ đề' },
          ],
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
        {
          href: '/admin/users',
          label: 'Tài khoản',
          icon: Settings,
        },
        {
          href: '/admin/images',
          label: 'Hình ảnh',
          icon: Images,
        },
      ],
    },
  ]
}
