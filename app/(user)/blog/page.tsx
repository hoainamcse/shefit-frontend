import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { getBlogs } from '@/network/server/blogs'
import type { Blog } from '@/models/blog'
import { HtmlContent } from '@/components/html-content'
export default async function BlogPage() {
  const blogs = await getBlogs()
  return (
    <div className="flex flex-col pt-10 lg:pt-16 xl:pt-[93px]">
      <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-10 lg:mb-16 xl:mb-[90px]">
        <p className="font-[family-name:var(--font-coiny)] text-ring text-2xl lg:text-4xl font-semibold sm:font-bold">
          Blog healthy
        </p>
        <p className="text-[#737373] text-sm lg:text-lg">Các lời khuyên hữu ích về tập luyện & ăn uống</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 sm:gap-5 gap-4 mx-auto items-stretch">
        {blogs.data.map((blog: Blog, index: number) => (
          <Link key={`menu-${index}`} href={`/blog/${blog.id}`} className="h-full">
            <Card
              key={`menu-${index}`}
              className="flex flex-col 2xl:flex-row justify-start items-start p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4 h-full rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative group w-full aspect-[270/220] 2xl:w-[270px] overflow-hidden rounded-lg flex-shrink-0 mx-auto 2xl:mx-0 shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-105">
                <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:flex-1 flex flex-col h-full pr-2 pb-1 justify-start mt-2 2xl:mt-0 text overflow-hidden">
                <p className="font-medium text-sm lg:text-base mb-1 truncate overflow-hidden">{blog.title}</p>
                <HtmlContent
                  content={blog.content}
                  className="text-gray-500 max-lg:text-xs line-clamp-5 overflow-hidden"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
