'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Form } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MainButton } from '@/components/buttons/main-button'
import { FormInputField, FormTextareaField } from '@/components/forms/fields'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, Trash2, Edit, HouseIcon, BoxIcon } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CreateCourseForm } from '@/components/forms/create-course-form'
import { ApiResponse } from '@/models/response'
import { Course } from '@/models/course'
import { DetailCourse } from '@/models/course-admin'
import { ImportIcon } from 'lucide-react'
import { transformExercise } from '@/lib/xlsx'
import { createEquipment } from '@/network/client/equipments'
import { createMuscleGroup } from '@/network/client/muscle-groups'
import { ExcelReader } from '@/components/excel-reader'

// Import API functions for weeks, days, and circuits
import { getWeeks, createWeek, updateWeek, deleteWeek } from '@/network/server/weeks'
import { getDays, createDay, updateDay, deleteDay } from '@/network/server/days'
import { getCircuits, createCircuit, updateCircuit, deleteCircuit } from '@/network/server/circuits'

// Define the schema for exercise
const exerciseSchema = z.object({
  id: z.number().optional(),
  circuit_exercise_title: z.string().min(1, { message: 'Exercise name is required' }),
  circuit_exercise_description: z.string().optional(),
  youtube_url: z.string().url().optional(),
  no: z.number().min(1).default(1),
  // duration: z.string().optional(),
  // reps: z.string().optional(),
  // sets: z.string().optional(),
  // image_url: z.string().optional(),
})

// Define the schema for circuit
const circuitSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: 'Circuit name is required' }),
  description: z.string().optional(),
  auto_replay_count: z.coerce.number().min(1).default(1),
  circuit_exercises: z.array(exerciseSchema),
})

// Define the schema for day
const daySchema = z.object({
  id: z.number().optional(),
  day_number: z.number().min(1, { message: 'Day number is required' }),
  description: z.string().optional(),
  circuits: z.array(circuitSchema),
})

// Define the schema for week
const weekSchema = z.object({
  id: z.number().optional(),
  week_number: z.number().min(1, { message: 'Week number is required' }),
  // description: z.string().optional(),
  days: z.array(daySchema),
})

// Define the schema for the entire course structure
const courseStructureSchema = z.object({
  // description: z.string().optional(),
  weeks: z.array(weekSchema),
})

type CourseStructureFormData = z.infer<typeof courseStructureSchema>

interface CourseVideoViewProps {
  courseID: Course['id']
}

export function CourseVideoView({ courseID }: CourseVideoViewProps) {
  const params = useParams()
  const router = useRouter()
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null)
  const [editingExerciseData, setEditingExerciseData] = useState<z.infer<typeof exerciseSchema> | null>(null)
  const [currentCircuitIndex, setCurrentCircuitIndex] = useState<{
    weekIndex: number
    dayIndex: number
    circuitIndex: number
  } | null>(null)

  // State for tracking selected items in each column
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(0)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0)

  // Initialize form with empty values first
  const form = useForm<CourseStructureFormData>({
    resolver: zodResolver(courseStructureSchema),
    defaultValues: {
      weeks: [],
    },
  })

  const [isLoading, setIsLoading] = useState(true)
  const {
    formState: { isSubmitting },
  } = form

  // Fetch weeks, days, and circuits data
  useEffect(() => {
    const fetchCourseStructure = async () => {
      try {
        setIsLoading(true)

        // Fetch weeks
        const weeksResponse = await getWeeks(courseID)
        const weeks = weeksResponse.data || []

        // Create a structure to hold all the data
        const formattedWeeks = []

        // For each week, fetch its days
        for (const week of weeks) {
          const weekId = week.id
          const daysResponse = await getDays(courseID, weekId)
          const days = daysResponse.data || []

          const formattedDays = []

          // For each day, fetch its circuits
          for (const day of days) {
            const dayId = day.id
            const circuitsResponse = await getCircuits(courseID, weekId, dayId)
            const circuits = circuitsResponse.data || []

            // Format the day with its circuits
            formattedDays.push({
              id: day.id,
              day_number: day.day_number,
              description: day.description || '',
              circuits: circuits.map((circuit) => ({
                id: circuit.id,
                name: circuit.name,
                description: circuit.description || '',
                auto_replay_count: circuit.auto_replay_count || 1,
                circuit_exercises: circuit.circuit_exercises || [],
              })),
            })
          }

          // Sort days by day_number
          formattedDays.sort((a, b) => a.day_number - b.day_number)

          // Format the week with its days
          formattedWeeks.push({
            id: week.id,
            week_number: week.week_number,
            days: formattedDays,
          })
        }

        // Sort weeks by week_number
        formattedWeeks.sort((a, b) => a.week_number - b.week_number)

        // Set the form default values
        if (formattedWeeks.length > 0) {
          form.reset({
            weeks: formattedWeeks,
          })

          // Set initial selected indices
          if (formattedWeeks.length > 0) {
            setSelectedWeekIndex(0)
            if (formattedWeeks[0].days.length > 0) {
              setSelectedDayIndex(0)
            }
          }
        } else {
          // If no weeks exist, initialize with a default structure
          form.reset({
            weeks: [
              {
                week_number: 1,
                days: [
                  {
                    day_number: 1,
                    description: '',
                    circuits: [
                      {
                        name: 'Circuit 1',
                        description: '',
                        auto_replay_count: 1,
                        circuit_exercises: [],
                      },
                    ],
                  },
                ],
              },
            ],
          })
          setSelectedWeekIndex(0)
          setSelectedDayIndex(0)
        }
      } catch (error) {
        console.error('Error fetching course structure:', error)
        toast.error('Failed to load course structure')

        // Initialize with default structure on error
        form.reset({
          weeks: [
            {
              week_number: 1,
              days: [
                {
                  day_number: 1,
                  description: '',
                  circuits: [
                    {
                      name: 'Circuit 1',
                      description: '',
                      auto_replay_count: 1,
                      circuit_exercises: [],
                    },
                  ],
                },
              ],
            },
          ],
        })
        setSelectedWeekIndex(0)
        setSelectedDayIndex(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseStructure()
  }, [params.course_id, form])

  // Use field arrays for dynamic form fields
  const {
    fields: weekFields,
    append: appendWeek,
    remove: removeWeek,
  } = useFieldArray({
    control: form.control,
    name: 'weeks',
  })

  // Function to handle form submission
  const onSubmit = async (formData: CourseStructureFormData) => {
    try {
      const toastId = toast.loading('Updating course structure...')

      // Get existing weeks to compare with form data
      let existingWeeksResponse
      try {
        existingWeeksResponse = await getWeeks(courseID)
      } catch (error) {
        console.error('Error fetching existing weeks:', error)
        existingWeeksResponse = { data: [] }
      }
      const existingWeeks = existingWeeksResponse.data || []

      // Process weeks

      for (const week of formData.weeks) {
        // Format week data
        const weekData = {
          week_number: week.week_number,
        }

        // Check if week exists
        const existingWeek = existingWeeks.find((w) => w.id === week.id)

        let weekResult
        if (!week.id) {
          // Create new week
          weekResult = await createWeek(courseID, weekData)
        } else if (existingWeek) {
          // Update existing week
          weekResult = await updateWeek(courseID, week.id.toString(), weekData)
        } else {
          // Skip this week as it doesn't exist and doesn't need to be created
          continue
        }

        if (!weekResult.data) {
          console.error('Failed to create/update week:', weekResult)
          continue
        }

        const weekId = weekResult.data.id

        // Get existing days for this week
        let existingDaysResponse
        try {
          existingDaysResponse = await getDays(courseID, weekId)
        } catch (error) {
          console.error(`Error fetching days for week ${weekId}:`, error)
          existingDaysResponse = { data: [] }
        }
        const existingDays = existingDaysResponse.data || []

        // Track processed days to identify deleted ones
        const processedDayIds = new Set()

        // Process days for this week
        for (const day of week.days) {
          // Format day data
          const dayData = {
            day_number: day.day_number,
            description: day.description || '',
          }

          // Check if day exists
          const existingDay = existingDays.find((d) => d.id === day.id)

          let dayResult
          if (!day.id) {
            // Create new day
            dayResult = await createDay(courseID, weekId, dayData)
          } else if (existingDay) {
            // Update existing day
            processedDayIds.add(day.id)
            dayResult = await updateDay(courseID, weekId, day.id.toString(), dayData)
          } else {
            // Skip this day as it doesn't exist and doesn't need to be created
            continue
          }

          if (!dayResult.data) {
            console.error('Failed to create/update day:', dayResult)
            continue
          }

          const dayId = dayResult.data.id

          // Get existing circuits for this day
          let existingCircuitsResponse
          try {
            existingCircuitsResponse = await getCircuits(courseID, weekId, dayId)
          } catch (error) {
            console.error(`Error fetching circuits for day ${dayId}:`, error)
            existingCircuitsResponse = { data: [] }
          }
          const existingCircuits = existingCircuitsResponse.data || []

          // Track processed circuits to identify deleted ones
          const processedCircuitIds = new Set()

          // Process circuits for this day
          for (const circuit of day.circuits) {
            // Format circuit data
            const circuitData = {
              name: circuit.name,
              description: circuit.description || '',
              auto_replay_count: circuit?.auto_replay_count || 1,
              circuit_exercises: circuit.circuit_exercises || [],
            }

            // Check if circuit exists
            const existingCircuit = existingCircuits.find((c) => c.id === circuit.id)

            if (!circuit.id) {
              // Create new circuit
              await createCircuit(courseID, weekId, dayId, circuitData)
            } else if (existingCircuit) {
              // Update existing circuit
              processedCircuitIds.add(circuit.id)
              const response = await updateCircuit(courseID, weekId, dayId, circuit.id.toString(), circuitData)
            }
          }

          // Delete circuits that were removed
          for (const existingCircuit of existingCircuits) {
            if (!processedCircuitIds.has(existingCircuit.id)) {
              await deleteCircuit(courseID, weekId, dayId, existingCircuit.id.toString())
            }
          }
        }

        // Delete days that were removed
        for (const existingDay of existingDays) {
          if (!processedDayIds.has(existingDay.id)) {
            await deleteDay(courseID, weekId, existingDay.id.toString())
          }
        }
      }

      // Delete weeks that were removed
      for (const existingWeek of existingWeeks) {
        const stillExists = formData.weeks.some((week) => week.id === existingWeek.id)
        if (!stillExists) {
          await deleteWeek(courseID, existingWeek.id.toString())
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

  // Function to add a new exercise to a specific circuit
  const addExercise = (weekIndex: number, dayIndex: number, circuitIndex: number) => {
    setCurrentCircuitIndex({ weekIndex, dayIndex, circuitIndex })
    setEditingExerciseIndex(null)
    setEditingExerciseData(null)
    setIsExerciseDialogOpen(true)
  }

  // Function to edit an existing exercise
  const editExercise = (
    weekIndex: number,
    dayIndex: number,
    circuitIndex: number,
    exerciseIndex: number,
    exercise: z.infer<typeof exerciseSchema>
  ) => {
    setCurrentCircuitIndex({ weekIndex, dayIndex, circuitIndex })
    setEditingExerciseIndex(exerciseIndex)
    setEditingExerciseData(exercise)
    setIsExerciseDialogOpen(true)
  }

  // Function to handle adding the exercise from the dialog
  const handleAddExercise = (exercise: z.infer<typeof exerciseSchema>) => {
    if (!currentCircuitIndex) return

    const { weekIndex, dayIndex, circuitIndex } = currentCircuitIndex
    const exercises =
      form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.circuit_exercises`) || []

    form.setValue(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.circuit_exercises`, [
      ...exercises,
      exercise,
    ])

    setIsExerciseDialogOpen(false)
  }

  // Function to add a new week
  const addWeek = () => {
    const newWeekIndex = weekFields.length
    appendWeek({
      week_number: newWeekIndex + 1,
      days: [
        {
          day_number: 1,
          description: '',
          circuits: [
            {
              name: 'Circuit 1',
              description: '',
              auto_replay_count: 1,
              circuit_exercises: [],
            },
          ],
        },
      ],
    })
    // Automatically select the new week
    setSelectedWeekIndex(newWeekIndex)
    setSelectedDayIndex(0)
  }

  // Function to add a new day to a specific week
  const addDay = (weekIndex: number) => {
    const days = form.getValues(`weeks.${weekIndex}.days`) || []

    // Validate that the number of days is less than or equal to 7
    if (days.length >= 7) {
      toast.error('Số ngày trong một tuần không được vượt quá 7')
      return
    }

    const newDayIndex = days.length
    form.setValue(`weeks.${weekIndex}.days`, [
      ...days,
      {
        day_number: days.length + 1,
        description: '',
        circuits: [
          {
            name: 'Circuit 1',
            description: '',
            auto_replay_count: 1,
            circuit_exercises: [],
          },
        ],
      },
    ])
    // Automatically select the new day
    setSelectedDayIndex(newDayIndex)
  }

  // Function to add a new circuit to a specific day
  const addCircuit = (weekIndex: number, dayIndex: number) => {
    const circuits = form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits`) || []
    form.setValue(`weeks.${weekIndex}.days.${dayIndex}.circuits`, [
      ...circuits,
      {
        name: `Circuit ${circuits.length + 1}`,
        description: '',
        circuit_exercises: [],
        auto_replay_count: 1,
      },
    ])
  }

  // Function to remove an exercise
  const removeExercise = (weekIndex: number, dayIndex: number, circuitIndex: number, exerciseIndex: number) => {
    const exercises =
      form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.circuit_exercises`) || []
    exercises.splice(exerciseIndex, 1)
    form.setValue(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.circuit_exercises`, exercises)
  }

  // Function to remove a circuit
  const removeCircuit = (weekIndex: number, dayIndex: number, circuitIndex: number) => {
    const circuits = form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits`) || []
    circuits.splice(circuitIndex, 1)

    // Reset the order numbers of circuits
    const updatedCircuits = circuits.map((circuit, index) => ({
      ...circuit,
      name: `Circuit ${index + 1}`,
    }))

    form.setValue(`weeks.${weekIndex}.days.${dayIndex}.circuits`, updatedCircuits)
  }

  // Function to remove a day
  const removeDay = (weekIndex: number, dayIndex: number) => {
    const days = form.getValues(`weeks.${weekIndex}.days`) || []
    days.splice(dayIndex, 1)

    // Reset the order numbers of days
    const updatedDays = days.map((day, index) => {
      // Reset day number
      const updatedDay = {
        ...day,
        day_number: index + 1,
      }

      // Reset circuit names within this day
      if (updatedDay.circuits && updatedDay.circuits.length > 0) {
        updatedDay.circuits = updatedDay.circuits.map((circuit, circuitIndex) => ({
          ...circuit,
          name: `Circuit ${circuitIndex + 1}`,
        }))
      }

      return updatedDay
    })

    form.setValue(`weeks.${weekIndex}.days`, updatedDays)

    // Update selected day if needed
    if (selectedDayIndex === dayIndex) {
      setSelectedDayIndex(updatedDays.length > 0 ? 0 : null)
    } else if (selectedDayIndex !== null && selectedDayIndex > dayIndex) {
      setSelectedDayIndex(selectedDayIndex - 1)
    }
  }

  // Function to remove a week
  const handleRemoveWeek = (weekIndex: number) => {
    if (weekFields.length > 1) {
      removeWeek(weekIndex)

      // Reset the order numbers of weeks
      const updatedWeeks = form.getValues('weeks') || []
      const reorderedWeeks = updatedWeeks.map((week, index) => {
        // Reset week number
        const updatedWeek = {
          ...week,
          week_number: index + 1,
        }

        // Reset day numbers within this week
        if (updatedWeek.days && updatedWeek.days.length > 0) {
          updatedWeek.days = updatedWeek.days.map((day, dayIndex) => {
            // Reset day number
            const updatedDay = {
              ...day,
              day_number: dayIndex + 1,
            }

            // Reset circuit names within this day
            if (updatedDay.circuits && updatedDay.circuits.length > 0) {
              updatedDay.circuits = updatedDay.circuits.map((circuit, circuitIndex) => ({
                ...circuit,
                name: `Circuit ${circuitIndex + 1}`,
              }))
            }

            return updatedDay
          })
        }

        return updatedWeek
      })

      form.setValue('weeks', reorderedWeeks)

      // Update selected week if needed
      if (selectedWeekIndex === weekIndex) {
        setSelectedWeekIndex(reorderedWeeks.length > 0 ? 0 : null)
        setSelectedDayIndex(reorderedWeeks.length > 0 && reorderedWeeks[0].days.length > 0 ? 0 : null)
      } else if (selectedWeekIndex !== null && selectedWeekIndex > weekIndex) {
        setSelectedWeekIndex(selectedWeekIndex - 1)
      }
    } else {
      toast.error('You must have at least one week')
    }
  }

  // Function to select a week
  const selectWeek = (weekIndex: number) => {
    setSelectedWeekIndex(weekIndex)
    setSelectedDayIndex(0) // Reset day selection when a new week is selected
  }

  // Function to select a day
  const selectDay = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex)
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <ImportDialog courseID={courseID} onSuccess={() => window.location.reload()} />
      </div>
      {isSubmitting && <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50" />}

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
            {/* Column-based layout for weeks, days, and circuits */}
            <div className="grid grid-cols-3 gap-4">
              {/* Weeks Column */}
              <div className="border-r pr-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Danh sách tuần</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addWeek}>
                    <Plus className="h-4 w-4 mr-1" /> Thêm tuần
                  </Button>
                </div>

                <div className="space-y-2">
                  {weekFields.map((week, weekIndex) => (
                    <div
                      key={week.id}
                      className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                        selectedWeekIndex === weekIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => selectWeek(weekIndex)}
                    >
                      <span className="truncate">Tuần {form.watch(`weeks.${weekIndex}.week_number`)}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveWeek(weekIndex)
                        }}
                        className={`h-8 w-8 p-0 ${
                          selectedWeekIndex === weekIndex ? 'text-primary-foreground' : 'text-destructive'
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Days Column */}
              <div className="border-r pr-4">
                {selectedWeekIndex !== null && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Danh sách ngày</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addDay(selectedWeekIndex)}
                        disabled={form.watch(`weeks.${selectedWeekIndex}.days`)?.length >= 7}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Thêm ngày
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {form.watch(`weeks.${selectedWeekIndex}.days`)?.map((day, dayIndex) => (
                        <div
                          key={`day-${selectedWeekIndex}-${dayIndex}`}
                          className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                            selectedDayIndex === dayIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => selectDay(dayIndex)}
                        >
                          <span className="truncate">
                            Ngày {form.watch(`weeks.${selectedWeekIndex}.days.${dayIndex}.day_number`)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (form.watch(`weeks.${selectedWeekIndex}.days`).length > 1) {
                                removeDay(selectedWeekIndex, dayIndex)
                              } else {
                                toast.error('You must have at least one day')
                              }
                            }}
                            className={`h-8 w-8 p-0 ${
                              selectedDayIndex === dayIndex ? 'text-primary-foreground' : 'text-destructive'
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Circuits Column with Exercises */}
              <div>
                {selectedWeekIndex !== null && selectedDayIndex !== null && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Danh sách Circuit</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCircuit(selectedWeekIndex, selectedDayIndex)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Circuit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {form
                        .watch(`weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits`)
                        ?.map((circuit, circuitIndex) => (
                          <Card key={`circuit-${selectedWeekIndex}-${selectedDayIndex}-${circuitIndex}`}>
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-md">
                                  {form.watch(
                                    `weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.name`
                                  )}
                                </CardTitle>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (
                                      form.watch(`weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits`)
                                        .length > 1
                                    ) {
                                      removeCircuit(selectedWeekIndex, selectedDayIndex, circuitIndex)
                                    } else {
                                      toast.error('You must have at least one circuit')
                                    }
                                  }}
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
                                  name={`weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.name`}
                                  label="Circuit Name"
                                  withAsterisk
                                  placeholder="Enter circuit name"
                                />
                                <FormTextareaField
                                  form={form}
                                  name={`weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.description`}
                                  label="Circuit Description"
                                  placeholder="Enter circuit description"
                                />
                                <FormInputField
                                  form={form}
                                  name={`weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.auto_replay_count`}
                                  label="Số lần phát lại tự động"
                                  type="number"
                                  min={1}
                                  placeholder="Enter auto replay count"
                                />

                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="exercises">
                                    <AccordionTrigger className="py-2">
                                      <div className="flex items-center">
                                        <span>Danh sách bài tập</span>
                                        <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                                          {form.watch(
                                            `weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.circuit_exercises`
                                          )?.length || 0}
                                        </span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div className="pt-2 space-y-2">
                                        <div className="flex justify-end mb-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              addExercise(selectedWeekIndex, selectedDayIndex, circuitIndex)
                                            }
                                          >
                                            <Plus className="h-4 w-4 mr-1" /> Thêm bài tập
                                          </Button>
                                        </div>

                                        <div className="space-y-2">
                                          {form.watch(
                                            `weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.circuit_exercises`
                                          )?.length > 0 ? (
                                            form
                                              .watch(
                                                `weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.circuit_exercises`
                                              )
                                              ?.map((exercise, exerciseIndex) => (
                                                <Card
                                                  key={`exercise-${selectedWeekIndex}-${selectedDayIndex}-${circuitIndex}-${exerciseIndex}`}
                                                  className="group border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200"
                                                >
                                                  <CardHeader className="p-4 pb-2">
                                                    <div className="flex justify-between items-start gap-4">
                                                      <div>
                                                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                                          {exercise.circuit_exercise_title}
                                                        </CardTitle>
                                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                          {exercise.circuit_exercise_description || 'Chưa có mô tả'}
                                                        </p>
                                                      </div>
                                                      <div className="flex gap-2">
                                                        <Button
                                                          type="button"
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() =>
                                                            editExercise(
                                                              selectedWeekIndex!,
                                                              selectedDayIndex!,
                                                              circuitIndex,
                                                              exerciseIndex,
                                                              exercise
                                                            )
                                                          }
                                                          className="h-8 w-8"
                                                        >
                                                          <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                                        </Button>
                                                        <Button
                                                          type="button"
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() =>
                                                            removeExercise(
                                                              selectedWeekIndex!,
                                                              selectedDayIndex!,
                                                              circuitIndex,
                                                              exerciseIndex
                                                            )
                                                          }
                                                          className="h-8 w-8"
                                                        >
                                                          <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  </CardHeader>
                                                  <CardContent className="p-4 pt-2 grid gap-4">
                                                    <div className="flex items-center gap-2 text-sm">
                                                      <svg
                                                        className="h-4 w-4 text-muted-foreground"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                      >
                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                        />
                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                      </svg>
                                                      {exercise.youtube_url ? (
                                                        <a
                                                          href={exercise.youtube_url}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className="text-primary hover:underline inline-flex items-center gap-1 flex-1 truncate"
                                                        >
                                                          Link video youtube
                                                        </a>
                                                      ) : (
                                                        <span className="text-muted-foreground">Chưa có video</span>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                      <svg
                                                        className="h-4 w-4 text-muted-foreground"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                      >
                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                      </svg>
                                                      <span>
                                                        Phát lại <strong>{exercise.no}</strong> lần
                                                      </span>
                                                    </div>
                                                  </CardContent>
                                                </Card>
                                              ))
                                          ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                              No exercises added yet.
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <MainButton text="Lưu cấu trúc khóa học" disabled={isSubmitting} className="w-full" />
          </form>
        </Form>
      )}

      {/* Exercise Dialog */}
      <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingExerciseIndex !== null ? 'Chỉnh sửa bài tập' : 'Thêm bài tập mới'}</DialogTitle>
            <DialogDescription>Fill in the details for the new exercise.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="exercise-name">Tên bài tập</Label>
                <Input
                  id="exercise-name"
                  placeholder="Enter exercise name"
                  defaultValue={editingExerciseData?.circuit_exercise_title || ''}
                />
              </div>
              <div>
                <Label htmlFor="exercise-description">Mô tả (Tùy chọn)</Label>
                <Textarea
                  id="exercise-description"
                  placeholder="Enter exercise description"
                  defaultValue={editingExerciseData?.circuit_exercise_description || ''}
                />
              </div>
              <div>
                <Label htmlFor="exercise-video">Video URL (Tùy chọn)</Label>
                <Input
                  id="exercise-video"
                  placeholder="Enter video URL"
                  defaultValue={editingExerciseData?.youtube_url || ''}
                />
              </div>
              <div>
                <Label htmlFor="exercise-auto-replay-count">Số lần phát lại tự động (Tùy chọn)</Label>
                <Input
                  id="exercise-auto-replay-count"
                  placeholder="Enter auto replay count"
                  defaultValue={editingExerciseData?.no?.toString() || ''}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExerciseDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const circuitExerciseTitle = (document.getElementById('exercise-name') as HTMLInputElement).value
                const circuitExerciseDescription = (
                  document.getElementById('exercise-description') as HTMLTextAreaElement
                ).value
                const youtubeUrl = (document.getElementById('exercise-video') as HTMLInputElement).value
                const no = (document.getElementById('exercise-auto-replay-count') as HTMLInputElement).value

                if (!circuitExerciseTitle) {
                  toast.error('Exercise name is required')
                  return
                }

                if (editingExerciseIndex !== null) {
                  const { weekIndex, dayIndex, circuitIndex } = currentCircuitIndex!
                  const exercises =
                    form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.circuit_exercises`) ||
                    []
                  exercises[editingExerciseIndex] = {
                    circuit_exercise_title: circuitExerciseTitle,
                    circuit_exercise_description: circuitExerciseDescription,
                    youtube_url: youtubeUrl,
                    no: parseInt(no) || 1,
                  }
                  form.setValue(
                    `weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.circuit_exercises`,
                    exercises
                  )
                  setEditingExerciseIndex(null)
                  setEditingExerciseData(null)
                  setIsExerciseDialogOpen(false)
                } else {
                  handleAddExercise({
                    circuit_exercise_title: circuitExerciseTitle,
                    circuit_exercise_description: circuitExerciseDescription,
                    youtube_url: youtubeUrl,
                    no: parseInt(no) || 1,
                  })
                }
              }}
            >
              {editingExerciseIndex !== null ? 'Cập nhật' : 'Thêm bài tập'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
          const weekResponse = await createWeek(courseID, { week_number: w.week_number })

          for (const d of w.days) {
            const dayResponse = await createDay(courseID, weekResponse.data.id, {
              day_number: d.day_number,
              description: '',
            })

            for (const c of d.circuits) {
              await createCircuit(courseID, weekResponse.data.id, dayResponse.data.id, {
                name: c.name,
                description: c.description,
                auto_replay_count: c.auto_replay_count,
                circuit_exercises: c.circuit_exercises,
              })
            }
          }
        } catch (error) {
          console.error(`Error processing week ${w.week_number}:`, error)
          throw error
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
        <MainButton text="Nhập khoá tập" icon={ImportIcon} variant="outline" />
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
        {data.length > 0 && <MainButton text="Nhập khoá tập" className="mt-4" onClick={onSubmit} />}
      </DialogContent>
    </Dialog>
  )
}
