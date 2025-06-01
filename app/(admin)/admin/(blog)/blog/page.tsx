'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { HtmlContent } from '@/components/html-content'

import { deleteBlog, getListBlogs } from '@/network/server/blog'
import { Blog } from '@/models/blog'
import { DeleteButton } from '@/components/buttons/delete-button'
import { toast } from 'sonner'

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlogs = async () => {
    const response = await getListBlogs()
    setBlogs(response.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDeleteBlog = async (id: string) => {
    try {
      await deleteBlog(id)
      toast.success('Bài viết đã được xóa thành công')
      await fetchBlogs()
    } catch (error) {
      toast.error('Không thể xóa bài viết')
      console.error('Error deleting blog:', error)
    }
  }

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
          <div key={blog.id} className="relative group">
            <div className="absolute top-2 right-2 z-10">
              <DeleteButton size="icon" variant="outline" onConfirm={() => handleDeleteBlog(blog.id.toString())} />
            </div>
            <Link href={`/admin/blog/${blog.id}`} key={blog.id} className="block">
              <Card>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <HtmlContent content={blog.content} className="text-muted-foreground mb-4 line-clamp-3" />
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
          </div>
        ))}
      </div>
    </ContentLayout>
  )
}
