import Link from "next/link";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ExerciseYogaIconGray } from "@/components/icons/ExerciseYogaIconGray";
import { FoodGrainsIconGray } from "@/components/icons/FoodGrainsIconGray";
import { GymIconGray } from "@/components/icons/GymIconGray";
import { StarIconGray } from "@/components/icons/StarIconGray";
import { AccountIconGray } from "@/components/icons/AccountIconGray";
import { getConfiguration } from "@/network/server/configurations";
import {
  SectionOne,
  SectionTwo,
  SectionThree,
  SectionFour,
  SectionSix,
  SectionSeven,
  SectionEight,
  SectionNine,
  SectionTen,
  SectionEleven,
} from "./_components/section.server";
import { SectionFive } from "./_components/section.client";

const homepageID = 3;

export default async function HomePage() {
  const data = await getConfiguration(homepageID);

  const {
    section_1,
    section_2,
    section_3,
    section_4,
    section_5,
    section_7,
    section_8,
    section_9,
    section_10,
    section_11,
  } = data.data.data;

  return (
    <div>
      <Header />
      <SectionOne data={section_1} />
      <SectionTwo data={section_2} />
      <SectionThree data={section_3} />
      <SectionFour data={section_4} />
      <SectionFive data={section_5} />
      <SectionSix />
      <SectionSeven data={section_7} />
      <SectionEight data={section_8} />
      <SectionNine data={section_9} />
      <SectionTen data={section_10} />
      <SectionEleven data={section_11} />
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
        <Link href="/meal-plans">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <FoodGrainsIconGray />
            <p>Thực đơn</p>
          </div>
        </Link>
        <Link href="/products">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <GymIconGray />
            <p>Sản phẩm</p>
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
