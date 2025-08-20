import type { Blog } from '@/models/blog'
import { getBlog } from '@/network/server/blogs'
import { HtmlContent } from '@/components/html-content'
import Link from 'next/link'
import { BackIcon } from '@/components/icons/BackIcon'
import { htmlToText } from '@/lib/helpers'

export async function generateMetadata({ params }: { params: Promise<{ id: Blog['id'] }> }) {
  const { id: blogID } = await params
  const { data } = await getBlog(blogID)

  const description = htmlToText(data.content).slice(0, 120) || 'No description available for this blog post.'

  return {
    title: data.title,
    description: description,
    openGraph: {
      title: data.title,
      description: description,
      images: [
        {
          url: data.thumbnail_image,
          alt: data.title,
        },
      ],
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ id: Blog['id'] }> }) {
  const { id: blogID } = await params
  const { data } = await getBlog(blogID)

  return (
    <div className="flex flex-col mt-5 lg:mt-10">
      <Link href="/blogs" className="flex items-center gap-[10px] cursor-pointer">
        <BackIcon color="#000000" style={{ marginBottom: '4px' }} />
        <div className="text-lg text-[#000000] font-semibold">Quay về</div>
      </Link>
      <div className="flex flex-col gap-10 mt-5 lg:mt-10">
        <img
          src={data.cover_image}
          alt={data.title}
          className="lg:h-[680px] w-full object-cover h-[300px] rounded-xl"
        />
        <div>
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold xl:text-4xl mb-5 max-lg:text-xl">
            {data.title}
          </div>
          <HtmlContent content={data.content} className="text-gray-500 xl:text-lg max-lg:text-lg" />
        </div>
      </div>
    </div>
  )
}
