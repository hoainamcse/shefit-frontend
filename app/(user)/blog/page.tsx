import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { getBlogs } from '@/network/server/blog'
import type { Blog } from '@/models/blog'
import { HtmlContent } from '@/components/html-content'
export default async function BlogPage() {
  const blogs = await getBlogs()
  return (
    <div>
      <div className="max-w-screen-md mx-auto">
        <p className="font-[family-name:var(--font-coiny)] sm:text-center text-ring text-2xl sm:text-3xl my-2 sm:my-4">
          Blog healthy
        </p>
        <p className="sm:text-center text-gray-500 text-base mb-20">Các lời khuyên hữu ích về tập luyện & ăn uống</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mx-auto mt-6 items-stretch">
        {blogs.data.map((blog: Blog, index: number) => (
          <Link key={`menu-${index}`} href={`/blog/${blog.id}`} className="h-full">
            <Card
              key={`menu-${index}`}
              className="xl:mb-10 max-lg:mb-5 flex justify-between items-center p-4 gap-4 h-full"
            >
              <div className="relative group w-1/2">
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  className="aspect-[5/3] object-cover rounded-xl w-full h-full"
                />
              </div>
              <div className="w-1/2 flex flex-col h-full justify-center">
                <p className="font-medium xl:text-xl max-lg:text-base">{blog.title}</p>
                <HtmlContent content={blog.content} className="text-gray-500 max-lg:text-sm line-clamp-5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
