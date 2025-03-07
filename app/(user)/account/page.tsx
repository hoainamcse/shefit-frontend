"use client";

import { BodyIcon } from "@/components/icons/BodyIcon";
import { CartIcon } from "@/components/icons/cart-icon";
import { PackageBoxIcon } from "@/components/icons/package-box-icon";
import { ProfileCardIcon } from "@/components/icons/profile-card-icon";
import { QuizIcon } from "@/components/icons/quiz-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BodyQuiz from "./_components/body-quiz";

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
  return (
    <div>
      <Tabs defaultValue="body-quiz">
        <div className="pt-[120px] px-[60px] pb-[80px]">
          <div className="text-[#FF7873] text-[40px] leading-[60px] font-bold mb-10 ">
            Xin chào Dale!
          </div>

          <TabsList className="bg-background gap-7 pl-0">
            {TABS.map((tabItem) => (
              <TabsTrigger
                value={tabItem.value}
                className={`h-10 gap-[5px] ${
                  tabItem.color ? `text-[${tabItem.color}]` : ""
                } data-[state=active]:border border-solid border-[#FFAEB0] data-[state=active]:shadow-none data-[state=active]:text-[#FFAEB0] px-[18px]`}
                key={tabItem.value}
              >
                {tabItem.icon}
                <span className="pt-1 text-[20px] leading-[30px]">
                  {tabItem.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="body-quiz">
          <BodyQuiz />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
