import type { Course } from '@/models/course'

import { BoxIcon, HouseIcon } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditCourseForm } from '@/components/forms/edit-course-form'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getCourse } from '@/network/client/courses'

import { CourseView } from './course-view'

export default async function EditMealPlanPage({ params }: { params: Promise<{ class_id: Course['id'] }> }) {
  const { class_id } = await params
  const data = await getCourse(class_id)

  return (
    <ContentLayout title="Cập nhật thực đơn">
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <HouseIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <BoxIcon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
              Chi tiết khoá tập
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="tab-1">
          <EditCourseForm
            data={data.data}
            courseFormat={data.data.course_format}
            isOneOnOne={data.data.is_one_on_one}
          />
        </TabsContent>

        <TabsContent value="tab-2">
          <CourseView courseID={class_id} />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  )
}
