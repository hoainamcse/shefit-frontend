import EducatorCard from "./Educator"

export default function Educator() {
  return (
    <div className="flex flex-col items-center text-center mt-20 w-full bg-white">
      <div className="text-[40px] leading-[45px] max-lg:text-[30px] font-bold text-wrap mb-8 mt-4">
        Dẫn dắt bởi <br></br>
        chuyên gia hàng đầu
      </div>
      <EducatorCard />
    </div>
  )
}
