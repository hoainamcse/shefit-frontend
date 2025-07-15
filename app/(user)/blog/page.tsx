import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { getBlogs } from '@/network/server/blogs'
import type { Blog } from '@/models/blog'
import { HtmlContent } from '@/components/html-content'
export default async function BlogPage() {
  const blogs = await getBlogs()
  return (
    <div>
      <div className="max-w-screen-md mx-auto">
        <p className="font-[family-name:var(--font-coiny)] sm:text-center text-ring text-2xl sm:text-3xl my-2 sm:my-4 font-bold">
          Blog healthy
        </p>
        <p className="sm:text-center text-gray-500 text-base mb-20">Các lời khuyên hữu ích về tập luyện & ăn uống</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto mt-6 items-stretch">
        {blogs.data.map((blog: Blog, index: number) => (
          <Link key={`menu-${index}`} href={`/blog/${blog.id}`} className="h-full">
            <Card
              key={`menu-${index}`}
              className="flex flex-col md:flex-row justify-between p-2 md:p-3 gap-2 md:gap-3 h-full rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative group md:w-1/2 w-full overflow-hidden rounded-lg flex-shrink-0 mx-auto md:mx-0">
                <div className="aspect-[250/220] w-full max-h-[280px]">
                  <img src={blog.cover_image} alt={blog.title} className="object-cover w-full h-full" />
                </div>
              </div>
              <div className="md:w-1/2 w-full flex flex-col h-full pr-2 pb-1 justify-start mt-2 md:mt-0 text">
                <p className="font-medium text-base lg:text-lg mb-1">{blog.title}</p>
                <HtmlContent content={blog.content} className="text-gray-500 max-lg:text-sm line-clamp-5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
