'use client'

import type { Course } from '@/models/course'

import { toast } from 'sonner'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, Play, Edit, Trash2, ChevronRight, ChevronDown, Import } from 'lucide-react'

import {
  createCourseWeek,
  createDayCircuit,
  createWeekDay,
  getCourseWeeks,
  getDayCircuits,
  getWeekDays,
  queryKeyCourseWeeks,
  queryKeyDayCircuits,
  queryKeyWeekDays,
} from '@/network/client/courses'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { transformExercise } from '@/lib/xlsx'
import { Button } from '@/components/ui/button'
import { ExcelReader } from '@/components/excel-reader'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { EditSheet } from '@/components/data-table/edit-sheet'
import { EditWeekDayForm } from '@/components/forms/edit-week-day-form'
import { EditCourseWeekForm } from '@/components/forms/edit-course-week-form'
import { EditDayCircuitForm } from '@/components/forms/edit-day-circuit-form'
import { EditCircuitExerciseForm } from '@/components/forms/edit-circuit-exercise-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CourseVideoView({ courseID }: { courseID: Course['id'] }) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [expandedCircuits, setExpandedCircuits] = useState<Set<number>>(new Set())

  // Form states
  const [showWeekForm, setShowWeekForm] = useState(false)
  const [showDayForm, setShowDayForm] = useState(false)
  const [showCircuitForm, setShowCircuitForm] = useState(false)
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deleteItem, setDeleteItem] = useState<{ type: string; item: any } | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null)

  // const queryClient = useQueryClient()

  // Queries
  const {
    data: weeks,
    isLoading: weeksLoading,
    refetch: weeksRefetch,
  } = useQuery({
    queryKey: [queryKeyCourseWeeks, courseID],
    queryFn: () => getCourseWeeks(courseID),
  })

  const {
    data: days,
    isLoading: daysLoading,
    refetch: daysRefetch,
  } = useQuery({
    queryKey: [queryKeyWeekDays, courseID, selectedWeek],
    queryFn: () => getWeekDays(courseID, selectedWeek!),
    enabled: !!selectedWeek,
  })

  const {
    data: circuits,
    isLoading: circuitsLoading,
    refetch: circuitsRefetch,
  } = useQuery({
    queryKey: [queryKeyDayCircuits, selectedDay],
    queryFn: () => getDayCircuits(courseID, selectedWeek!, selectedDay!),
    enabled: !!selectedWeek && !!selectedDay,
  })

  const toggleCircuitExpansion = (circuitId: number) => {
    const newExpanded = new Set(expandedCircuits)
    if (newExpanded.has(circuitId)) {
      newExpanded.delete(circuitId)
    } else {
      newExpanded.add(circuitId)
    }
    setExpandedCircuits(newExpanded)
  }

  const handleEdit = (type: string, item: any) => {
    setEditingItem(item)
    switch (type) {
      case 'week':
        setShowWeekForm(true)
        break
      case 'day':
        setShowDayForm(true)
        break
      case 'circuit':
        setShowCircuitForm(true)
        break
      case 'exercise':
        setShowExerciseForm(true)
        break
    }
  }

  const handleDelete = (type: string, item: any) => {
    setDeleteItem({ type, item })
  }

  return (
    <div className="flex h-full items-stretch">
      {/* Sidebar */}
      <div className="flex flex-col gap-4 w-80 p-4">
        <div className="flex items-center justify-between">
          <ImportDialog courseID={courseID} onSuccess={() => weeksRefetch()} />
          <AddButton
            onClick={() => {
              setEditingItem(null)
              setShowWeekForm(true)
            }}
            text="Thêm tuần"
          />
        </div>

        {weeksLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {weeks?.data.map((week) => (
              <Card
                key={week.id}
                className={`cursor-pointer transition-colors ${selectedWeek === week.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  setSelectedWeek(week.id)
                  setSelectedDay(null)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Tuần {week.week_number}</span>
                    </div>
                    <div className="flex gap-1">
                      <MainButton
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit('week', week)
                        }}
                        icon={Edit}
                      />
                      <MainButton
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete('week', week)
                        }}
                        icon={Trash2}
                        className="hover:text-destructive"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col border-l">
        {selectedWeek ? (
          <div className="flex-1">
            <div className="border-b bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Tuần {weeks?.data.find((w) => w.id === selectedWeek)?.week_number}
                  </h2>
                  <p className="text-muted-foreground">Quản lý ngày và circuits cho tuần này</p>
                </div>
                <AddButton
                  onClick={() => {
                    setEditingItem(null)
                    setShowDayForm(true)
                  }}
                  text="Thêm ngày"
                />
              </div>
            </div>

            <div className="flex-1 p-4">
              {daysLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {days?.data.map((day) => (
                    <Card
                      key={day.id}
                      className={`cursor-pointer transition-colors ${
                        selectedDay === day.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedDay(day.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Ngày {day.day_number}</CardTitle>
                          <div className="flex gap-1">
                            <MainButton
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit('day', day)
                              }}
                              icon={Edit}
                            />
                            <MainButton
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete('day', day)
                              }}
                              icon={Trash2}
                              className="hover:text-destructive"
                            />
                          </div>
                        </div>
                        <CardDescription>{day.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {selectedDay && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Ngày {days?.data.find((d) => d.id === selectedDay)?.day_number} Circuits
                    </h3>
                    <AddButton
                      onClick={() => {
                        setEditingItem(null)
                        setShowCircuitForm(true)
                      }}
                      text="Thêm circuit"
                    />
                  </div>

                  {circuitsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {circuits?.data.map((circuit) => (
                        <Card key={circuit.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => toggleCircuitExpansion(circuit.id)}>
                                  {expandedCircuits.has(circuit.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </Button>
                                <div>
                                  <CardTitle className="text-base">{circuit.name}</CardTitle>
                                  <CardDescription>{circuit.description}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {circuit.auto_replay_count}x
                                </Badge>
                                <MainButton
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit('circuit', circuit)}
                                  icon={Edit}
                                />
                                <MainButton
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete('circuit', circuit)}
                                  icon={Trash2}
                                  className="hover:text-destructive"
                                />
                              </div>
                            </div>
                          </CardHeader>

                          {expandedCircuits.has(circuit.id) && (
                            <CardContent>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium">Bài tập</h4>
                                <AddButton
                                  onClick={() => {
                                    setSelectedExercise(null)
                                    setEditingItem(circuit)
                                    setShowExerciseForm(true)
                                  }}
                                  text="Thêm bài tập"
                                />
                              </div>
                              <div className="space-y-2">
                                {circuit.circuit_exercises.map((exercise) => (
                                  <div
                                    key={exercise.id}
                                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                                  >
                                    <div className="flex items-center gap-4">
                                      <Badge variant="outline">{exercise.no}</Badge>
                                      <div>
                                        <p className="font-medium text-sm">{exercise.circuit_exercise_title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {exercise.circuit_exercise_description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button size="sm" variant="ghost" asChild>
                                        <a href={exercise.youtube_url} target="_blank" rel="noopener noreferrer">
                                          <Play className="w-4 h-4" />
                                        </a>
                                      </Button>
                                      <MainButton
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                          setSelectedExercise(exercise.id!)
                                          setEditingItem(circuit)
                                          setShowExerciseForm(true)
                                        }}
                                        icon={Edit}
                                      />
                                      <MainButton
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete('exercise', exercise)}
                                        icon={Trash2}
                                        className="hover:text-destructive"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Chọn tuần</h3>
              <p className="text-muted-foreground">Chọn một tuần để quản lý các ngày và circuits của tuần đó</p>
            </div>
          </div>
        )}
      </div>

      {/* Sheets and Forms */}
      <EditSheet
        title={editingItem ? 'Chỉnh sửa tuần' : 'Thêm tuần'}
        description="Make changes to your profile here. Click save when you're done."
        open={showWeekForm}
        onOpenChange={setShowWeekForm}
      >
        <EditCourseWeekForm
          courseID={courseID}
          data={editingItem}
          onSuccess={() => {
            setShowWeekForm(false)
            setEditingItem(null)
            weeksRefetch()
            // queryClient.invalidateQueries({ queryKey: ['weeks'] })
          }}
        />
      </EditSheet>

      <EditSheet
        title={editingItem ? 'Chỉnh sửa ngày' : 'Thêm ngày'}
        description="Make changes to your profile here. Click save when you're done."
        open={showDayForm}
        onOpenChange={setShowDayForm}
      >
        <EditWeekDayForm
          courseID={courseID}
          weekID={selectedWeek!}
          data={editingItem}
          onSuccess={() => {
            setShowDayForm(false)
            setEditingItem(null)
            daysRefetch()
            // queryClient.invalidateQueries({ queryKey: ['days', selectedWeek] })
          }}
        />
      </EditSheet>

      <EditSheet
        title={editingItem ? 'Chỉnh sửa circuit' : 'Thêm circuit'}
        description="Make changes to your profile here. Click save when you're done."
        open={showCircuitForm}
        onOpenChange={setShowCircuitForm}
      >
        <EditDayCircuitForm
          courseID={courseID}
          weekID={selectedWeek!}
          dayID={selectedDay!}
          data={editingItem}
          onSuccess={() => {
            setShowCircuitForm(false)
            setEditingItem(null)
            circuitsRefetch()
            // queryClient.invalidateQueries({ queryKey: ["circuits", selectedDay] })
          }}
        />
      </EditSheet>

      <EditSheet
        title={selectedExercise ? 'Chỉnh sửa bài tập' : 'Thêm bài tập'}
        description="Make changes to your profile here. Click save when you're done."
        open={showExerciseForm}
        onOpenChange={setShowExerciseForm}
      >
        <EditCircuitExerciseForm
          courseID={courseID}
          weekID={selectedWeek!}
          dayID={selectedDay!}
          exerciseID={selectedExercise!}
          data={editingItem}
          onSuccess={() => {
            setShowExerciseForm(false)
            setEditingItem(null)
            circuitsRefetch()
            // queryClient.invalidateQueries({ queryKey: ["circuits", selectedDay] })
          }}
        />
      </EditSheet>

      {/* <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        item={deleteItem}
        onConfirm={() => {
          // Handle delete logic here
          setDeleteItem(null)
          // Invalidate relevant queries
        }}
      /> */}
    </div>
  )
}

function ImportDialog({ courseID, onSuccess }: { courseID: Course['id']; onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const _data = transformExercise(data)

      for (const w of _data.weeks) {
        try {
          const weekResponse = await createCourseWeek(courseID, { week_number: w.week_number })

          for (const d of w.days) {
            const dayResponse = await createWeekDay(courseID, weekResponse.data.id, {
              day_number: d.day_number,
              description: '',
            })

            await Promise.all(
              d.circuits.map(
                async (c) =>
                  await createDayCircuit(courseID, weekResponse.data.id, dayResponse.data.id, {
                    name: c.name,
                    description: c.description,
                    auto_replay_count: c.auto_replay_count,
                    circuit_exercises: c.circuit_exercises,
                  })
              )
            )

            // for (const c of d.circuits) {
            //   await createDayCircuit(courseID, weekResponse.data.id, dayResponse.data.id, {
            //     name: c.name,
            //     description: c.description,
            //     auto_replay_count: c.auto_replay_count,
            //     circuit_exercises: c.circuit_exercises,
            //   })
            // }
          }
        } catch (error) {
          console.error(`Error processing week ${w.week_number}:`, error)
          // throw error
        }
      }

      setData([])
      toast.success('Nhập khoá tập thành công')
      onSuccess?.()
      setIsOpen(false)
    } catch (error) {
      console.error('Error importing data:', error)
      toast.error('Đã có lỗi xảy ra khi nhập khoá tập')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MainButton text="Nhập khoá tập" icon={Import} variant="outline" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Nhập món ăn</DialogTitle>
          <DialogDescription>Chức năng này sẽ cho phép nhập danh sách món ăn từ tệp Excel</DialogDescription>
        </DialogHeader>
        <ExcelReader
          specificHeaders={['exercise_no', 'circuit_auto_replay_count', 'week_number', 'day_number']}
          onSuccess={setData}
        />
        {data.length > 0 && <MainButton text="Nhập khoá tập" className="mt-4" onClick={onSubmit} loading={isLoading} />}
      </DialogContent>
    </Dialog>
  )
}
