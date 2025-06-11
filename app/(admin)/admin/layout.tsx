import { redirect } from 'next/navigation'

import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import { verifySession } from '@/lib/dal'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession()

  if (!session) {
    redirect('/auth/login')
  }

  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
