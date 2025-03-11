"use client";

import Link from "next/link";
import { BackIcon } from "@/components/icons/BackIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PACKAGES } from "./const";

export default function PackagePurchase() {
  return (
    <div className="py-16 px-5 md:py-16 md:px-10 lg:p-[60px]">
      <div className="flex items-center gap-[10px] mb-12 md:mb-16">
        <BackIcon color="#000000" style={{ marginBottom: "4px" }} />
        <div className="font-semibold text-[#000000] text-xl">Quay về</div>
      </div>

      <div className="font-[Coiny] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-3.5">
        Mua Gói Độ Dáng
      </div>

      <div className="text-[#737373] text-base md:text-xl max-w-[400px] mb-6">
        Mua gói độ dáng để bắt đầu các khóa tập và thực đơn
      </div>

      <div className="flex flex-col gap-16">
        {(Object.keys(PACKAGES) as Array<keyof typeof PACKAGES>).map((key) => (
          <div key={key} className="bg-[#FFAEB01A] rounded-[20px] py-7 px-5">
            <div>
              <div className="flex justify-between">
                <div className="font-[Coiny] text-[#000000] text-xl md:text-2xl mb-[18px]">
                  Gói {PACKAGES[key].name}
                </div>

                <Dialog>
                  <DialogTrigger className="h-fit text-base md:text-xl lg:text-2xl text-[#13D8A7] mb-[18px] max-md:font-light">
                    Chi tiết
                  </DialogTrigger>
                  <DialogContent className="max-md:px-2 max-w-[90%] lg:max-w-[824px]">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-[#FF7873] font-[Coiny] text-3xl md:text-[40px] md:leading-[44px] text-center">
                        {PACKAGES[key].packageText}
                        {PACKAGES[key].name}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="w-full h-[400px] overflow-y-auto">
                      <div>{PACKAGES[key].detail}</div>
                    </div>

                    <DialogFooter className="pt-6 text-center">
                      <Link
                        href={`/package-purchase/${key}`}
                        className="w-full"
                      >
                        <Button className="bg-[#13D8A7] rounded-[26px] h-[38px] md:h-12 text-base md:text-xl w-[190px] md:w-full">
                          Chọn gói
                        </Button>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <ul className="list-disc pl-7 text-base md:text-xl text-[#737373] max-w-[340px] mb-[18px]">
                {PACKAGES[key].description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <Link href={`/package-purchase/${key}`}>
                <Button className="bg-[#13D8A7] w-[190px] h-[38px] rounded-[26px] text-base md:text-xl font-normal md:pt-2.5 md:pb-1.5">
                  Chọn gói
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
