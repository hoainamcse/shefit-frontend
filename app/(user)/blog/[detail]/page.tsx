import * as React from 'react'
import { getBlog } from '@/network/server/blog'
import { HtmlContent } from '@/components/html-content'

export default async function BlogDetail({ params }: { params: Promise<{ detail: string }> }) {
  const { detail } = await params
  const { data: blog } = await getBlog(Number(detail))
  return (
    <div className="flex flex-col gap-10 mt-10 p-0">
      <img src={blog.cover_image} alt={blog.title} className="lg:h-[680px] w-full object-cover h-[300px]" />
      <div>
        <div className="font-[family-name:var(--font-coiny)] xl:text-[40px] mb-5 max-lg:text-2xl">{blog.title}</div>
        <HtmlContent content={blog.content} className="text-gray-500 xl:text-xl max-lg:text-base" />
      </div>
    </div>
  )
}
