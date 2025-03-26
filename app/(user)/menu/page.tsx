import Layout from "@/components/common/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getListMealPlans } from "@/network/server/meal-plans";

export const dynamic = 'force-dynamic';

function SelectHero({ placeholder }: { placeholder: string }) {
  const data = [
    {
      value: "dress-shirt-striped",
      label: "Striped Dress Shirt",
    },
    {
      value: "relaxed-button-down",
      label: "Relaxed Fit Button Down",
    },
    {
      value: "slim-button-down",
      label: "Slim Fit Button Down",
    },
    {
      value: "dress-shirt-solid",
      label: "Solid Dress Shirt",
    },
    {
      value: "dress-shirt-check",
      label: "Check Dress Shirt",
    },
  ];

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const NextButton = ({ className, href }: { className?: string, href: string }) => {
  return (
    <Link href={href}>
      <button
        type="button"
        className={`bg-background p-2 rounded-3xl text-text ${className}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </Link>
  );
};

export default async function MenuPage() {
  const mealPlansResponse = await getListMealPlans();
  const mealPlans = mealPlansResponse.data || [];

  return (
    <Layout>
      <div className="max-w-screen-md mx-auto">
        <p className="font-[family-name:var(--font-coiny)] sm:text-center text-text text-2xl sm:text-3xl my-2 sm:my-4">
          Chọn thực đơn
        </p>
        <p className="sm:text-center text-[#737373] text-base mb-4">
          Lựa chọn thực đơn phù hợp với mục tiêu, với các món ăn đơn giản, dễ
          chuẩn bị hàng ngày. Ăn ngon miệng mà vẫn đảm bảo tăng cơ, giảm mỡ hiệu
          quả!
        </p>
        <div className="flex gap-4">
          <SelectHero placeholder="Mục tiêu" />
          <SelectHero placeholder="Lượng calo" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-screen-xl mx-auto mt-6">
        {mealPlans.map((mealPlan) => (
          <div key={`menu-${mealPlan.id}`}>
            <div className="relative group">
              <img
                src={mealPlan.image}
                alt={mealPlan.title}
                className="aspect-[5/3] object-cover rounded-xl mb-4"
              />
              <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              <NextButton className="absolute bottom-6 right-4 transform transition-transform duration-300 group-hover:translate-x-1" href={`/menu/${mealPlan.id}`} />
            </div>
            <p className="font-medium">{mealPlan.title}</p>
            <p className="text-[#737373]">{mealPlan.subtitle}</p>
            <p className="text-[#737373]">Chef {mealPlan.chef_name} - {mealPlan.number_of_days} ngày</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
