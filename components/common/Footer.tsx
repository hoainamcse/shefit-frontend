import Image from "next/image"
import FooterImage from "@/assets/image/FooterImage.png"
import FooterImageMobile from "@/assets/image/FooterMobile.png"
import Logo from "@/assets/image/Logo.png"
import { ZaloIcon } from "../icons/ZaloIcon"
import { YoutubeIcon } from "../icons/YoutubeIcon"
import { FacebookIcon } from "../icons/FacebookIcon"
import Navigation from "./Navigation"
import Link from "next/link"
export default function Footer() {
  return (
    <div>
      <footer
        className="w-full overflow-hidden max-sm:hidden"
        style={{
          backgroundImage: `url(${FooterImage.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="relative text-white px-10 pt-44">
          <div className="w-full pt-10">
            <Image src={Logo} alt="Logo" className="size-[237px] ml-auto" />
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
              <div className="grid grid-cols-2 max-sm:grid-cols-1">
                <ul className="flex flex-col gap-3">
                  <li className="font-bold text-3xl">Về Shefit</li>
                  <li className="text-[#E8E5E5] text-xl">
                    <Link href="/policy">Chính sách</Link>
                  </li>
                  <li className="text-[#E8E5E5] text-xl">
                    <Link href="/about">Về chúng tôi</Link>
                  </li>
                  <li className="text-[#E8E5E5] text-xl">Tuyển dụng</li>
                </ul>
                <ul className="flex flex-col gap-3">
                  <li className="font-bold text-3xl">Fitness for woman</li>
                  <li className="text-[#E8E5E5] text-xl">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book.
                  </li>
                </ul>
              </div>
              <div className="w-full flex">
                <ul className="ml-auto flex flex-col gap-3">
                  <li className="font-bold text-3xl">Công ty TNHH ngôi nhà đầu bếp</li>
                  <li className="text-[#E8E5E5] text-xl">
                    Văn phòng: 19A Mai Thị Lựu, Phường Đa Kao, Quận 1, Thành phố Hồ Chí Minh
                  </li>
                  <li className="text-[#FFEFEF] font-bold text-[60px]">Hotline: 1800646471</li>
                  <li className="text-[#E8E5E5] text-xl">Email: info@thehealthyhouse.vn</li>
                  <div className="flex gap-3">
                    <ZaloIcon />
                    <FacebookIcon />
                    <YoutubeIcon />
                  </div>
                </ul>
              </div>
            </div>
            <hr className="mt-5" />
            <p className="text-[#E8E5E5] text-xl mt-5">© Ngôi nhà đầu bếp 2024</p>
          </div>
        </div>
      </footer>
      <div className="sm:hidden">
        <footer
          className="w-full overflow-hidden"
          style={{
            backgroundImage: `url(${FooterImageMobile.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="relative text-white px-5 pt-44">
            <div className="w-full pt-10">
              <Image src={Logo} alt="Logo" className="size-[237px] ml-auto" />
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                <div className="grid grid-cols-2 max-sm:grid-cols-1">
                  <ul className="flex flex-col gap-3">
                    <li className="font-bold text-xl">Về Shefit</li>
                    <li className="text-[#E8E5E5] text-base">Chính sách</li>
                    <li className="text-[#E8E5E5] text-base">Về chúng tôi</li>
                    <li className="text-[#E8E5E5] text-base">Tuyển dụng</li>
                  </ul>
                  <ul className="flex flex-col gap-3">
                    <li className="font-bold text-xl">Fitness for woman</li>
                    <li className="text-[#E8E5E5] text-base">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                      type and scrambled it to make a type specimen book.
                    </li>
                  </ul>
                </div>
                <div className="w-full flex">
                  <ul className="ml-auto flex flex-col gap-3">
                    <li className="font-bold text-xl">Công ty TNHH ngôi nhà đầu bếp</li>
                    <li className="text-[#E8E5E5] text-base">
                      Văn phòng: 19A Mai Thị Lựu, Phường Đa Kao, Quận 1, Thành phố Hồ Chí Minh
                    </li>
                    <li className="text-[#FFEFEF] font-bold text-[40px]">Hotline: 1800646471</li>
                    <li className="text-[#E8E5E5] text-base">Email: info@thehealthyhouse.vn</li>
                    <div className="flex gap-3">
                      <ZaloIcon />
                      <YoutubeIcon />
                      <FacebookIcon />
                    </div>
                  </ul>
                </div>
              </div>
              <hr className="mt-5" />
              <p className="text-[#E8E5E5] text-xl mt-5">© Ngôi nhà đầu bếp 2024</p>
            </div>
          </div>
        </footer>
        <Navigation />
      </div>
    </div>
  )
}
