import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserMealPlans } from "@/network/server/user-meal-plans"
export default async function ListMealPlans() {
  const mealPlans = await getUserMealPlans("1")
  console.log(mealPlans)
  return (
    <>
      {mealPlans.data.length === 0 ? (
        <div>
          <div className="text-gray-500 text-xl">Bạn chưa có thực đơn nào</div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
            {mealPlans.data.map((mealPlan) => (
              <Link href={`/menu/${mealPlan.meal_plan.id}`} key={mealPlan.id}>
                <div key={mealPlan.id}>
                  <div className="relative group">
                    <img
                      src={mealPlan.meal_plan.image}
                      alt={mealPlan.meal_plan.title}
                      className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-medium">{mealPlan.meal_plan.title}</p>
                  <p className="text-[#737373]">{mealPlan.meal_plan.subtitle}</p>
                  <p className="text-[#737373]">
                    Chef {mealPlan.meal_plan.chef_name} - {mealPlan.meal_plan.number_of_days} ngày
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/exercise/detail">
            <Button className="bg-button text-white text-xl w-full rounded-full h-14 mt-6">Thêm thực đơn</Button>
          </Link>
        </div>
      )}
    </>
  )
}
