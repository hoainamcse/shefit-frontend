'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, CalendarDays, HouseIcon, BoxIcon } from 'lucide-react'
import { FormInputField, FormTextareaField } from '@/components/forms/fields'
import { ApiResponse } from '@/models/response'
import { TimePicker } from '@/components/time-picker'
import { CreateCourseForm } from '@/components/forms/create-course-form'
import { MainButton } from '@/components/buttons/main-button'
import {
  createDaySession,
  createLiveDay,
  deleteDaySession,
  deleteLiveDay,
  getLives,
  updateDaySession,
  updateLiveDay,
} from '@/network/server/live-admin'
import { Session } from '@/models/live-admin'

// Define the schema for sessions
const sessionSchema = z.object({
  id: z.number().optional(),
  session_number: z.number().min(1, { message: 'Session number is required' }),
  name: z.string().min(1, { message: 'Session name is required' }),
  description: z.string().optional(),
  start_time: z.string().min(1, { message: 'Start time is required' }),
  end_time: z.string().min(1, { message: 'End time is required' }),
  link_zoom: z.string().url({ message: 'Invalid Zoom URL' }),
})

// Define the schema for days
const daySchema = z.object({
  id: z.number().optional(),
  day_of_week: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  description: z.string().optional(),
  sessions: z.array(sessionSchema).optional(),
})

// Define the schema for the course structure form
const courseStructureSchema = z.object({
  days: z.array(daySchema).optional(),
})

// Define the type for the form data
type CourseStructureFormData = z.infer<typeof courseStructureSchema>

export default function LiveClassPageClient({ data }: { data: any }) {
  // Get the class ID from the URL params
  const params = useParams()
  const router = useRouter()
  // State for tracking selected day index
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0)
  const [isLoading, setIsLoading] = useState(false)

  // Available days of week for selection
  const daysOfWeek = [
    { value: 'Sunday', label: 'Sunday' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
  ]

  // Track which days have been used
  const [usedDays, setUsedDays] = useState<string[]>([])

  // Initialize form with empty values
  const form = useForm<CourseStructureFormData>({
    resolver: zodResolver(courseStructureSchema),
    defaultValues: {
      days: [],
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  useEffect(() => {
    const fetchCourseStructure = async () => {
      try {
        setIsLoading(true)
        const courseId = params.class_id as string
        const response = await getLives(courseId)
        if (response.data) {
          form.reset({ days: response.data })
          setUsedDays(response.data.map((day) => day.day_of_week))
        }
      } catch (error) {
        console.error('Error fetching course structure:', error)
        toast.error('Failed to load course structure')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourseStructure()
  }, [params.class_id])

  // Get days field array from the form
  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
    update: updateDay,
  } = useFieldArray({
    control: form.control,
    name: 'days',
  })

  // Function to select a day
  const selectDay = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex)
  }

  // Function to add a new day
  const addDay = (dayOfWeek: string) => {
    // Check if the day is already used
    if (usedDays.includes(dayOfWeek)) {
      toast.error(`${daysOfWeek.find((d) => d.value === dayOfWeek)?.label} is already added`)
      return
    }

    appendDay({
      day_of_week: dayOfWeek,
      start_time: '09:00',
      end_time: '10:00',
      description: '',
      sessions: [],
    })

    // Update the used days
    setUsedDays((prev) => [...prev, dayOfWeek])

    // Select the newly added day
    setSelectedDayIndex(dayFields.length)
  }

  // Function to add a new session to a day
  const addSession = (dayIndex: number) => {
    const day = form.getValues()?.days?.[dayIndex]
    if (!day) return
    if (day.sessions) {
      const updatedDay = {
        ...day,
        sessions: [
          ...day.sessions,
          {
            session_number: day.sessions.length + 1,
            name: `Session ${day.sessions.length + 1}`,
            description: '',
            start_time: '09:00',
            end_time: '10:00',
            link_zoom: '',
          },
        ],
      }
      updateDay(dayIndex, updatedDay)
    }
  }

  // Function to remove a day
  const handleRemoveDay = (dayIndex: number) => {
    const day = form.getValues()?.days?.[dayIndex]
    if (!day) return

    // Update the used days to remove this day
    setUsedDays((prev) => prev.filter((d) => d !== day.day_of_week))

    // Remove the day
    removeDay(dayIndex)

    // Update selected day index
    if (selectedDayIndex === dayIndex) {
      setSelectedDayIndex(dayFields.length > 1 ? 0 : null)
    } else if (selectedDayIndex !== null && selectedDayIndex > dayIndex) {
      setSelectedDayIndex(selectedDayIndex - 1)
    }
  }

  // Function to remove a session from a day
  const removeSession = (dayIndex: number, sessionIndex: number) => {
    const day = form.getValues()?.days?.[dayIndex]
    if (!day) return
    if (day.sessions) {
      const updatedSessions = [...day.sessions]
      updatedSessions.splice(sessionIndex, 1)

      // Update session numbers
      const renumberedSessions = updatedSessions.map((session, idx) => ({
        ...session,
        session_number: idx + 1,
      }))

      updateDay(dayIndex, {
        ...day,
        sessions: renumberedSessions,
      })
    }
  }

  // Function to handle form submission
  const onSubmit = async (formData: CourseStructureFormData) => {
    try {
      const courseId = params.class_id as string
      const toastId = toast.loading('Updating course structure...')

      let existingDaysResponse
      try {
        existingDaysResponse = await getLives(courseId)
      } catch (error) {
        console.error(`Error fetching days:`, error)
        existingDaysResponse = { data: [] }
      }
      const existingDays = existingDaysResponse.data || []

      // Track processed days to identify deleted ones
      const processedDayIds = new Set()

      if (!formData.days) {
        formData.days = []
      }

      // Process days for this week
      for (const day of formData.days) {
        // Format day data
        const dayData = {
          day_of_week: day.day_of_week,
          start_time: day.start_time,
          end_time: day.end_time,
          description: day.description,
        }

        // Check if day exists
        const existingDay = existingDays.find((d) => d.id === day.id)

        let dayResult
        if (!day.id) {
          // Create new day
          dayResult = await createLiveDay(courseId, dayData)
        } else if (existingDay) {
          // Update existing day
          processedDayIds.add(day.id)
          dayResult = await updateLiveDay(courseId, day.id.toString(), dayData)
        } else {
          // Skip this day as it doesn't exist and doesn't need to be created
          continue
        }

        if (!dayResult.data) {
          console.error('Failed to create/update day:', dayResult)
          continue
        }

        const dayId = dayResult.data?.id?.toString()

        // Get existing circuits for this day
        let existingSessions: Session[] = []
        try {
          existingSessions = existingDays.find((d) => d.id === day.id)?.sessions || []
        } catch (error) {
          console.error(`Error fetching sessions for day ${dayId}:`, error)
          existingSessions = []
        }

        // Track processed sessions to identify deleted ones
        const processedSessionIds = new Set()

        // Process sessions for this day
        for (const session of day.sessions || []) {
          // Format session data
          const sessionData = {
            session_number: session.session_number,
            name: session.name,
            description: session.description || '',
            start_time: session.start_time,
            end_time: session.end_time,
            link_zoom: session.link_zoom,
          }

          // Check if session exists
          const existingSession = existingSessions.find((s) => s.id === session.id)

          if (!session.id && dayId) {
            // Create new session
            await createDaySession(courseId, dayId, sessionData)
          } else if (existingSession && dayId) {
            // Update existing circuit
            processedSessionIds.add(session.id)
            await updateDaySession(courseId, dayId, session.id!.toString(), sessionData)
          }
        }

        // Delete sessions that were removed
        for (const existingSession of existingSessions) {
          if (!processedSessionIds.has(existingSession.id)) {
            await deleteDaySession(courseId, dayId!, existingSession.id!.toString())
          }
        }
      }

      // Delete days that were removed
      for (const existingDay of existingDays) {
        if (!processedDayIds.has(existingDay.id)) {
          await deleteLiveDay(courseId, existingDay.id!.toString())
        }
      }

      toast.dismiss(toastId)
      toast.success('Course structure updated successfully')

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error updating course structure:', error)
      toast.error('Failed to update course structure')
    }
  }

  // Get the currently selected day
  const selectedDay = selectedDayIndex !== null ? dayFields[selectedDayIndex] : null

  // Render the component
  return (
    <div className="space-y-6">
      {isSubmitting && <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50" />}
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <HouseIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <BoxIcon
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Chi tiết khoá tập
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="tab-1">
          <CreateCourseForm format="live" isEdit data={data.data} />
        </TabsContent>

        <TabsContent value="tab-2">
          {isLoading ? (
            <div className="flex items-center justify-center w-full py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading course structure...</p>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Column-based layout for days and sessions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Days Column */}
                  <div className="border-b pb-4 md:border-b-0 md:border-r md:pr-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Days</h3>
                      <div className="w-48">
                        <div className="w-full">
                          <Select onValueChange={(value) => addDay(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Add a day" />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map((day) => (
                                <SelectItem
                                  key={day.value}
                                  value={day.value.toString()}
                                  disabled={usedDays.includes(day.value)}
                                >
                                  {day.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {dayFields.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No days added yet. Select a day from the dropdown to add it.</p>
                        </div>
                      )}

                      {dayFields.map((day, index) => (
                        <div
                          key={day.id || index}
                          className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                            selectedDayIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => selectDay(index)}
                        >
                          <span className="truncate">
                            {daysOfWeek.find((d) => d.value === day.day_of_week)?.label}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveDay(index)
                            }}
                            className={`h-8 w-8 p-0 ${
                              selectedDayIndex === index ? 'text-primary-foreground' : 'text-destructive'
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sessions Column */}
                  <div>
                    {selectedDayIndex !== null && (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">
                            Sessions for{' '}
                            {daysOfWeek.find((d) => d.value === dayFields[selectedDayIndex]?.day_of_week)?.label}
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSession(selectedDayIndex)}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Session
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {!selectedDay?.sessions?.length && (
                            <div className="text-center py-8 text-muted-foreground">
                              <p>No sessions added yet. Click "Add Session" to create one.</p>
                            </div>
                          )}

                          {selectedDay?.sessions?.map((session, sessionIndex) => (
                            <Card key={session.id || sessionIndex}>
                              <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-center">
                                  <FormInputField
                                    form={form}
                                    label="Session Name"
                                    name={`days.${selectedDayIndex}.sessions.${sessionIndex}.name`}
                                    placeholder="Session Name"
                                    className="text-lg font-medium"
                                  />

                                  <FormInputField
                                    form={form}
                                    name={`days.${selectedDayIndex}.sessions.${sessionIndex}.session_number`}
                                    label="Session Number"
                                    type="number"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSession(selectedDayIndex, sessionIndex)}
                                    className="h-8 w-8 p-0 text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="space-y-4">
                                  <FormInputField
                                    form={form}
                                    name={`days.${selectedDayIndex}.sessions.${sessionIndex}.link_zoom`}
                                    label="Zoom Link"
                                    placeholder="Enter Zoom meeting link"
                                  />
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`days.${selectedDayIndex}.sessions.${sessionIndex}.start_time`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Start Time</FormLabel>
                                          <FormControl>
                                            <TimePicker
                                              value={field.value}
                                              onChange={field.onChange}
                                              format="24"
                                              className="w-full"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`days.${selectedDayIndex}.sessions.${sessionIndex}.end_time`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>End Time</FormLabel>
                                          <FormControl>
                                            <TimePicker
                                              value={field.value}
                                              onChange={field.onChange}
                                              format="24"
                                              className="w-full"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <FormTextareaField
                                    form={form}
                                    name={`days.${selectedDayIndex}.sessions.${sessionIndex}.description`}
                                    label="Description"
                                    placeholder="Enter session description"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}

                    {selectedDayIndex === null && (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center text-muted-foreground">
                          <CalendarDays className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
                          <p>Select a day to manage its sessions</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <MainButton text="Lưu cấu trúc khoá tập" type="submit" className="w-full" disabled={isSubmitting} />
              </form>
            </Form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
