import Link from "next/link";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { data } from "./data";
import { ExerciseYogaIconGray } from "@/components/icons/ExerciseYogaIconGray";
import { FoodGrainsIconGray } from "@/components/icons/FoodGrainsIconGray";
import { GymIconGray } from "@/components/icons/GymIconGray";
import { StarIconGray } from "@/components/icons/StarIconGray";
import { AccountIconGray } from "@/components/icons/AccountIconGray";
import { HomeSection } from "./section";

export default function HomePage() {
  // Todo: Need to get data from API

  return (
    <div className="relative">
      <Header />
      <HomeSection data={data} />
      <Footer />
      <BottomNavbar />
    </div>
  );
}

function BottomNavbar() {
  return (
    <div className="bg-background sticky bottom-0 inset-x-0 z-50 lg:hidden">
      <div className="grid grid-cols-5 py-2">
        <Link href="/courses">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <ExerciseYogaIconGray />
            <p>Khóa tập</p>
          </div>
        </Link>
        <Link href="/menu">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <FoodGrainsIconGray />
            <p>Thực đơn</p>
          </div>
        </Link>
        <Link href="/equipment">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <GymIconGray />
            <p>Dụng cụ</p>
          </div>
        </Link>
        <Link href="#">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <StarIconGray />
            <p>HLV 24/7</p>
          </div>
        </Link>
        <Link href="/account">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <AccountIconGray />
            <p>Tài khoản</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
