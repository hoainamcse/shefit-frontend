'use client'

import type { Blog } from '@/models/blog'
import type { Topic } from '@/models/topic'

import Link from 'next/link'
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getBlogs } from '@/network/client/blogs'
import { getTopics } from '@/network/client/topics'
import { HTMLRenderer } from '@/components/html-renderer'

export default function BlogsPage() {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)

  const [
    { data: topicsResponse, isLoading: isTopicsLoading, error: topicsError },
    { data: blogsResponse, isLoading: isBlogsLoading, error: blogsError },
  ] = useQueries({
    queries: [
      {
        queryKey: ['topics'],
        queryFn: getTopics,
      },
      {
        queryKey: ['blogs', selectedTopicId],
        queryFn: () => getBlogs(selectedTopicId ? { topic_id: selectedTopicId } : {}),
      },
    ],
  })

  const topics: Topic[] = topicsResponse?.data || []
  const blogs: Blog[] = blogsResponse?.data || []

  return (
    <div className="flex flex-col pt-10 lg:pt-16">
      <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-6 sm:mb-8 lg:mb-12 xl:mb-14">
        <p className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
          Blog healthy
        </p>
        <p className="text-[#737373] text-sm lg:text-lg">Các lời khuyên hữu ích về tập luyện & ăn uống</p>
      </div>

      {/* Blog topic */}
      <div className="mb-4 lg:mb-8">
        <ScrollArea className="w-full whitespace-nowrap">
          {isTopicsLoading ? (
            <div className="flex justify-center gap-4 pb-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-md" />
                ))}
            </div>
          ) : topicsError ? (
            <div className="flex justify-center pb-4">
              <p className="text-red-500">Failed to load topics. Please try again.</p>
            </div>
          ) : (
            <div className="flex sm:justify-center md:justify-center pb-4 gap-8">
              <button
                onClick={() => setSelectedTopicId(null)}
                className={`text-sm md:text-base transition-all hover:text-ring ${
                  selectedTopicId === null ? 'text-ring font-medium border-b-2 border-ring' : 'text-gray-600'
                }`}
              >
                Tất cả
              </button>
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`text-sm md:text-base transition-all hover:text-ring ${
                    selectedTopicId === topic.id ? 'text-ring font-medium border-b-2 border-ring' : 'text-gray-600'
                  }`}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Blog list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:gap-5 gap-4 mx-auto items-stretch">
        {isBlogsLoading ? (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-[220px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
          </div>
        ) : blogsError ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-red-500">Failed to load blogs. Please try again.</p>
          </div>
        ) : blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <Link key={`menu-${index}`} href={`/blogs/${blog.id}`} className="h-full">
              <Card
                key={`menu-${index}`}
                className="flex flex-col 2xl:flex-row justify-start items-start p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4 h-full rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative group w-full aspect-[270/220] 2xl:w-[270px] overflow-hidden rounded-lg flex-shrink-0 mx-auto 2xl:mx-0 shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-105">
                  <img src={blog.thumbnail_image} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:flex-1 flex flex-col h-full pr-2 pb-1 justify-start mt-2 2xl:mt-0 text overflow-hidden">
                  <p className="font-medium text-sm lg:text-base mb-1 truncate overflow-hidden">{blog.title}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blog.topics.map((t) => (
                      <Badge key={t.id} variant="outline">
                        {t.name}
                      </Badge>
                    ))}
                  </div>
                  <HTMLRenderer
                    content={blog.content}
                    className="text-gray-500 max-lg:text-xs line-clamp-4 overflow-hidden"
                  />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-500 text-center">Không có bài viết nào cho chủ đề này</p>
          </div>
        )}
      </div>
    </div>
  )
}
