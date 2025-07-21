'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

function FilterCategory({
  placeholder,
  options,
  onChange,
  value,
  isLoading,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  onChange?: (value: string) => void
  value: string
  isLoading?: boolean
}) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="w-full justify-start gap-2 bg-white shadow-none flex-wrap mb-5 lg:mb-0">
        {options.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex-1 bg-white h-[36px] text-base shadow-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none max-w-[250px]"
            disabled={isLoading}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default FilterCategory
