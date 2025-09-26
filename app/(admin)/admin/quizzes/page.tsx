'use client'

import type { BodyQuiz } from '@/models/body-quiz'

import { useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, FileQuestion, Edit, Trash2, Calendar } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteBodyQuiz, getBodyQuizzes, queryKeyBodyQuizzes } from '@/network/client/body-quizzes'
import { EditBodyQuizForm } from '@/components/forms/edit-body-quiz-form'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { SheetEdit } from '@/components/dialogs/sheet-edit'
// import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { MainButton } from '@/components/buttons/main-button'
import { AddButton } from '@/components/buttons/add-button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function BodyQuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<BodyQuiz | null>(null)
  // const [deleteQuiz, setDeleteQuiz] = useState<BodyQuiz | null>(null)

  const router = useRouter()
  // const queryClient = useQueryClient()

  // Queries
  const {
    data: quizzes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [queryKeyBodyQuizzes],
    queryFn: () => getBodyQuizzes(),
  })

  const handleAddQuiz = () => {
    setEditingQuiz(null)
    setShowQuizForm(true)
  }

  const handleEditQuiz = (quiz: BodyQuiz) => {
    setEditingQuiz(quiz)
    setShowQuizForm(true)
  }

  const handleDeleteQuiz = (quiz: BodyQuiz) => {
    // setDeleteQuiz(quiz)
    const deletePromise = () => deleteBodyQuiz(quiz.id)

    toast.promise(deletePromise, {
      loading: 'Đang xoá...',
      success: (_) => {
        refetch()
        return 'Xoá quiz thành công'
      },
      error: 'Đã có lỗi xảy ra',
    })
  }

  const handleViewQuiz = (quizId: number) => {
    router.push(`/admin/quizzes/${quizId}`)
  }

  const filteredQuizzes = quizzes?.data.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ContentLayout title="Quiz Manager" rightSection={<AddButton onClick={handleAddQuiz} text="Thêm quiz" />}>
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm quizzes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : filteredQuizzes && filteredQuizzes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileQuestion className="mr-1 h-4 w-4" />
                    <span>{quiz.questions.length} câu hỏi</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Ngày thêm: {format(quiz.created_at, 'Pp')}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <MainButton variant="outline" onClick={() => handleViewQuiz(quiz.id)} text="Xem quiz" />
                  <div className="flex gap-2">
                    <MainButton size="icon" variant="ghost" onClick={() => handleEditQuiz(quiz)} icon={Edit} />
                    <MainButton
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteQuiz(quiz)}
                      icon={Trash2}
                      className="hover:text-destructive"
                    />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium mb-2">Không tìm thấy quiz nào</h3>
                <p className="text-muted-foreground mb-4">Hãy thử một từ khoá tìm kiếm khác</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">Chưa có quiz nào</h3>
                <p className="text-muted-foreground mb-4">Tạo quiz đầu tiên của bạn để bắt đầu</p>
                <AddButton onClick={handleAddQuiz} text='Thêm quiz' />
              </>
            )}
          </div>
        )}
      </div>

      {/* Sheets and Forms */}
      <SheetEdit
        title={editingQuiz ? 'Chỉnh sửa quiz' : 'Thêm quiz'}
        description="Make changes to your profile here. Click save when you're done."
        open={showQuizForm}
        onOpenChange={setShowQuizForm}
      >
        <EditBodyQuizForm
          data={editingQuiz}
          onSuccess={() => {
            setShowQuizForm(false)
            setEditingQuiz(null)
            refetch()
            // queryClient.invalidateQueries({ queryKey: ['quizzes'] })
          }}
        />
      </SheetEdit>

      {/* <DeleteConfirmDialog
          open={!!deleteQuiz}
          onOpenChange={() => setDeleteQuiz(null)}
          itemType="quiz"
          itemName={deleteQuiz?.title || ""}
          onConfirm={() => {
            // Handle delete logic here
            setDeleteQuiz(null)
            queryClient.invalidateQueries({ queryKey: ["quizzes"] })
          }}
        /> */}
    </ContentLayout>
  )
}
