'use client'

import type { Course, LiveDay, DaySession, DayOfWeek } from '@/models/course'

import { toast } from 'sonner'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, Video, Edit, Trash2 } from 'lucide-react'

import { sortByKey } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { SheetEdit } from '@/components/dialogs/sheet-edit'
import { EditLiveDayForm } from '@/components/forms/edit-live-day-form'
import { EditDaySessionForm } from '@/components/forms/edit-day-session-form'
import { deleteDaySession, deleteLiveDay, getLiveDays, queryKeyLiveDays } from '@/network/client/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const dayOrder: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function CourseLiveView({ courseID }: { courseID: Course['id'] }) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  // Form states
  const [showDayForm, setShowDayForm] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [editingDay, setEditingDay] = useState<LiveDay | null>(null)
  const [editingSession, setEditingSession] = useState<DaySession | null>(null)
  // const [deleteItem, setDeleteItem] = useState<{ type: string; item: any } | null>(null)

  // const queryClient = useQueryClient()

  // Queries
  const {
    data: liveDays,
    isLoading: liveDaysLoading,
    refetch: liveDaysRefetch,
  } = useQuery({
    queryKey: [queryKeyLiveDays, courseID],
    queryFn: () => getLiveDays(courseID),
  })

  const handleAddDay = () => {
    setEditingDay(null)
    setShowDayForm(true)
  }

  const handleEditDay = (day: LiveDay) => {
    setEditingDay(day)
    setShowDayForm(true)
  }

  const handleDeleteDay = (day: LiveDay) => {
    // setDeleteItem({ type: 'day', item: day })
    const deletePromise = () => deleteLiveDay(courseID, day.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        liveDaysRefetch()
        setSelectedDay(null)
        return 'Xoá ngày thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const handleAddSession = (day: LiveDay) => {
    setSelectedDay(day.id)
    setEditingSession(null)
    setShowSessionForm(true)
  }

  const handleEditSession = (session: DaySession, day: LiveDay) => {
    setSelectedDay(day.id)
    setEditingSession(session)
    setShowSessionForm(true)
  }

  const handleDeleteSession = async (dayID: LiveDay['id'], session: DaySession) => {
    // setDeleteItem({ type: 'session', item: session })
    const deletePromise = () => deleteDaySession(courseID, dayID, session.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        liveDaysRefetch()
        setSelectedDay(null)
        return 'Xoá session thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const daysData = sortByKey(liveDays?.data || [], 'day_of_week', { transform: (day) => dayOrder.indexOf(day) })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton onClick={handleAddDay} text="Thêm ngày" />
      </div>

      {liveDaysLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {daysData.map((day) => (
            <Card key={day.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{day.day_of_week}</CardTitle>
                    <CardDescription>{day.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <AddButton onClick={() => handleAddSession(day)} text="Thêm session" />
                    <MainButton size="icon" variant="ghost" onClick={() => handleEditDay(day)} icon={Edit} />
                    <MainButton
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteDay(day)}
                      icon={Trash2}
                      className="hover:text-destructive"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {day.sessions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Chưa có session nào được lên lịch cho ngày này</p>
                  ) : (
                    sortByKey(day.sessions, 'session_number').map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1 mb-4 md:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{session.session_number}</Badge>
                            <h4 className="font-medium">{session.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatTime(session.start_time)} - {formatTime(session.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={session.link_zoom}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join Zoom
                              </a>
                            </Button>
                            <MainButton
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditSession(session, day)}
                              icon={Edit}
                            />
                            <MainButton
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteSession(day.id, session)}
                              icon={Trash2}
                              className="hover:text-destructive"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {daysData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có ngày nào được lên lịch</h3>
              <p className="text-muted-foreground mb-4">Bắt đầu bằng cách thêm một ngày vào lịch trình</p>
            </div>
          )}
        </div>
      )}

      {/* Sheets and Forms */}
      <SheetEdit
        title={editingDay ? 'Chỉnh sửa ngày' : 'Thêm ngày'}
        description="Make changes to your profile here. Click save when you're done."
        open={showDayForm}
        onOpenChange={setShowDayForm}
      >
        <EditLiveDayForm
          courseID={courseID}
          data={editingDay}
          onSuccess={() => {
            setShowDayForm(false)
            setEditingDay(null)
            liveDaysRefetch()
            // queryClient.invalidateQueries({ queryKey: ['liveDays'] })
          }}
        />
      </SheetEdit>

      <SheetEdit
        title={editingSession ? 'Chỉnh sửa session' : 'Thêm session'}
        description="Make changes to your profile here. Click save when you're done."
        open={showSessionForm}
        onOpenChange={setShowSessionForm}
      >
        <EditDaySessionForm
          courseID={courseID}
          liveDayID={selectedDay!}
          data={editingSession}
          onSuccess={() => {
            setShowSessionForm(false)
            setEditingSession(null)
            setSelectedDay(null)
            liveDaysRefetch()
            // queryClient.invalidateQueries({ queryKey: ['liveDays'] })
          }}
        />
      </SheetEdit>

      {/* <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        item={deleteItem}
        onConfirm={() => {
          // Handle delete logic here
          setDeleteItem(null)
          queryClient.invalidateQueries({ queryKey: ["liveDays"] })
        }}
      /> */}
    </div>
  )
}

function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`
  } catch (error) {
    return time
  }
}
