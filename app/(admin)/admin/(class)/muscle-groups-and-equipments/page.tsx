import { DumbbellIcon, SquareActivityIcon } from 'lucide-react'

import { MuscleGroupsTable } from '@/components/data-table/muscle-groups-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EquipmentsTable } from '@/components/data-table/equipments-table'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function MuscleGroupsAndEquipmentsPage() {
  return (
    <ContentLayout title="Nhóm cơ & dụng cụ">
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <SquareActivityIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Nhóm cơ
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <DumbbellIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Dụng cụ
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="tab-1">
          <MuscleGroupsTable />
        </TabsContent>
        <TabsContent value="tab-2">
          <EquipmentsTable />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  )
}
