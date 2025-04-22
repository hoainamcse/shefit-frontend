'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'
import EducatorAvatar from '@/assets/image/EducatorAvatar.png'
import Image from 'next/image'

const mockCoaches = [
  {
    id: '1',
    name: 'Nguyễn Thị Minh',
    quote: 'Sức khỏe là nền tảng của một cuộc sống hạnh phúc và thành công.',
    specialty: 'Yoga & Pilates',
    image: 'https://i.pinimg.com/736x/b6/52/f4/b652f437e63973b515e142623b84f994.jpg',
  },
  {
    id: '2',
    name: 'Trần Văn Đức',
    quote: 'Tập luyện không chỉ thay đổi cơ thể mà còn thay đổi tâm trí và tinh thần của bạn.',
    specialty: 'Strength Training',
    image: 'https://i.pinimg.com/736x/b6/52/f4/b652f437e63973b515e142623b84f994.jpg',
  },
  {
    id: '3',
    name: 'Lê Thị Hương',
    quote: 'Mỗi bước tiến trong tập luyện là một bước tiến trong cuộc sống.',
    specialty: 'Nutrition & Weight Management',
    image: 'https://i.pinimg.com/736x/b6/52/f4/b652f437e63973b515e142623b84f994.jpg',
  },
  {
    id: '4',
    name: 'Phạm Minh Tuấn',
    quote: 'Đừng so sánh bản thân với người khác, hãy so sánh với chính bạn của ngày hôm qua.',
    specialty: 'HIIT & Cardio',
    image: 'https://i.pinimg.com/736x/b6/52/f4/b652f437e63973b515e142623b84f994.jpg',
  },
  {
    id: '5',
    name: 'Hoàng Thị Lan Anh',
    quote: 'Sự kiên trì sẽ biến điều không thể thành có thể.Sự kiên trì sẽ biến điều không thể thành có thể.',
    specialty: 'Functional Training & Rehabilitation',
    image: 'https://i.pinimg.com/736x/b6/52/f4/b652f437e63973b515e142623b84f994.jpg',
  },
]

export default function CoachPage() {
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ContentLayout title="Huấn luyện viên">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/trainer/create">
          <Button>Tạo mới</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCoaches.map((coach) => (
          <Link key={coach.id} href={`/admin/trainer/${coach.id}`} className="block focus:outline-none rounded-xl">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-row items-center gap-4 max-sm:flex-col">
                  <div className="flex-shrink-0">
                    <Image
                      src={EducatorAvatar}
                      alt={coach.name}
                      className="rounded-full object-cover"
                      width={120}
                      height={120}
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{coach.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-1">{coach.specialty}</p>
                    <div className="bg-primary/10 text-gray-700 rounded-lg p-3">
                      <p className="italic text-sm line-clamp-3">"{coach.quote}"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </ContentLayout>
  )
}
