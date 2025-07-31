import Link from 'next/link'
import { BodyIcon } from '@/components/icons/BodyIcon'
import { CartIcon } from '@/components/icons/cart-icon'
import { PackageBoxIcon } from '@/components/icons/package-box-icon'
import { ProfileCardIcon } from '@/components/icons/profile-card-icon'
import { QuizIcon } from '@/components/icons/quiz-icon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BodyQuiz from './_components/body-quiz'
import PurchasePackage from './_components/purchase-package'
import AccountInformation from './_components/account-information'
import Cart from './_components/cart'
import UserGreeting from './_components/user-greeting'
import Exercise from './exercise/page'
const TABS = [
  { value: 'body-quiz', label: 'Body Quiz', icon: <QuizIcon /> },
  {
    value: 'shape',
    label: 'Độ dáng',
    icon: <BodyIcon size={20} />,
  },
  {
    value: 'buy-package',
    label: 'Gói Member',
    icon: <PackageBoxIcon />,
    color: '#FF7873',
    fontWeight: 'bold',
  },
  { value: 'cart', label: 'Giỏ hàng', icon: <CartIcon />, color: '#FF7873' },
  {
    value: 'account-information',
    label: 'Thông tin tài khoản',
    icon: <ProfileCardIcon />,
  },
]

export default async function Account(props: { searchParams: Promise<{ tab: string }> }) {
  const searchParams = await props.searchParams
  const tab = searchParams.tab || 'body-quiz'

  return (
    <div className="lg:mt-8 mt-6">
      <Tabs value={tab} defaultValue="body-quiz">
        <div className="lg:pt-8 px-4 lg:px-[56px] pb-8 lg:pb-[80px]">
          <UserGreeting />
          <TabsList className="w-full lg:w-fit flex-wrap bg-background gap-y-3 sm:gap-y-5 lg:gap-x-7 pl-0 h-fit lg:h-9">
            {TABS.map((tabItem) => (
              <TabsTrigger
                value={tabItem.value}
                className={`h-10 gap-[5px] ${tabItem.color ? `text-[${tabItem.color}]` : ''} ${
                  tabItem.fontWeight === 'bold' ? 'font-bold' : ''
                } data-[state=active]:border border-solid border-[#FFAEB0] data-[state=active]:shadow-none data-[state=active]:text-[#FFAEB0] px-2.5 sm:px-3.5 xl:px-[18px]`}
                key={tabItem.value}
                asChild
              >
                <Link href={`?tab=${tabItem.value}`}>
                  {tabItem.icon}
                  <span className="pt-1 text-sm sm:text-lg">{tabItem.label}</span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="body-quiz">
          <BodyQuiz />
        </TabsContent>
        <TabsContent value="shape">
          <Exercise />
        </TabsContent>
        <TabsContent value="buy-package">
          <PurchasePackage />
        </TabsContent>
        <TabsContent value="cart">
          <Cart />
        </TabsContent>
        <TabsContent value="account-information">
          <AccountInformation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
