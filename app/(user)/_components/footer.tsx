import { ZaloIcon } from '@/components/icons/ZaloIcon'
import { YoutubeIcon } from '@/components/icons/YoutubeIcon'
import { FacebookIcon } from '@/components/icons/FacebookIcon'
import Link from 'next/link'
export function Footer() {
  return (
    <div>
      <footer
        className="w-full overflow-hidden max-sm:hidden h-[840px]"
        style={{
          backgroundImage: `url(/footer-image.png)`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative text-white px-28 pt-44">
          <div className="w-full pt-10">
            <img src="/logo-mono-vertical.png" alt="logo-mono-vertical" className="size-[237px] ml-auto mb-20" />
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
              <div className="grid grid-cols-2 max-sm:grid-cols-1">
                <ul className="flex flex-col gap-3">
                  <li className="font-bold text-xl lg:text-3xl">Về Shefit</li>
                  <li className="text-[#E8E5E5] text-base lg:text-xl">
                    <Link href="/policy">Chính sách</Link>
                  </li>
                  <li className="text-[#E8E5E5] text-base lg:text-xl">
                    <Link href="/about">Về chúng tôi</Link>
                  </li>
                </ul>
                <ul className="flex flex-col gap-3">
                  <li className="font-bold text-xl lg:text-3xl uppercase">Fitness for woman</li>
                  <li className="text-[#E8E5E5] text-base lg:text-xl">
                    Độ dáng tại nhà cho phụ nữ với đa dạng các lớp tập live trực tuyến cùng HLV & Giáo Án Video quay
                    sẵn. Mang lại vóc dáng đẹp & sức khỏe vàng, thời gian tập đầy năng lượng & vui tươi. Tiết kiệm thời
                    gian & chi phí.
                  </li>
                </ul>
              </div>
              <div className="w-full flex">
                <ul className="ml-auto flex flex-col gap-3">
                  <li className="font-bold text-xl lg:text-3xl uppercase">Công ty TNHH Shefit Việt Nam</li>
                  <li className="text-[#E8E5E5] text-base lg:text-xl">
                    Văn phòng: Khu The Sun Avenue, An Phú, Quận 2, Thành phố Hồ Chí Minh
                  </li>
                  <li className="text-[#FFEFEF] font-bold text-xl lg:text-4xl whitespace-nowrap overflow-hidden">
                    <span className="text-2xl lg:text-4xl">Hotline: +84 90 693 48 21</span>
                  </li>
                  <li className="text-[#E8E5E5] text-base lg:text-xl">Email: info@thehealthyhouse.vn</li>
                  <div className="flex gap-3">
                    <FacebookIcon />
                  </div>
                </ul>
              </div>
            </div>
            <hr className="mt-5" />
          </div>
        </div>
      </footer>
      <div className="sm:hidden">
        <footer
          className="w-full overflow-hidden"
          style={{
            backgroundImage: `url(/footer-mobile.png)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative text-white px-5 pt-44">
            <div className="w-full pt-10">
              <img src="/logo-mono-vertical.png" alt="logo-mono-vertical" className="size-[237px] ml-auto" />
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                <div className="grid grid-cols-2 max-sm:grid-cols-1">
                  <ul className="flex flex-col gap-3">
                    <li className="font-bold text-xl">Về Shefit</li>
                    <li className="text-[#E8E5E5] text-base">Chính sách</li>
                    <li className="text-[#E8E5E5] text-base">Về chúng tôi</li>
                  </ul>
                  <ul className="flex flex-col gap-3">
                    <li className="font-bold text-xl uppercase">Fitness for woman</li>
                    <li className="text-[#E8E5E5] text-base">
                      Độ dáng tại nhà cho phụ nữ với đa dạng các lớp tập live trực tuyến cùng HLV & Giáo Án Video quay
                      sẵn. Mang lại vóc dáng đẹp & sức khỏe vàng, thời gian tập đầy năng lượng & vui tươi. Tiết kiệm
                      thời gian & chi phí.
                    </li>
                  </ul>
                </div>
                <div className="w-full flex">
                  <ul className="ml-auto flex flex-col gap-3">
                    <li className="font-bold text-xl uppercase">Công ty TNHH Shefit Việt Nam</li>
                    <li className="text-[#E8E5E5] text-base">
                      Văn phòng: Khu The Sun Avenue, An Phú, Quận 2, Thành phố Hồ Chí Minh
                    </li>
                    <li className="text-[#FFEFEF] font-bold text-2xl">Hotline: +84 90 693 48 21</li>
                    <li className="text-[#E8E5E5] text-base">Email: info@shefit.vn</li>
                    <div className="flex gap-3">
                      <FacebookIcon />
                    </div>
                  </ul>
                </div>
              </div>
              <hr className="mt-5" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
