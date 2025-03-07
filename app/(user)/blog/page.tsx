import Layout from "@/components/common/Layout"
import ImageTitle from "@/assets/image/ImageTitle.png"
import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainButton } from "@/components/buttons/main-button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div>
      <div className="max-w-screen-md mx-auto">
        <p className="font-[family-name:var(--font-coiny)] sm:text-center text-text text-2xl sm:text-3xl my-2 sm:my-4">
          Blog healthy
        </p>
        <p className="sm:text-center text-gray-500 text-base mb-20">Các lời khuyên hữu ích về tập luyện & ăn uống</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mx-auto mt-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Link key={`menu-${index}`} href={`/blog/${index}`}>
            <Card key={`menu-${index}`} className="xl:mb-10 max-lg:mb-5 flex justify-between items-center p-4 gap-4">
              <div className="relative group w-1/2">
                <Image src={ImageTitle} alt="" className="aspect-[5/3] object-cover rounded-xl" />
              </div>
              <div className="w-1/2">
                <p className="font-medium xl:text-xl max-lg:text-base">Title blog 1</p>
                <p className="text-gray-500 max-lg:text-sm">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
                  Molestie nascetur justo sit.
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
