import * as React from 'react'
import { getBlog } from '@/network/server/blogs'
import { HtmlContent } from '@/components/html-content'
import Link from 'next/link'
import { BackIcon } from '@/components/icons/BackIcon'

export default async function BlogDetail({ params }: { params: Promise<{ detail: string }> }) {
  const { detail } = await params
  const { data: blog } = await getBlog(Number(detail))
  return (
    <div className="flex flex-col mt-5 lg:mt-10">
      <Link href="/blog" className="flex items-center gap-[10px] cursor-pointer">
        <BackIcon color="#000000" style={{ marginBottom: '4px' }} />
        <div className="text-lg text-[#000000] font-semibold">Quay về</div>
      </Link>
      <div className="flex flex-col gap-10 mt-5 lg:mt-10">
        <img
          src={blog.cover_image}
          alt={blog.title}
          className="lg:h-[680px] w-full object-cover h-[300px] rounded-xl"
        />
        <div>
          <div className="font-[family-name:var(--font-coiny)] xl:text-4xl mb-5 max-lg:text-xl font-bold">
            {blog.title}
          </div>
          <HtmlContent content={blog.content} className="text-gray-500 xl:text-lg max-lg:text-lg" />
        </div>
      </div>
    </div>
  )
}
