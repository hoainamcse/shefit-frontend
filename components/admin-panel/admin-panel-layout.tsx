import { Sidebar, SidebarContent } from '@/components/admin-panel/sidebar'
import { SidebarProvider } from '@/components/providers/sidebar-provider'
import React, { useState, useEffect } from 'react'

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const [defaultOpen, setDefaultOpen] = useState(true)

  useEffect(() => {
    const cookiePair = document.cookie.split('; ').find((row) => row.startsWith('sidebar_state='))
    const val = cookiePair?.split('=')[1] === 'true'
    setDefaultOpen(val)
  }, [])

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar />
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  )
}
