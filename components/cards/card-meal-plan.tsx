import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { MealPlan } from '@/models/meal-plan'

const NextButton = ({ href, className }: { href: string; className?: string }) => {
  return (
    <Link href={href}>
      <button type="button" className={`bg-background p-2 rounded-3xl text-ring ${className}`}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </Link>
  )
}

export function CardMealPlan({ data, compact = false, to }: { data: MealPlan; compact?: boolean; to?: string }) {
  return (
    <div key={`menu-${data.id}`} className="w-full max-w-full overflow-hidden">
      <div className="relative group">
        <img
          src={data.assets.thumbnail}
          alt={data.title}
          className="aspect-[585/373] object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
        />
        <NextButton
          className="absolute bottom-6 right-4 transform transition-transform duration-300 group-hover:translate-x-1"
          href={to || `/meal-plans/${data.id}`}
        />
      </div>
      <div className="relative">
        <div>
          <p className="font-medium">{data.title}</p>
          <p className="text-[#737373]">{data.subtitle}</p>
          <p className="text-[#737373]">Chef {data.chef_name}</p>
        </div>
      </div>
    </div>
  )
}
