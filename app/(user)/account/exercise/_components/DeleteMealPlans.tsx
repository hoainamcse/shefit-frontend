import { DeleteIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteUserMealPlan } from "@/network/server/user-meal-plans"

interface DeleteMealPlanProps {
  mealPlanId: string
}

export default function DeleteMealPlan({ mealPlanId }: DeleteMealPlanProps) {
  const handleDeleteMealPlan = async (mealPlanId: string) => {
    try {
      await deleteUserMealPlan("1", mealPlanId)
      toast("Xóa thực đơn thành công")
    } catch (error) {
      toast("Xóa thực đơn thất bại")
    }
  }
  return (
    <Button className="absolute top-4 right-4 z-10" onClick={() => handleDeleteMealPlan(mealPlanId)}>
      <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
    </Button>
  )
}
