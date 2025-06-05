'use client'

import type { Course, CourseLive, LiveSession, CourseLiveDay } from '@/models/course'

import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Clock, Hourglass, Link, Trash2 } from 'lucide-react'

import { deleteCourseLive, deleteLiveSession, getCourseLives, queryKeyCourseLives } from '@/network/client/courses'
import { EditLiveSessionForm } from '@/components/forms/edit-live-session-form'
import { EditSheet } from '@/components/data-table/edit-sheet'
import { MainButton } from '@/components/buttons/main-button'
import { EditButton } from '@/components/buttons/edit-button'
import { AddButton } from '@/components/buttons/add-button'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { EditCourseLiveForm } from '@/components/forms/edit-course-live-form'

interface CourseViewProps {
  courseID: Course['id']
}

export function CourseView({ courseID: courseID }: CourseViewProps) {
  const [isEditCourseLiveOpen, setIsEditCourseLiveOpen] = useState(false)
  const [isEditLiveSessionOpen, setIsEditLiveSessionOpen] = useState(false)
  const [selectedCourseLive, setSelectedCourseLive] = useState<CourseLive | null>(null)
  const [selectedLiveSession, setSelectedLiveSession] = useState<LiveSession | null>(null)
  const [isAddingCourseLive, setIsAddingCourseLive] = useState(false)

  const isEditCourseLive = !!selectedCourseLive
  const isEditLiveSession = !!selectedLiveSession

  const {
    data: courseLivesData,
    isLoading: isCourseLivesLoading,
    error: courseLivesError,
    refetch: courseLivesRefresh,
  } = useQuery({
    queryKey: [queryKeyCourseLives, courseID],
    queryFn: () => getCourseLives(courseID),
  })

  // useEffect(() => {
  //   if (daysData?.data && daysData.data.length > 0 && !selectedDay) {
  //     setSelectedDay(daysData.data[0])
  //   }
  // }, [daysData, selectedDay])

  if (isCourseLivesLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (courseLivesError) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">{courseLivesError.message}</p>
      </div>
    )
  }

  const courseLives = courseLivesData?.data || []
  const liveSessions = courseLives.find((day: CourseLive) => day.id === selectedCourseLive?.id)?.sessions || []

  const liveDayOrder: CourseLiveDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const sortedCourseLives = [...courseLives].sort((a: CourseLive, b: CourseLive) => {
    return liveDayOrder.indexOf(a.day_of_week as CourseLiveDay) - liveDayOrder.indexOf(b.day_of_week as CourseLiveDay)
  })
  const sortedLiveSessions = [...liveSessions].sort((a: LiveSession, b: LiveSession) => {
    return a.session_number - b.session_number
  }) as LiveSession[]

  const onAddCourseLive = () => {
    setIsAddingCourseLive(true)
    setIsEditCourseLiveOpen(true)
  }

  const onAddLiveSession = () => {
    setSelectedLiveSession(null)
    setIsEditLiveSessionOpen(true)
  }

  const onEditCourseLive = (cl: CourseLive) => {
    setSelectedCourseLive(cl)
    setIsEditCourseLiveOpen(true)
  }

  const onEditCourseLiveSuccess = () => {
    if (isAddingCourseLive) setIsAddingCourseLive(false)
    setSelectedCourseLive(null)
    setIsEditCourseLiveOpen(false)
    courseLivesRefresh()
  }

  const onEditLiveSession = (ls: LiveSession) => {
    setSelectedLiveSession(ls)
    setIsEditLiveSessionOpen(true)
  }

  const onEditLiveSessionSuccess = () => {
    setSelectedLiveSession(null)
    setIsEditLiveSessionOpen(false)
    courseLivesRefresh()
  }

  const onDeleteCourseLive = async (day: CourseLive) => {
    const deletePromise = () => deleteCourseLive(courseID, day.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        courseLivesRefresh()
        setSelectedCourseLive(null)
        return 'Xoá ngày thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const onDeleteLiveSession = async (dish: LiveSession) => {
    const deletePromise = () => deleteLiveSession(courseID, selectedCourseLive?.id!, dish.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        courseLivesRefresh()
        setSelectedLiveSession(null)
        return 'Xoá phiên học thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  return (
    <div className="space-y-4">
      {/* Days Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Danh sách ngày</Label>
          <div className="flex items-center gap-2">
            {selectedCourseLive && (
              <EditButton size="icon" variant="outline" onClick={() => onEditCourseLive(selectedCourseLive)} />
            )}
            {selectedCourseLive && (
              <MainButton
                size="icon"
                variant="outline"
                icon={Trash2}
                className="hover:text-destructive"
                onClick={() => onDeleteCourseLive(selectedCourseLive!)}
              />
            )}
            <AddButton text="Thêm ngày" onClick={onAddCourseLive} />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sortedCourseLives.map((day: CourseLive) => (
            <Button
              type="button"
              key={day.id}
              className={`w-32 whitespace-nowrap ${
                selectedCourseLive?.id !== day.id && 'opacity-60 hover:opacity-100'
              }`}
              onClick={() => setSelectedCourseLive(day)}
            >
              {day.day_of_week}
            </Button>
          ))}
        </div>
        {sortedCourseLives.length === 0 && (
          <div className="text-center text-muted-foreground">Không có ngày nào trong khoá tập</div>
        )}
      </div>

      {/* Dishes for Selected Day */}
      {selectedCourseLive && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base">
              Danh sách phiên học{' '}
              {sortedCourseLives.find((d: CourseLive) => d.id === selectedCourseLive.id)?.day_of_week}
            </Label>
            <AddButton text="Thêm phiên học" onClick={onAddLiveSession} />
          </div>

          {sortedLiveSessions.length === 0 ? (
            <div className="text-center text-muted-foreground">Không có phiên học trong ngày</div>
          ) : (
            <div className="space-y-4">
              {sortedLiveSessions.map((ls, index) => (
                <div key={`ls-${index}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Badge className="'bg-gray-100 text-gray-800 border-gray-200'" variant="outline">
                        Phiên học {ls.session_number}
                      </Badge>
                      <h3 className="font-medium">{ls.name}</h3>
                      <p className="text-gray-600">{ls.description}</p>

                      <div className="flex gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-blue-500" />
                          <span className="text-muted-foreground">zoom</span>
                          <a className="font-medium" href={ls.link_zoom}>
                            {ls.link_zoom}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">bắt đầu</span>
                          <span className="font-medium">{ls.start_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hourglass className="h-4 w-4 text-red-500" />
                          <span className="text-muted-foreground">kết thúc</span>
                          <span className="font-medium">{ls.end_time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <EditButton size="icon" variant="outline" onClick={() => onEditLiveSession(ls)} />
                      <MainButton
                        size="icon"
                        variant="outline"
                        icon={Trash2}
                        className="hover:text-destructive"
                        onClick={() => onDeleteLiveSession(ls)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <EditSheet
        title={!isAddingCourseLive ? 'Chỉnh sửa ngày' : 'Thêm ngày'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditCourseLiveOpen}
        onOpenChange={(open) => {
          setIsEditCourseLiveOpen(open)
          if (!open) setIsAddingCourseLive(false)
        }}
      >
        <EditCourseLiveForm
          courseID={courseID}
          data={!isAddingCourseLive ? selectedCourseLive : null}
          onSuccess={onEditCourseLiveSuccess}
        />
      </EditSheet>

      <EditSheet
        title={isEditLiveSession ? 'Chỉnh sửa phiên học' : 'Thêm phiên học'}
        description="Make changes to your profile here. Click save when you're done."
        open={isEditLiveSessionOpen}
        onOpenChange={setIsEditLiveSessionOpen}
      >
        <EditLiveSessionForm
          courseID={courseID}
          courseLiveID={selectedCourseLive?.id!}
          data={selectedLiveSession}
          onSuccess={onEditLiveSessionSuccess}
        />
      </EditSheet>
    </div>
  )
}

const getMealTimeColor = (mealTime: string) => {
  switch (mealTime) {
    case 'breakfast':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'lunch':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'dinner':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'snack':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}
