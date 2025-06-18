import { FlameIcon, SaladIcon, TargetIcon } from 'lucide-react'
import { GoalTable } from '@/components/data-table/goal-table'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CaloriesTable } from '@/components/data-table/calories-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DietsTable } from '@/components/data-table/diets-table'

export default function DietsCaloriesPage() {
  return (
    <ContentLayout title="Nhóm cơ & dụng cụ">
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <SaladIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Chế độ ăn
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <FlameIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Calories
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <TargetIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Mục tiêu
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="tab-1">
          <DietsTable />
        </TabsContent>
        <TabsContent value="tab-2">
          <CaloriesTable />
        </TabsContent>
        <TabsContent value="tab-3">
          <GoalTable />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  )
}
