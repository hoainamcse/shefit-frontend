import { cookies } from 'next/headers'

import { Sidebar, SidebarContent } from '@/components/admin-panel/sidebar'
import { SidebarProvider } from '@/components/providers/sidebar-provider'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar />
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  )
}
