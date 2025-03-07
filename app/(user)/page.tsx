import Header from "@/components/common/Header"
import Title from "@/components/landing-page/ShefitTitle"
import Intro from "@/components/landing-page/ShefitIntro"
import Route from "@/components/landing-page/ShefitRoute"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Body from "@/components/landing-page/ShefitBody"
import Menu from "@/components/landing-page/ShefitMenu"
import Stand from "@/components/landing-page/ShefitStand"
import Educator from "@/components/landing-page/ShefitEducator"
import Hit from "@/assets/image/Hit.png"
import HiitHome from "@/assets/image/HiitHome.png"
import Image from "next/image"
import ComunityImage from "@/assets/image/Comunity.png"
import { ZaloIcon } from "@/components/icons/ZaloIcon"
import { FacebookIcon } from "@/components/icons/FacebookIcon"
import { YoutubeIcon } from "@/components/icons/YoutubeIcon"

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <Title />
      <Intro />
      <Route />
      <div className="xl:px-14 max-lg:px-2 bg-white">
        <Card className="bg-primary rounded-[20px] text-white my-36 py-16 max-lg:py-4">
          <div className="mx-auto text-center xl:w-full max-lg:w-60">
            <div className="items-center xl:text-[40px] max-lg:text-base leading-[45px] text-center font-bold text-wrap mb-8 mt-4">
              Chị đã muốn độ dáng với lộ trình<br></br> <span className="text-[#57ECC8]">“Tone Body”</span> trọn vẹn
              chưa?
            </div>
            <div className="xl:text-2xl max-lg:text-xs">Ăn đúng, tập chuẩn sớm, đẹp sớm!</div>
            <Button className="bg-button hover:bg-[#11c296] flex p-4 mt-6 text-xl mx-auto justify-center rounded-[100px] xl:w-[696px] max-lg:w-full max-lg:h-8 max-lg:text-[14px]">
              Bắt đầu
            </Button>
          </div>
        </Card>
      </div>
      <Body />
      <div className="xl:px-14 max-lg:px-2 max-lg:w-full bg-white">
        <Card className="bg-primary rounded-[20px] text-white xl:my-36 flex flex-col xl:py-16">
          <div className="mx-auto text-center w-full">
            <div className="items-center text-[40px] max-lg:text-[22px] leading-[45px] text-center font-bold text-wrap xl:mb-8 xl:mt-4">
              Bạn không biết mình thuộc loại phom <br></br> dáng nào?
            </div>
            <Button className="bg-button hover:bg-[#11c296] flex p-4 xl:mt-6 text-xl mx-auto justify-center rounded-[100px] xl:w-[696px] max-lg:w-full">
              Phân tích phom dáng
            </Button>
          </div>
        </Card>
      </div>
      <Menu />
      <Stand />
      <Educator />
      <div className="mt-60 bg-white">
        <div className="relative w-full">
          <Image src={Hit} alt="Picture of the author" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white xl:w-[1240px] max-lg:w-full">
            <div className="max-md:text-base max-lg:text-2xl text-[40px] leading-[47px]">Can i do hiit at home?</div>
            <div className="text-2xl mt-10 max-md:text-sm max-lg:text-base max-lg:mt-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book.
            </div>
          </div>
        </div>
        <div className="xl:-mt-40 max-lg:-mt-16 max-md:-mt-16 max-sm:-mt-11 relative w-full">
          <Image src={HiitHome} alt="Picture of the author" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-[1240px] max-lg:w-full">
            <div className="max-md:text-base max-lg:text-2xl text-[40px] leading-[47px]">Can i do hiit at home?</div>
            <div className="text-2xl mt-10 max-md:text-sm max-lg:text-base max-lg:mt-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-40">
        <div className="text-[40px] max-lg:text-[30px] leading-[47px] text-center font-bold text-wrap mb-8 mt-4 text-[#212121]">
          Cộng đồng&nbsp;
          <span className="text-text">
            Shefit
            <br />
          </span>
          Nơi chia sẻ hành trình độ dáng <br /> của bạn
        </div>
        <Image src={ComunityImage} alt="Picture of the author" width={1526} height={763} />
        <div className="text-[#8E8E93] text-[20px] max-lg:text-base mt-8 text-center font-normal">
          Tham gia facebook của SHEFIT để cập nhật bài tập, thực đơn và hành trình truyền cảm hứng từ hàng ngàn học viên
        </div>
        <div className="flex mt-8 gap-5">
          <ZaloIcon />
          <FacebookIcon />
          <YoutubeIcon />
        </div>
        <Button className="bg-button hover:bg-[#11c296] w-[444px] max-lg:w-[139px] h-[68px] max-lg:h-[40px] rounded-[98px] text-xl max-lg:text-base mt-8 mb-8">
          Tham gia ngay!
        </Button>
      </div>
    </div>
  )
}
