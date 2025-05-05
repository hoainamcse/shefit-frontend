'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ContentLayout } from '@/components/admin-panel/content-layout'

import { getListBlogs } from '@/network/server/blog'
import { Blog } from '@/models/blog'

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getListBlogs()
      setBlogs(response.data || [])
      setLoading(false)
    }
    fetchBlogs()
  }, [])

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
          <Link href={`/admin/blog/${blog.id}`} key={blog.id} className="block">
            <Card>
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{blog.content}</p>
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </ContentLayout>
  )
}
