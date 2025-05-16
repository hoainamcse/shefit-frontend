'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { useQuery } from '@/hooks/use-query'
import { deleteQuestion, deleteQuiz, getQuizzes } from '@/network/server/body-quiz'
import { Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AddButton } from '@/components/buttons/add-button'
import { EditButton } from '@/components/buttons/edit-button'
import { DeleteButton } from '@/components/buttons/delete-button'
import { QuizFormData } from '@/components/forms/types'
import { toast } from 'sonner'

export default function QuizzesPage() {
  const router = useRouter()

  const { data, isLoading, error, refetch } = useQuery(getQuizzes)

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  if (error) {
    return <div>Lỗi khi tải quizzes: {error.message}</div>
  }

  const handleDelete = async (data: QuizFormData) => {
    try {
      const { questions, ...quizData } = data
      await Promise.all(questions.map((question) => deleteQuestion(question.id as number)))
      await deleteQuiz(quizData.id as number)

      refetch()
      toast.success('Quiz created successfully')
    } catch (error) {
      toast.error('Failed to create quiz')
    }
  }

  return (
    <ContentLayout title="Quizzes">
      <div className="flex justify-end items-center mb-6">
        <AddButton text="Tạo quiz" onClick={() => router.push('/admin/quizzes/create')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                Tổng số câu hỏi:
                <span className="text-blue-500">{quiz.questions.length} câu hỏi</span>
              </div>
              <div className="flex justify-end gap-2">
                <EditButton onClick={() => router.push(`/admin/quizzes/${quiz.id}`)} variant="outline" />
                <DeleteButton onConfirm={() => handleDelete(quiz)} variant="outline" size="icon" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {data?.data.length === 0 && <div className="text-center">Chưa có quiz nào</div>}
    </ContentLayout>
  )
}
