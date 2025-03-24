import Image from "next/image"
import MenuDetailImage from "@/assets/image/MenuDetail.png"
import { Button } from "@/components/ui/button"
import Header from "@/components/common/Header"
import MenuResponsive from "@/assets/image/MenuResponsive.png"
import Link from "next/link"
import { BackIcon } from "@/components/icons/BackIcon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMealPlanDetails } from "@/network/server/meal-plans"
import { getMealPlanDishes } from "@/network/server/meal-plans"
export default async function MenuDetailCalendar({ params }: { params: { detail: string } }) {
  const { data: mealPlan } = await getMealPlanDetails(params.detail)
  const { data: mealPlanDishes } = await getMealPlanDishes(params.detail, "1")
  const data: Array<{
    id: number
    name: string
    sales: string
  }> = [
      {
        id: 1,
        name: "Thịt cá",
        sales: "",
      },
      {
        id: 2,
        name: "Rau củ",
        sales: "",
      },
      {
        id: 3,
        name: "Tinh bột",
        sales: "",
      },
      {
        id: 4,
        name: "Gia vị",
        sales: "",
      },
      {
        id: 5,
        name: "Khác",
        sales: "",
      },
    ]
  return (
    <div>
      <div className="xl:block max-lg:hidden">
        <Header />
      </div>
      <div className="flex flex-col items-center justify-center mt-16 max-lg:mt-0 mx-auto xl:w-[1800px] max-lg:w-full">
        <div className="relative w-full">
          <Link
            href="#"
            className="absolute top-0 left-0 mt-8 ml-2 xl:hidden max-lg:block hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <Button className="flex items-center gap-2 text-xl bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent">
              <BackIcon /> Quay về
            </Button>
          </Link>
          <Image src={mealPlan.image} alt="Menu detail image" className="xl:block max-lg:hidden" />
        </div>
        <div className="mr-auto text-xl mt-8 max-lg:p-4">
          <p className="font-bold">{mealPlan.goal}</p>
          <p className="text-[#737373]">{mealPlan.title}</p>
          <p className="text-[#737373]">Chef {mealPlan.chef_name} - {mealPlan.number_of_days} ngày</p>
        </div>
        <div className="w-full max-lg:p-4">
          <div className="bg-primary h-[228px] w-full rounded-[20px] my-20 max-lg:my-2">
            <div className="xl:w-[696px] max-lg:w-full mx-auto text-white h-full flex flex-col items-center justify-center">
              <div className="text-center text-[40px] font-bold mb-10">Kết quả</div>
              <ul className="text-[#F7F7F7] text-xl list-disc mr-auto max-lg:px-8">
                {mealPlanDishes.map((dish: any) => (
                  <li key={dish.id}>{dish.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mr-auto text-xl my-20 max-lg:my-0 max-lg:p-4">
          <div className="font-[family-name:var(--font-coiny)] text-text text-[40px] max-lg:text-[30px] mb-5">
            Menu theo lịch
          </div>
          <div>
            {mealPlan.description}
          </div>
        </div>
        <Tabs defaultValue="1" className="w-full h-full">
          <TabsList className="w-full flex-wrap justify-start bg-transparent p-0 h-full">
            {Array.from({ length: mealPlan.number_of_days }, (_, i) => (
              <TabsTrigger
                key={i + 1}
                value={`${i + 1}`}
                className={`
              rounded-full 
              mx-[10px] 
              my-5 
              w-[63px] 
              h-[64px] 
              flex 
              flex-col 
              items-center 
              justify-center 
              font-medium 
              text-xl 
              cursor-pointer 
              data-[state=active]:bg-[#91EBD5] 
              data-[state=active]:text-white
              bg-transparent
              hover:bg-[#91EBD5]/10
              transition-colors
              duration-200
            `}
              >
                <div>Ngày {i + 1}</div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={mealPlanDishes[0].image} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Sáng: {mealPlanDishes[0].name}</div>
            <div className="text-[#737373]">KCAL {mealPlanDishes[0].calories} Pro {mealPlanDishes[0].protein} Fat {mealPlanDishes[0].fat} Carb {mealPlanDishes[0].carbs} Fiber {mealPlanDishes[0].fiber}</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="border text-center">Thành phần</TableHead>
                <TableHead className="border text-center">Nguyên liệu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[#737373]">
              {mealPlanDishes[0].ingredients.map((ingredient: any) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="border">{ingredient.name}</TableCell>
                  <TableCell className="border text-right">{ingredient.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            {mealPlanDishes[0].description}
          </div>
        </div>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={mealPlanDishes[1].image} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Trưa: {mealPlanDishes[1].name}</div>
            <div className="text-[#737373]">KCAL {mealPlanDishes[1].calories} Pro {mealPlanDishes[1].protein} Fat {mealPlanDishes[1].fat} Carb {mealPlanDishes[1].carbs} Fiber {mealPlanDishes[1].fiber}</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="border text-center">Thành phần</TableHead>
                <TableHead className="border text-center">Nguyên liệu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[#737373]">
              {mealPlanDishes[1].ingredients.map((ingredient: any) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="border">{ingredient.name}</TableCell>
                  <TableCell className="border text-right">{ingredient.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            {mealPlanDishes[1].description}
          </div>
        </div>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={mealPlanDishes[2].image} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Tối: {mealPlanDishes[2].name}</div>
            <div className="text-[#737373]">KCAL {mealPlanDishes[2].calories} Pro {mealPlanDishes[2].protein} Fat {mealPlanDishes[2].fat} Carb {mealPlanDishes[2].carbs} Fiber {mealPlanDishes[2].fiber}</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="border text-center">Thành phần</TableHead>
                <TableHead className="border text-center">Nguyên liệu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[#737373]">
              {mealPlanDishes[2].ingredients.map((ingredient: any) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="border">{ingredient.name}</TableCell>
                  <TableCell className="border text-right">{ingredient.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            {mealPlanDishes[2].description}
          </div>
        </div>
        <div className="mb-10 flex flex-col xl:w-full xl:text-xl max-lg:text-base gap-8 max-lg:px-4">
          <Image src={mealPlanDishes[3].image} alt="Menu detail image" className="xl:w-full" />
          <div>
            <div className="font-medium">Bữa Phụ: {mealPlanDishes[3].name}</div>
            <div className="text-[#737373]">KCAL {mealPlanDishes[3].calories} Pro {mealPlanDishes[3].protein} Fat {mealPlanDishes[3].fat} Carb {mealPlanDishes[3].carbs} Fiber {mealPlanDishes[3].fiber}</div>
          </div>
          <Table className="w-[400px] text-center border border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="border text-center">Thành phần</TableHead>
                <TableHead className="border text-center">Nguyên liệu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[#737373]">
              {mealPlanDishes[3].ingredients.map((ingredient: any) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="border">{ingredient.name}</TableCell>
                  <TableCell className="border text-right">{ingredient.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="xl:w-full text-[#737373]">
            {mealPlanDishes[3].description}
          </div>
        </div>
      </div>
    </div>
  )
}