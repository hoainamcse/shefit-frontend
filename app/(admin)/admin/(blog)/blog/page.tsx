'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ContentLayout } from '@/components/admin-panel/content-layout'

interface Blog {
  id: string
  title: string
  image: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "The Benefits of Regular Exercise",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Regular exercise has numerous benefits for both physical and mental health. It helps improve cardiovascular health, strengthens muscles and bones, and boosts mood through the release of endorphins...",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01")
  },
  {
    id: "2",
    title: "Nutrition Tips for a Healthy Lifestyle",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Eating a balanced diet is crucial for maintaining good health. Focus on incorporating a variety of whole foods, including fruits, vegetables, lean proteins, and healthy fats...",
    createdAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-05")
  },
  {
    id: "3",
    title: "Mindfulness and Mental Wellness",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Practicing mindfulness can significantly improve mental health and overall well-being. Simple techniques like deep breathing, meditation, and mindful movement can help reduce stress and anxiety...",
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-03-10")
  },
  {
    id: "4",
    title: "Sleep Hygiene: Tips for Better Rest",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Quality sleep is essential for physical and mental health. Establishing a consistent sleep schedule, creating a comfortable sleep environment, and avoiding stimulants before bedtime can improve sleep quality...",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15")
  },
  {
    id: "5",
    title: "Stress Management Techniques",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Effective stress management is crucial for maintaining overall health. Techniques such as regular exercise, proper nutrition, mindfulness practices, and social support can help reduce stress levels...",
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-03-20")
  }
]


export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ContentLayout title="Bài viết">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/blog/create">
          <Button>Tạo bài viết mới</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card key={blog.id}>
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground mb-4 line-clamp-3">{blog.content}</p>
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Link href={`/admin/blog/${blog.id}/edit`}>
                  <Button variant="outline">Sửa</Button>
                </Link>
                <Link href={`/admin/blog/${blog.id}`}>
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
