'use client'

import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Save, Download } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { htmlToText } from '@/utils/helpers'
import { Form } from '@/components/ui/form'

import { getConfiguration, queryKeyConfigurations, updateConfiguration } from '@/network/client/configurations'
import { getBodyQuizzes, queryKeyBodyQuizzes } from '@/network/client/body-quizzes'
import type { Configuration } from '@/models/configuration'
import type { BodyQuiz } from '@/models/body-quiz'
import { MealPlansTable } from '@/components/data-table/meal-plans-table'
import { DialogEdit } from '@/components/dialogs/dialog-edit'
import { MealPlan } from '@/models/meal-plan'

type Goal = 'Giảm cân' | 'Tăng cơ giảm mỡ' | 'Tăng cân tăng cơ'

interface CalorieRange {
  min?: number
  max?: number
}

const configurationID = 5

// Schema for meal plan configuration data
const mealPlanConfigSchema = z.array(
  z.object({
    id: z.string(),
    goal: z.enum(['Giảm cân', 'Tăng cơ giảm mỡ', 'Tăng cân tăng cơ']).optional(),
    calorie_range: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }),
    is_postpartum: z.boolean(),
    meal_plan: z
      .object({
        id: z.number(),
        title: z.string(),
        assets: z.any().optional(),
      })
      .optional(),
    created_at: z.string(),
  })
)

const formSchema = z.object({
  applied_quiz: z.object({
    quiz_id: z.string(),
    input_mapping: z.object({
      weight: z.string(), // map to question ID for weight
      height: z.string(), // map to question ID for height
      age: z.string(), // map to question ID for age
      is_postpartum: z.string(), // map to question ID for postpartum
    }),
  }),
  meal_plan_config: mealPlanConfigSchema,
})

type FormValue = z.infer<typeof formSchema>

export default function MealPlanConfigPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [queryKeyConfigurations, configurationID],
    queryFn: () => getConfiguration(configurationID),
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center align-center justify-center">
        <Spinner className="bg-ring dark:bg-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center align-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    )
  }

  return (
    <ContentLayout title="Cấu Hình Thực Đơn">
      <EditMealPlanConfigForm data={data?.data} onSuccess={refetch} />
    </ContentLayout>
  )
}

interface EditMealPlanConfigFormProps {
  data?: Configuration
  onSuccess?: () => void
}

function EditMealPlanConfigForm({ data, onSuccess }: EditMealPlanConfigFormProps) {
  if (!data) {
    return <p className="text-destructive">Không tìm thấy dữ liệu</p>
  }

  const [openMealPlansTable, setOpenMealPlansTable] = useState(false)

  // Fetch body quizzes
  const { data: bodyQuizzesData } = useQuery({
    queryKey: [queryKeyBodyQuizzes],
    queryFn: () => getBodyQuizzes(),
  })

  const bodyQuizzes = bodyQuizzesData?.data || []

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: data.data || {
      applied_quiz: {
        quiz_id: '',
        input_mapping: {
          weight: '',
          height: '',
          age: '',
          is_postpartum: '',
        },
      },
      meal_plan_config: [],
    },
  })

  const configurationMutation = useMutation({
    mutationFn: (values: FormValue) => updateConfiguration(data.id, { ...data, data: values }),
    onSettled(responseData, error) {
      if (responseData?.status === 'success') {
        toast.success('Cập nhật thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    configurationMutation.mutate(values)
  }

  // Get current configurations from form data
  const configurations = form.watch('meal_plan_config') || []

  // Get selected quiz to show its questions
  const selectedQuizId = form.watch('applied_quiz.quiz_id')
  const selectedQuiz = bodyQuizzes.find((quiz: BodyQuiz) => quiz.id.toString() === selectedQuizId)

  const [selectedMealPlans, setSelectedMealPlans] = useState<MealPlan[]>([])
  const [currentConfig, setCurrentConfig] = useState({
    goal: undefined as Goal | undefined,
    calorieRange: {} as CalorieRange,
    isPostpartum: false,
  })

  const goals: Goal[] = ['Giảm cân', 'Tăng cơ giảm mỡ', 'Tăng cân tăng cơ']

  const handleAddConfiguration = async () => {
    if (!selectedMealPlans.length) {
      alert('Vui lòng chọn ít nhất một thực đơn')
      return
    }

    // For postpartum users, goal is not required (system will auto-determine)
    // For non-postpartum users, goal is required
    if (!currentConfig.isPostpartum && !currentConfig.goal) {
      alert('Vui lòng chọn mục tiêu')
      return
    }

    if (!currentConfig.calorieRange?.min && !currentConfig.calorieRange?.max) {
      alert('Vui lòng nhập ít nhất một giá trị calorie')
      return
    }

    // Create new configuration
    const newConfig = {
      id: Date.now().toString(),
      goal: currentConfig.isPostpartum ? 'Tăng cơ giảm mỡ' : currentConfig.goal, // Auto-set goal for postpartum
      calorie_range: {
        min: currentConfig.calorieRange?.min,
        max: currentConfig.calorieRange?.max,
      },
      is_postpartum: currentConfig.isPostpartum || false,
      meal_plan: selectedMealPlans[0]
        ? {
            id: selectedMealPlans[0].id,
            title: selectedMealPlans[0].title,
            assets: selectedMealPlans[0].assets,
          }
        : undefined,
      created_at: new Date().toISOString(),
    }

    // Add to configurations array
    const updatedConfigurations = [...configurations, newConfig]

    // Update form data first
    form.setValue('meal_plan_config', updatedConfigurations, { shouldDirty: true })

    // Update form data and call API
    const formValues: FormValue = {
      applied_quiz: form.getValues('applied_quiz'),
      meal_plan_config: updatedConfigurations,
    }

    // Call API update directly
    configurationMutation.mutate(formValues)

    // Reset form
    setCurrentConfig({
      goal: undefined,
      calorieRange: {},
      isPostpartum: false,
    })
    setSelectedMealPlans([])
  }

  const handleDeleteConfiguration = async (id: string) => {
    const updatedConfigurations = configurations.filter((config: any) => config.id !== id)

    // Update form data first
    form.setValue('meal_plan_config', updatedConfigurations, { shouldDirty: true })

    // Update form data and call API
    const formValues: FormValue = {
      applied_quiz: form.getValues('applied_quiz'),
      meal_plan_config: updatedConfigurations,
    }

    // Call API update directly
    configurationMutation.mutate(formValues)
  }

  const handleSaveQuizMapping = async () => {
    const appliedQuiz = form.getValues('applied_quiz')

    if (!appliedQuiz.quiz_id) {
      toast.error('Vui lòng chọn quiz')
      return
    }

    const { weight, height, age, is_postpartum } = appliedQuiz.input_mapping
    if (!weight || !height || !age || !is_postpartum) {
      toast.error('Vui lòng ánh xạ tất cả câu hỏi')
      return
    }

    // Update form data and call API
    const formValues: FormValue = {
      applied_quiz: appliedQuiz,
      meal_plan_config: configurations,
    }

    // Call API update directly
    configurationMutation.mutate(formValues)
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="container mx-auto p-6 space-y-6">
            {/* Quiz Selection & Mapping Section */}
            <Card>
              <CardHeader>
                <CardTitle>Chọn Quiz và Ánh Xạ Câu Hỏi</CardTitle>
                <CardDescription>Chọn quiz để ánh xạ các câu hỏi cần thiết cho cấu hình thực đơn.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quiz Selection */}
                <div className="space-y-2">
                  <Label htmlFor="quiz">Chọn Quiz</Label>
                  <Select
                    value={form.watch('applied_quiz.quiz_id') || ''}
                    onValueChange={(value) => form.setValue('applied_quiz.quiz_id', value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quiz để ánh xạ" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyQuizzes.map((quiz: BodyQuiz) => (
                        <SelectItem key={quiz.id} value={quiz.id.toString()}>
                          {quiz.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Mapping */}
                {selectedQuiz && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Weight Mapping */}
                    <div className="space-y-2">
                      <Label htmlFor="weightMapping">Câu hỏi về Cân nặng</Label>
                      <Select
                        value={form.watch('applied_quiz.input_mapping.weight') || ''}
                        onValueChange={(value) =>
                          form.setValue('applied_quiz.input_mapping.weight', value, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn câu hỏi cân nặng" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedQuiz.questions?.map((question) => (
                            <SelectItem key={question.id} value={question.id.toString()}>
                              {htmlToText(question.title)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Height Mapping */}
                    <div className="space-y-2">
                      <Label htmlFor="heightMapping">Câu hỏi về Chiều cao</Label>
                      <Select
                        value={form.watch('applied_quiz.input_mapping.height') || ''}
                        onValueChange={(value) =>
                          form.setValue('applied_quiz.input_mapping.height', value, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn câu hỏi chiều cao" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedQuiz.questions?.map((question) => (
                            <SelectItem key={question.id} value={question.id.toString()}>
                              {htmlToText(question.title)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Age Mapping */}
                    <div className="space-y-2">
                      <Label htmlFor="ageMapping">Câu hỏi về Tuổi</Label>
                      <Select
                        value={form.watch('applied_quiz.input_mapping.age') || ''}
                        onValueChange={(value) =>
                          form.setValue('applied_quiz.input_mapping.age', value, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn câu hỏi tuổi" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedQuiz.questions?.map((question) => (
                            <SelectItem key={question.id} value={question.id.toString()}>
                              {htmlToText(question.title)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Postpartum Mapping */}
                    <div className="space-y-2">
                      <Label htmlFor="postpartumMapping">Câu hỏi về Sau sinh</Label>
                      <Select
                        value={form.watch('applied_quiz.input_mapping.is_postpartum') || ''}
                        onValueChange={(value) =>
                          form.setValue('applied_quiz.input_mapping.is_postpartum', value, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn câu hỏi sau sinh" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedQuiz.questions?.map((question) => (
                            <SelectItem key={question.id} value={question.id.toString()}>
                              {htmlToText(question.title)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Save Quiz Mapping Button */}
                {selectedQuiz && (
                  <Button
                    onClick={handleSaveQuizMapping}
                    className="w-full mt-4"
                    disabled={configurationMutation.isPending}
                    variant="outline"
                  >
                    {configurationMutation.isPending ? (
                      <Spinner className="h-4 w-4 mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {configurationMutation.isPending ? 'Đang lưu...' : 'Lưu Ánh Xạ Quiz'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Configuration Form */}
            <Card>
              <CardHeader>
                <CardTitle>Thêm Cấu Hình Mới</CardTitle>
                <CardDescription>Bắt đầu với việc chọn thực đơn để có thể tạo cấu hình phù hợp.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Menu Selection First */}
                <div className="space-y-2">
                  <Label>Chọn Thực Đơn</Label>
                  <Input
                    value={selectedMealPlans.map((e) => e.title).join(', ')}
                    onFocus={() => setOpenMealPlansTable(true)}
                    placeholder="Chọn thực đơn trước để thiết lập cấu hình"
                    readOnly
                  />
                </div>

                {/* Configuration Fields - Only show after meal plan is selected */}
                {selectedMealPlans.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Postpartum Switch First */}
                    <div className="space-y-2">
                      <Label htmlFor="postpartum">Sau Sinh</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="postpartum"
                          checked={currentConfig.isPostpartum || false}
                          onCheckedChange={(checked) =>
                            setCurrentConfig({
                              ...currentConfig,
                              isPostpartum: checked,
                              // Reset goal when switching postpartum status
                              goal: undefined,
                            })
                          }
                        />
                        <Label htmlFor="postpartum" className="text-sm">
                          {currentConfig.isPostpartum ? 'Có' : 'Không'}
                        </Label>
                      </div>
                      {currentConfig.isPostpartum && (
                        <p className="text-xs text-blue-600 mt-1">
                          * Đối với phụ nữ sau sinh, hệ thống sẽ tự động xác định mục tiêu phù hợp
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Goal Selection - Hide if postpartum */}
                      {!currentConfig.isPostpartum && (
                        <div className="space-y-2">
                          <Label htmlFor="goal">Mục Tiêu</Label>
                          <Select
                            value={currentConfig.goal || ''}
                            onValueChange={(value) => setCurrentConfig({ ...currentConfig, goal: value as Goal })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn mục tiêu" />
                            </SelectTrigger>
                            <SelectContent>
                              {goals.map((goal) => (
                                <SelectItem key={goal} value={goal}>
                                  {goal}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Calorie Min */}
                      <div className="space-y-2">
                        <Label htmlFor="calorieMin">Calorie Tối Thiểu</Label>
                        <Input
                          id="calorieMin"
                          type="number"
                          placeholder="VD: 1200"
                          value={currentConfig.calorieRange?.min || ''}
                          onChange={(e) =>
                            setCurrentConfig({
                              ...currentConfig,
                              calorieRange: {
                                ...currentConfig.calorieRange,
                                min: e.target.value ? parseInt(e.target.value) : undefined,
                              },
                            })
                          }
                        />
                      </div>

                      {/* Calorie Max */}
                      <div className="space-y-2">
                        <Label htmlFor="calorieMax">Calorie Tối Đa</Label>
                        <Input
                          id="calorieMax"
                          type="number"
                          placeholder="VD: 1800"
                          value={currentConfig.calorieRange?.max || ''}
                          onChange={(e) =>
                            setCurrentConfig({
                              ...currentConfig,
                              calorieRange: {
                                ...currentConfig.calorieRange,
                                max: e.target.value ? parseInt(e.target.value) : undefined,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Selected Meal Plan Preview */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {selectedMealPlans[0]?.assets?.thumbnail && (
                          <img
                            src={selectedMealPlans[0].assets.thumbnail}
                            alt={selectedMealPlans[0].title}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-sm">{selectedMealPlans[0]?.title}</h4>
                          <p className="text-xs text-gray-500">Thực đơn đã chọn</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddConfiguration}
                  className="w-full"
                  disabled={configurationMutation.isPending || selectedMealPlans.length === 0}
                >
                  {configurationMutation.isPending ? (
                    <Spinner className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {configurationMutation.isPending ? 'Đang thêm...' : 'Thêm Cấu Hình'}
                </Button>
              </CardContent>
            </Card>

            {/* Section 2: Configurations List */}
            <Card>
              <CardHeader>
                <CardTitle>Danh Sách Cấu Hình ({configurations.length})</CardTitle>
                <CardDescription>
                  Quản lý các cấu hình thực đơn dựa trên mục tiêu, calorie và các yếu tố khác.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {configurations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Chưa có cấu hình nào. Thêm cấu hình đầu tiên của bạn!
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {configurations.map((config) => (
                      <div
                        key={config.id}
                        className="relative p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConfiguration(config.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {/* Meal Plan Image */}
                        {config.meal_plan?.assets?.thumbnail && (
                          <div className="mb-3">
                            <img
                              src={config.meal_plan.assets.thumbnail}
                              alt={config.meal_plan.title}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                        )}

                        {/* Configuration Details */}
                        <div className="space-y-3">
                          {/* Goal */}
                          {!config.is_postpartum && (
                            <div>
                              <Badge variant="default" className="text-sm">
                                {config.goal}
                              </Badge>
                            </div>
                          )}

                          {/* Postpartum */}
                          {config.is_postpartum && (
                            <div>
                              <Badge variant="secondary" className="text-xs">
                                Sau Sinh
                              </Badge>
                            </div>
                          )}

                          {/* Meal Plan Title */}
                          {config.meal_plan?.title && (
                            <div>
                              <h4 className="font-medium text-gray-900 truncate">{config.meal_plan.title}</h4>
                            </div>
                          )}

                          {/* Calorie Range */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Calorie:</span>
                            <span className="text-sm font-medium">
                              {config.calorie_range.min && config.calorie_range.max
                                ? `${config.calorie_range.min}-${config.calorie_range.max}`
                                : config.calorie_range.min
                                ? `≥${config.calorie_range.min}`
                                : config.calorie_range.max
                                ? `≤${config.calorie_range.max}`
                                : 'Chưa có'}
                            </span>
                          </div>

                          {/* Created Date */}
                          <div className="text-xs text-gray-400 pt-2 border-t">
                            Tạo: {new Date(config.created_at).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
      <DialogEdit
        title="Chọn Thực đơn"
        description="Chọn một hoặc nhiều thực đơn đã có hoặc tạo mới để liên kết với cấu hình này."
        open={openMealPlansTable}
        onOpenChange={setOpenMealPlansTable}
      >
        <MealPlansTable
          onConfirmRowSelection={(row) => {
            setSelectedMealPlans(row)
            setOpenMealPlansTable(false)
          }}
        />
      </DialogEdit>
    </>
  )
}
