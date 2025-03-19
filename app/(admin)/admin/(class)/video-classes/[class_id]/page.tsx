'use client'

import { useState } from 'react'
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
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
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

// Define the schema for exercise
const exerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Exercise name is required' }),
  description: z.string().optional(),
  duration: z.string().optional(),
  reps: z.string().optional(),
  sets: z.string().optional(),
  youtube_link: z.string().optional(),
  image_url: z.string().optional(),
  auto_replay_count: z.number().min(0).default(0).optional(),
})

// Define the schema for circuit
const circuitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Circuit name is required' }),
  description: z.string().optional(),
  auto_replay_count: z.number().min(0).default(0).optional(),
  exercises: z.array(exerciseSchema),
})

// Define the schema for day
const daySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Day name is required' }),
  description: z.string().optional(),
  circuits: z.array(circuitSchema),
})

// Define the schema for week
const weekSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Week name is required' }),
  description: z.string().optional(),
  days: z.array(daySchema),
})

// Define the schema for the entire course structure
const courseStructureSchema = z.object({
  description: z.string().optional(),
  weeks: z.array(weekSchema),
})

type CourseStructureFormData = z.infer<typeof courseStructureSchema>

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateCourseForm } from '@/components/forms/create-course-form'

export default function VideoClassPage() {
  // export default async function VideoClassPage({ params }: { params: Promise<{ class_id: string }> }) {
  // const { class_id } = await params
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('details')
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false)
  const [currentCircuitIndex, setCurrentCircuitIndex] = useState<{
    weekIndex: number
    dayIndex: number
    circuitIndex: number
  } | null>(null)

  // State for tracking selected items in each column
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(0)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0)

  // Initialize form with default values
  const form = useForm<CourseStructureFormData>({
    resolver: zodResolver(courseStructureSchema),
    defaultValues: {
      description: '',
      weeks: [
        {
          name: 'Tuần 1',
          description: '',
          days: [
            {
              name: 'Ngày 1',
              description: '',
              circuits: [
                {
                  name: 'Circuit 1',
                  description: '',
                  auto_replay_count: 0,
                  exercises: [],
                },
              ],
            },
          ],
        },
      ],
    },
  })

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
  const onSubmit = async (data: CourseStructureFormData) => {
    try {
      console.log('Form data:', data)
      // Here you would typically send the data to your API
      // await updateCourseStructure(params.class_id as string, data)
      toast.success('Course structure updated successfully')
    } catch (error) {
      console.error('Error updating course structure:', error)
      toast.error('Failed to update course structure')
    }
  }

  // Function to add a new exercise to a specific circuit
  const addExercise = (weekIndex: number, dayIndex: number, circuitIndex: number) => {
    setCurrentCircuitIndex({ weekIndex, dayIndex, circuitIndex })
    setIsExerciseDialogOpen(true)
  }

  // Function to handle adding the exercise from the dialog
  const handleAddExercise = (exercise: z.infer<typeof exerciseSchema>) => {
    if (!currentCircuitIndex) return

    const { weekIndex, dayIndex, circuitIndex } = currentCircuitIndex
    const exercises = form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.exercises`) || []

    form.setValue(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.exercises`, [...exercises, exercise])

    setIsExerciseDialogOpen(false)
  }

  // Function to add a new week
  const addWeek = () => {
    const newWeekIndex = weekFields.length
    appendWeek({
      name: `Tuần ${newWeekIndex + 1}`,
      description: '',
      days: [
        {
          name: 'Ngày 1',
          description: '',
          circuits: [
            {
              name: 'Circuit 1',
              description: '',
              auto_replay_count: 0,
              exercises: [],
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
    const newDayIndex = days.length
    form.setValue(`weeks.${weekIndex}.days`, [
      ...days,
      {
        name: `Ngày ${days.length + 1}`,
        description: '',
        circuits: [
          {
            name: 'Circuit 1',
            description: '',
            auto_replay_count: 0,
            exercises: [],
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
        exercises: [],
      },
    ])
  }

  // Function to remove an exercise
  const removeExercise = (weekIndex: number, dayIndex: number, circuitIndex: number, exerciseIndex: number) => {
    const exercises = form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.exercises`) || []
    exercises.splice(exerciseIndex, 1)
    form.setValue(`weeks.${weekIndex}.days.${dayIndex}.circuits.${circuitIndex}.exercises`, exercises)
  }

  // Function to remove a circuit
  const removeCircuit = (weekIndex: number, dayIndex: number, circuitIndex: number) => {
    const circuits = form.getValues(`weeks.${weekIndex}.days.${dayIndex}.circuits`) || []
    circuits.splice(circuitIndex, 1)
    form.setValue(`weeks.${weekIndex}.days.${dayIndex}.circuits`, circuits)
  }

  // Function to remove a day
  const removeDay = (weekIndex: number, dayIndex: number) => {
    const days = form.getValues(`weeks.${weekIndex}.days`) || []
    days.splice(dayIndex, 1)
    form.setValue(`weeks.${weekIndex}.days`, days)

    // Update selected day if needed
    if (selectedDayIndex === dayIndex) {
      setSelectedDayIndex(days.length > 1 ? 0 : null)
    } else if (selectedDayIndex !== null && selectedDayIndex > dayIndex) {
      setSelectedDayIndex(selectedDayIndex - 1)
    }
  }

  // Function to remove a week
  const handleRemoveWeek = (weekIndex: number) => {
    if (weekFields.length > 1) {
      removeWeek(weekIndex)

      // Update selected week if needed
      if (selectedWeekIndex === weekIndex) {
        setSelectedWeekIndex(0)
        setSelectedDayIndex(0)
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
    <ContentLayout title="Video Class">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Edit Video Class</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="structure">Course Structure</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Basic Details</CardTitle>
                <CardDescription>Edit the basic information about this video class.</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateCourseForm format="video" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle>Course Structure</CardTitle>
                <CardDescription>Organize your course into weeks, days, circuits, and exercises.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Column-based layout for weeks, days, and circuits */}
                    <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
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
                                selectedWeekIndex === weekIndex
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => selectWeek(weekIndex)}
                            >
                              <span className="truncate">{form.watch(`weeks.${weekIndex}.name`)}</span>
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
                              >
                                <Plus className="h-4 w-4 mr-1" /> Thêm ngày
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {form.watch(`weeks.${selectedWeekIndex}.days`)?.map((day, dayIndex) => (
                                <div
                                  key={`day-${selectedWeekIndex}-${dayIndex}`}
                                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                                    selectedDayIndex === dayIndex
                                      ? 'bg-primary text-primary-foreground'
                                      : 'hover:bg-muted/50'
                                  }`}
                                  onClick={() => selectDay(dayIndex)}
                                >
                                  <span className="truncate">
                                    {form.watch(`weeks.${selectedWeekIndex}.days.${dayIndex}.name`)}
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
                                          placeholder="Enter auto replay count"
                                        />

                                        <Accordion type="single" collapsible className="w-full">
                                          <AccordionItem value="exercises">
                                            <AccordionTrigger className="py-2">
                                              <div className="flex items-center">
                                                <span>Danh sách bài tập</span>
                                                <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                                                  {form.watch(
                                                    `weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.exercises`
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
                                                    `weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.exercises`
                                                  )?.length > 0 ? (
                                                    form
                                                      .watch(
                                                        `weeks.${selectedWeekIndex}.days.${selectedDayIndex}.circuits.${circuitIndex}.exercises`
                                                      )
                                                      .map((exercise, exerciseIndex) => (
                                                        <Card
                                                          key={`exercise-${selectedWeekIndex}-${selectedDayIndex}-${circuitIndex}-${exerciseIndex}`}
                                                          className="relative"
                                                        >
                                                          <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                              removeExercise(
                                                                selectedWeekIndex,
                                                                selectedDayIndex,
                                                                circuitIndex,
                                                                exerciseIndex
                                                              )
                                                            }
                                                            className="absolute top-2 right-2 h-8 w-8 p-0"
                                                          >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                          </Button>
                                                          <CardContent className="p-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                              <div>
                                                                <Label className="text-sm font-medium">
                                                                  Tên bài tập
                                                                </Label>
                                                                <p className="text-sm">{exercise.name}</p>
                                                              </div>
                                                              {exercise.sets && (
                                                                <div>
                                                                  <Label className="text-sm font-medium">Sets</Label>
                                                                  <p className="text-sm">{exercise.sets}</p>
                                                                </div>
                                                              )}
                                                              {exercise.reps && (
                                                                <div>
                                                                  <Label className="text-sm font-medium">Reps</Label>
                                                                  <p className="text-sm">{exercise.reps}</p>
                                                                </div>
                                                              )}
                                                              {exercise.duration && (
                                                                <div>
                                                                  <Label className="text-sm font-medium">
                                                                    Duration
                                                                  </Label>
                                                                  <p className="text-sm">{exercise.duration}</p>
                                                                </div>
                                                              )}
                                                            </div>
                                                            {exercise.description && (
                                                              <div className="mt-2">
                                                                <Label className="text-sm font-medium">
                                                                  Description
                                                                </Label>
                                                                <p className="text-sm">{exercise.description}</p>
                                                              </div>
                                                            )}
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

                    <MainButton text="Lưu cấu trúc khóa học" className="w-full" />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Exercise Dialog */}
        <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm bài tập mới</DialogTitle>
              <DialogDescription>Fill in the details for the new exercise.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="exercise-name">Tên bài tập</Label>
                  <Input id="exercise-name" placeholder="Enter exercise name" />
                </div>
                <div>
                  <Label htmlFor="exercise-description">Mô tả (Tùy chọn)</Label>
                  <Textarea id="exercise-description" placeholder="Enter exercise description" />
                </div>
                <div>
                  <Label htmlFor="exercise-video">Video URL (Tùy chọn)</Label>
                  <Input id="exercise-video" placeholder="Enter video URL" />
                </div>
                <div>
                  <Label htmlFor="exercise-auto-replay-count">Số lần phát lại tự động (Tùy chọn)</Label>
                  <Input id="exercise-auto-replay-count" placeholder="Enter auto replay count" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExerciseDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const name = (document.getElementById('exercise-name') as HTMLInputElement).value
                  const description = (document.getElementById('exercise-description') as HTMLTextAreaElement).value
                  const sets = (document.getElementById('exercise-sets') as HTMLInputElement).value
                  const reps = (document.getElementById('exercise-reps') as HTMLInputElement).value
                  const duration = (document.getElementById('exercise-duration') as HTMLInputElement).value
                  const video_url = (document.getElementById('exercise-video') as HTMLInputElement).value
                  const auto_replay_count = (document.getElementById('exercise-auto-replay-count') as HTMLInputElement)
                    .value

                  if (!name) {
                    toast.error('Exercise name is required')
                    return
                  }

                  handleAddExercise({
                    name,
                    description,
                    sets,
                    reps,
                    duration,
                    youtube_link: video_url,
                    auto_replay_count: parseInt(auto_replay_count) || 0,
                  })
                }}
              >
                Add Exercise
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  )
}
