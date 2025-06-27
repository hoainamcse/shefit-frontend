import { Header } from "@/app/(user)/_components/header";
import { Footer } from "@/app/(user)/_components/footer";
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
import { BottomNavbar } from "./_components/bottom-navbar";

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
      {/* <BottomNavbar /> */}
    </div>
  );
}

