'use client'

import type { BodyQuiz, Question } from '@/models/body-quiz'

import { toast } from 'sonner'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, FileQuestion, GripVertical, AlertCircle, Upload } from 'lucide-react'

import { sortByKey } from '@/utils/helpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HTMLRenderer } from '@/components/html-renderer'
import { AddButton } from '@/components/buttons/add-button'
import { MainButton } from '@/components/buttons/main-button'
import { SheetEdit } from '@/components/dialogs/sheet-edit'
import { EditQuestionForm } from '@/components/forms/edit-question-form'
import { EditBodyQuizForm } from '@/components/forms/edit-body-quiz-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteQuestion, getBodyQuiz, queryKeyBodyQuizzes, updateBodyQuiz } from '@/network/client/body-quizzes'

export function BodyQuizView({ quizID }: { quizID: BodyQuiz['id'] }) {
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  // const [deleteQuestion, setDeleteQuestion] = useState<Question | null>(null)

  const router = useRouter()
  // const queryClient = useQueryClient()

  // Queries
  const {
    data: quiz,
    isLoading: isQuizLoading,
    refetch: quizRefetch,
  } = useQuery({
    queryKey: [queryKeyBodyQuizzes, quizID],
    queryFn: () => getBodyQuiz(quizID),
  })

  const quizData = quiz?.data || null
  const sortedQuestions = sortByKey(quizData?.questions || [], 'created_at', { transform: (val) => new Date(val).getTime() })

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setShowQuestionForm(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setShowQuestionForm(true)
  }

  const handleDeleteQuestion = (question: Question) => {
    // setDeleteQuestion(question)
    const deletePromise = () => deleteQuestion(question.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        quizRefetch()
        return 'Xoá câu hỏi thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const handleEditQuiz = () => {
    setShowQuizForm(true)
  }

  const handleBackToQuizzes = () => {
    router.push('/quizzes')
  }

  const getQuestionTypeColor = (type: Question['question_type']) => {
    switch (type) {
      case 'SINGLE_CHOICE':
        return 'bg-blue-100 text-blue-800'
      case 'MULTIPLE_CHOICE':
        return 'bg-purple-100 text-purple-800'
      case 'SHORT_ANSWER':
        return 'bg-green-100 text-green-800'
      case 'IMAGE_UPLOAD':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {isQuizLoading ? (
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      ) : quizData ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{quizData.title}</h1>
              <p className="text-muted-foreground">{quizData.description}</p>
            </div>
            <div className="flex gap-2">
              <MainButton variant="outline" onClick={handleEditQuiz} icon={Edit} text="Chỉnh sửa quiz" />
              <AddButton onClick={handleAddQuestion} text="Thêm câu hỏi" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Câu hỏi</CardTitle>
              <CardDescription>{sortedQuestions.length} câu hỏi trong quiz này</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
                  <p className="text-muted-foreground mb-4">Thêm câu hỏi đầu tiên của bạn để bắt đầu</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {sortedQuestions.map((question, index) => (
                      <Card key={question.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Q{index + 1}.</span>
                                  <Badge variant="outline" className={getQuestionTypeColor(question.question_type)}>
                                    {question.question_type}
                                  </Badge>
                                  {question.is_required && (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <MainButton
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleEditQuestion(question)}
                                    icon={Edit}
                                  />
                                  <MainButton
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteQuestion(question)}
                                    icon={Trash2}
                                    className="hover:text-destructive"
                                  />
                                </div>
                              </div>
                              <div className="mb-2">
                                <HTMLRenderer content={question.title} className="prose-sm" />
                              </div>

                              {(question.question_type === 'SINGLE_CHOICE' ||
                                question.question_type === 'MULTIPLE_CHOICE') && (
                                <div className="space-y-2 mt-3">
                                  {question.choices.map((choice, i) => (
                                    <div key={i} className="flex items-center">
                                      <div className="h-4 w-4 mr-2 border rounded-sm bg-muted" />
                                      <span>{choice}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {question.question_type === 'SHORT_ANSWER' && (
                                <div className="mt-3 p-2 border rounded-md bg-background">
                                  <p className="text-sm text-muted-foreground italic">
                                    Người dùng sẽ nhập câu trả lời tại đây
                                  </p>
                                </div>
                              )}

                              {question.question_type === 'IMAGE_UPLOAD' && (
                                <div className="mt-3 p-4 border-2 border-dashed border-muted rounded-md bg-background">
                                  <div className="flex flex-col items-center">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                      Người dùng sẽ tải lên hình ảnh tại đây
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Quiz not found</h3>
          <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist</p>
          <Button onClick={handleBackToQuizzes}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Button>
        </div>
      )}

      {/* Sheets and Forms */}
      <SheetEdit
        title="Chỉnh sửa survey"
        description="Make changes to your profile here. Click save when you're done."
        open={showQuizForm}
        onOpenChange={setShowQuizForm}
      >
        <EditBodyQuizForm
          data={quizData}
          onSuccess={() => {
            setShowQuizForm(false)
            quizRefetch()
          }}
        />
      </SheetEdit>

      <SheetEdit
        title={editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'}
        description="Make changes to your profile here. Click save when you're done."
        open={showQuestionForm}
        onOpenChange={setShowQuestionForm}
      >
        <EditQuestionForm
          data={editingQuestion}
          onSuccess={async (question) => {
            const questionIDs = quizData?.questions.map((q) => q.id) || []
            if (!questionIDs.includes(question.id)) {
              await updateBodyQuiz(quizID, {
                ...quizData!,
                question_ids: [...questionIDs, question.id],
              })
            }
            setShowQuestionForm(false)
            setEditingQuestion(null)
            quizRefetch()
          }}
        />
      </SheetEdit>
    </div>
  )
}
