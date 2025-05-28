import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { getSubscriptions } from "@/network/server/subscriptions"

export default async function PurchasePackage() {
  const subscriptions = await getSubscriptions()

  return (
    <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px]">
      <div className="font-[Coiny] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-3.5">
        Mua Gói Độ Dáng
      </div>

      <div className="text-[#737373] text-base md:text-xl max-w-[400px] mb-6">
        Mua gói độ dáng để bắt đầu các khóa tập và thực đơn
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {subscriptions.data.map((subscription) => (
          <div key={subscription.id} className="bg-[#FFAEB01A] rounded-[20px] py-7 px-5">
            <div>
              <div className="flex justify-between">
                <div className="font-[Coiny] text-[#000000] text-xl md:text-2xl mb-[18px]">{subscription.name}</div>

                <Dialog>
                  <DialogTrigger className="h-fit text-base md:text-xl lg:text-2xl text-[#13D8A7] mb-[18px] max-md:font-light">
                    Chi tiết
                  </DialogTrigger>
                  <DialogContent className="max-md:px-2 max-w-[90%] lg:max-w-[824px]">
                    <DialogHeader className="pb-6">
                      <DialogTitle className="text-[#FF7873] font-[Coiny] text-3xl md:text-[40px] md:leading-[44px] text-center">
                        {subscription.name}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="w-full h-[400px] overflow-y-auto">
                      <div>{subscription.description_2}</div>
                    </div>

                    <DialogFooter className="pt-6 text-center">
                      <Link href={`/packages/${subscription.id}`} className="w-full">
                        <Button className="bg-[#13D8A7] rounded-[26px] h-[38px] md:h-12 text-base md:text-xl w-[190px] md:w-full">
                          Chọn gói
                        </Button>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex gap-5 justify-between items-center px-2 w-full">
                <ul className="list-disc pl-7 text-base md:text-xl text-[#737373] w-[50%]">
                  {subscription.description_1.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <img
                  src={subscription.cover_image}
                  alt=""
                  className="aspect-[3/2] object-cover rounded-[20px] w-[50%]"
                />
              </div>

              <Link href={`/packages/${subscription.id}`}>
                <Button className="bg-[#13D8A7] w-[190px] h-[38px] rounded-[26px] text-base md:text-xl font-normal md:pt-2.5 md:pb-1.5">
                  Chọn gói
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
