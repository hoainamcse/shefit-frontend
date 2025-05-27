'use client'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getCoaches, deleteCoach } from '@/network/server/coaches'
import { Coach } from '@/models/coaches'
import { DeleteButton } from '@/components/buttons/delete-button'
import { toast } from 'sonner'
import { AddButton } from '@/components/buttons/add-button'

export default function CoachPage() {
  const [loading, setLoading] = useState(false)
  const [coaches, setCoaches] = useState<Coach[]>([])

  const fetchCoaches = async () => {
    const response = await getCoaches()
    setCoaches(response.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCoaches()
  }, [])

  const handleDeleteCoach = async (id: string) => {
    try {
      await deleteCoach(id)
      toast.success('Huấn luyện viên đã được xóa thành công')
      await fetchCoaches()
    } catch (error) {
      toast.error('Không thể xóa huấn luyện viên')
      console.error('Error deleting coach:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ContentLayout title="Huấn luyện viên">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/coach/create">
          <AddButton text="Tạo mới" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <div key={coach.id} className="relative group">
            <div className="absolute top-2 right-2 z-10">
              <DeleteButton size="icon" variant="outline" onConfirm={() => handleDeleteCoach(coach.id.toString())} />
            </div>
            <Link href={`/admin/coach/${coach.id}`} className="block focus:outline-none rounded-xl">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-row items-center gap-4 max-sm:flex-col">
                    <div className="flex-shrink-0 p-1 bg-gradient-to-tr from-primary/40 via-primary/20 to-primary/60 rounded-full shadow-lg">
                      <div className="rounded-full overflow-hidden border-2 border-white p-0.5 bg-white">
                        <img
                          src={coach.image}
                          alt={coach.name}
                          className="object-cover rounded-full hover:scale-105 transition-transform duration-300 aspect-square"
                          width={120}
                          height={120}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{coach.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-1">{coach.detail}</p>
                      <div className="bg-primary/10 text-gray-700 rounded-lg p-3">
                        <p className="italic text-sm line-clamp-3">"{coach.description}"</p>
                      </div>
                    </div>
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
