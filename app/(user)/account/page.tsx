"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { BodyIcon } from "@/components/icons/BodyIcon";
import { CartIcon } from "@/components/icons/cart-icon";
import { PackageBoxIcon } from "@/components/icons/package-box-icon";
import { ProfileCardIcon } from "@/components/icons/profile-card-icon";
import { QuizIcon } from "@/components/icons/quiz-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BodyQuiz from "./_components/body-quiz";
import PurchasePackage from "./_components/purchase-package";
import AccountInformation from "./_components/account-information";

const TABS = [
  { value: "body-quiz", label: "Body Quiz", icon: <QuizIcon /> },
  {
    value: "shape",
    label: "Độ dáng",
    icon: <BodyIcon size={20} />,
  },
  {
    value: "buy-package",
    label: "Mua gói",
    icon: <PackageBoxIcon />,
    color: "#FF7873",
  },
  { value: "cart", label: "Giỏ hàng", icon: <CartIcon /> },
  {
    value: "account-information",
    label: "Thông tin tài khoản",
    icon: <ProfileCardIcon />,
  },
];

export default function Account() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <div>
      <Tabs defaultValue={tab || "body-quiz"}>
        <div className="pt-16 sm:pt-24 lg:pt-[120px] px-5 sm:px-9 lg:px-[56px] xl:px-[60px] pb-8 sm:pb-14 lg:pb-[80px]">
          <div className="font-[Coiny] text-[#FF7873] text-[30px] sm:text-[40px] leading-[33px] sm:leading-[60px] font-bold mb-8 sm:mb-10 ">
            Xin chào Dale!
          </div>

          <TabsList className="w-full lg:w-fit flex-wrap bg-background gap-y-3 sm:gap-y-5 gap-x-7 pl-0 h-fit lg:h-9">
            {TABS.map((tabItem) => (
              <TabsTrigger
                value={tabItem.value}
                className={`h-10 gap-[5px] ${
                  tabItem.color ? `text-[${tabItem.color}]` : ""
                } data-[state=active]:border border-solid border-[#FFAEB0] data-[state=active]:shadow-none data-[state=active]:text-[#FFAEB0] px-2.5 sm:px-3.5 xl:px-[18px]`}
                key={tabItem.value}
                onClick={() =>
                  router.push(`/account?tab=${tabItem.value}`, {
                    scroll: false,
                  })
                }
              >
                {tabItem.icon}
                <span className="pt-1 text-base sm:text-[20px] sm:leading-[30px]">
                  {tabItem.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="body-quiz">
          <BodyQuiz />
        </TabsContent>
        <TabsContent value="buy-package">
          <PurchasePackage />
        </TabsContent>
        <TabsContent value="account-information">
          <AccountInformation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
