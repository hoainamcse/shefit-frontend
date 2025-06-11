import { cookies } from 'next/headers'

import { Sidebar, SidebarContent } from '@/components/admin-panel/sidebar'
import { SidebarProvider } from '@/components/providers/sidebar-provider'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = (await cookies()).get('sidebar_state')?.value

  return (
    <SidebarProvider defaultOpen={!sidebarOpen}>
      <Sidebar />
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  )
}
