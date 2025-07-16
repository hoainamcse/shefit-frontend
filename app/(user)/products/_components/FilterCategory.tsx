'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

function FilterCategory({
  placeholder,
  options,
  onChange,
  value,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  onChange?: (value: string) => void
  value: string
}) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="w-full justify-start gap-2 bg-white shadow-none flex-wrap">
        {options.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex-1 bg-white h-[36px] text-lg shadow-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default FilterCategory
