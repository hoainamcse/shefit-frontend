import { ZaloIcon } from '@/components/icons/ZaloIcon'
import { YoutubeIcon } from '@/components/icons/YoutubeIcon'
import { FacebookIcon } from '@/components/icons/FacebookIcon'
import Link from 'next/link'
import Script from 'next/script'

export function Footer() {
  return (
    <div>
      <Script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v17.0"
        nonce="random123"
      />

      <footer
        className="w-full overflow-hidden max-sm:hidden h-[840px]"
        style={{
          backgroundImage: `url(/footer-image.png)`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative text-white px-4 lg:px-8 xl:px-28 pt-44">
          <div className="w-full pt-10">
            <img src="/logo-mono-vertical.png" alt="logo-mono-vertical" className="size-[237px] ml-auto mb-20" />
            <div className="grid grid-cols-7 gap-4">
              <ul className="flex flex-col gap-3">
                <li className="font-bold text-lg lg:text-2xl font-[family-name:var(--font-roboto)]">Về Shefit</li>
                <li className="text-[#E8E5E5] text-sm lg:text-lg">
                  <Link href="/policy" className="hover:underline">
                    Chính sách
                  </Link>
                </li>
                <li className="text-[#E8E5E5] text-sm lg:text-lg">
                  <Link href="/about" className="hover:underline">
                    Về chúng tôi
                  </Link>
                </li>
                <li className="text-[#E8E5E5] text-sm lg:text-lg">
                  <Link href="/coaches" className="hover:underline">
                    Team HLV
                  </Link>
                </li>
                <li className="text-[#E8E5E5] text-sm lg:text-lg">
                  <Link href="/blogs" className="hover:underline">
                    Blog Healthy
                  </Link>
                </li>
              </ul>
              <ul className="flex flex-col gap-3 col-span-2">
                <li className="font-bold text-lg lg:text-xl uppercase font-[family-name:var(--font-roboto)]">
                  Fitness for woman
                </li>
                <li className="text-[#E8E5E5] text-sm lg:text-lg">
                  Độ dáng tại nhà cho phụ nữ với đa dạng các lớp tập live trực tuyến cùng HLV & Giáo Án Video quay sẵn.
                  Mang lại vóc dáng đẹp & sức khỏe vàng, thời gian tập đầy năng lượng & vui tươi. Tiết kiệm thời gian &
                  chi phí.
                </li>
              </ul>
              <div className="w-full flex col-span-2">
                <ul className="ml-auto flex flex-col gap-3">
                  <li className="font-bold text-lg lg:text-xl uppercase font-[family-name:var(--font-roboto)]">
                    Công ty TNHH Shefit Việt Nam
                  </li>
                  <li className="text-[#E8E5E5] text-sm lg:text-lg">
                    Văn phòng: Khu The Sun Avenue, An Phú, Quận 2, Thành phố Hồ Chí Minh
                  </li>
                  <li className="text-[#FFEFEF] font-bold text-lg lg:text-3xl whitespace-nowrap overflow-hidden">
                    <span className="text-xl lg:text-2xl">Hotline: +84 90 693 48 21</span>
                  </li>
                  <li className="text-[#E8E5E5] text-xs lg:text-base">Email: info@thehealthyhouse.vn</li>
                  <div className="flex gap-3">
                    <Link href="https://www.facebook.com/shefitvn" target="_blank">
                      <FacebookIcon />
                    </Link>
                  </div>
                </ul>
              </div>
              <div
                className="fb-page col-span-2"
                data-href="https://www.facebook.com/shefitvn"
                // data-tabs="timeline"
                data-width=""
                data-height=""
                data-small-header="false"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
              >
                <blockquote cite="https://www.facebook.com/shefitvn" className="fb-xfbml-parse-ignore">
                  <a href="https://www.facebook.com/shefitvn">Shefit.vn</a>
                </blockquote>
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
              <img src="/logo-mono-vertical.png" alt="logo-mono-vertical" className="size-[146px] ml-auto" />
              <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4">
                <div className="grid grid-cols-2 max-sm:grid-cols-1">
                  <ul className="flex flex-col gap-3 mb-2">
                    <li className="font-bold text-lg font-[family-name:var(--font-roboto)]">Về Shefit</li>
                    <div className="grid grid-cols-2 gap-3">
                      <li className="text-[#E8E5E5] text-sm">
                        <Link href="/policy">Chính sách</Link>
                      </li>
                      <li className="text-[#E8E5E5] text-sm">
                        <Link href="/coaches">Team HLV</Link>
                      </li>
                      <li className="text-[#E8E5E5] text-sm">
                        <Link href="/about">Về chúng tôi</Link>
                      </li>
                      <li className="text-[#E8E5E5] text-sm">
                        <Link href="/blogs">Blog Healthy</Link>
                      </li>
                    </div>
                  </ul>
                  <ul className="flex flex-col gap-3">
                    <li className="font-bold text-lg uppercase font-[family-name:var(--font-roboto)]">
                      Fitness for woman
                    </li>
                    <li className="text-[#E8E5E5] text-sm">
                      Độ dáng tại nhà cho phụ nữ với đa dạng các lớp tập live trực tuyến cùng HLV & Giáo Án Video quay
                      sẵn. Mang lại vóc dáng đẹp & sức khỏe vàng, thời gian tập đầy năng lượng & vui tươi. Tiết kiệm
                      thời gian & chi phí.
                    </li>
                  </ul>
                </div>
                <div className="w-full flex">
                  <ul className="ml-auto flex flex-col gap-3">
                    <li className="font-bold text-lg uppercase font-[family-name:var(--font-roboto)]">
                      Công ty TNHH Shefit Việt Nam
                    </li>
                    <li className="text-[#E8E5E5] text-sm">
                      Văn phòng: Khu The Sun Avenue, An Phú, Quận 2, Thành phố Hồ Chí Minh
                    </li>
                    <li className="text-[#FFEFEF] font-bold text-xl">Hotline: +84 90 693 48 21</li>
                    <li className="text-[#E8E5E5] text-sm">Email: info@shefit.vn</li>
                    <div className="flex gap-3">
                      <Link href="https://www.facebook.com/shefitvn" target="_blank">
                        <FacebookIcon />
                      </Link>
                    </div>
                  </ul>
                </div>
                <div
                  className="fb-page"
                  data-href="https://www.facebook.com/shefitvn"
                  // data-tabs="timeline"
                  data-width=""
                  data-height=""
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite="https://www.facebook.com/shefitvn" className="fb-xfbml-parse-ignore">
                    <a href="https://www.facebook.com/shefitvn">Shefit.vn</a>
                  </blockquote>
                </div>
              </div>
              <hr className="mt-5 mb-3" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
