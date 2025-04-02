import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { CloseIcon } from "@/components/icons/CloseIcon"
import { Button } from "@/components/ui/button"
import { getCircuits } from "@/network/server/circuits"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default async function Video({ params }: { params: Promise<{ video_id: string, id: string }> }) {
    const { video_id, id } = await params
    const courses = await getCircuits(video_id, id, "1")

    return (
        <div className="flex flex-col gap-10 mt-10">
            <div className="mb-20">
                <div className="flex flex-col justify-center text-center gap-5 mb-20">
                    <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">
                        {courses.data[0].name}
                    </div>
                    <p className="text-[#737373] text-xl">
                        {courses.data[0].description}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <Dialog key={`menu-${index}`}>
                            <DialogTrigger asChild>
                                <div key={`menu-${index}`} className="text-xl">
                                    <div className="relative group cursor-pointer">
                                        <Image src="/temp/VideoCard.jpg" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" width={585} height={373} />
                                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="w-3/4">
                                            <p className="font-bold">Title bài 1</p>
                                            <p className="text-[#737373]">
                                                Thực hiện 30s với nhịp điệu vừa phải nhịp tim vừa phải.Chú ý gồng bụng và giữ phom đúng.
                                            </p>
                                        </div>
                                        <Checkbox className="w-8 h-8" />
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-[1399px] max-h-[787px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        <iframe
                                            className="h-[calc(100vw*9/16)] max-h-[720px] w-full rounded-xl p-4"
                                            src="https://www.youtube.com/embed/_4VRmEYFVcg?loop=1&playlist=_4VRmEYFVcg"
                                            title="Cbum"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        ></iframe>
                                    </DialogTitle>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </div>
    )
}