'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ContentLayout } from '@/components/admin-panel/content-layout'

interface Quiz {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'Nutrition Basics',
      description: 'Test your knowledge of essential nutrients, balanced diet principles, and healthy eating habits.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Physical Activity & Exercise',
      description: 'Challenge yourself with questions about different types of exercise, fitness principles, and workout planning.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Mental Wellness',
      description: 'Evaluate your understanding of stress management, mindfulness techniques, and emotional well-being.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      title: 'Sleep & Recovery',
      description: 'Test your knowledge about healthy sleep habits, sleep cycles, and the importance of rest for overall health.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      title: 'Preventive Health Care',
      description: 'Learn about regular health screenings, vaccination schedules, and maintaining good personal hygiene.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ContentLayout title="Quizzes">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/quizzes/create">
          <Button>Tạo quiz mới</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{quiz.description}</p>
              <div className="flex justify-end gap-2">
                <Link href={`/admin/quizzes/${quiz.id}/edit`}>
                  <Button variant="outline">Sửa</Button>
                </Link>
                <Link href={`/admin/quizzes/${quiz.id}`}>
                  <Button>Xem</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ContentLayout>
  )
}
