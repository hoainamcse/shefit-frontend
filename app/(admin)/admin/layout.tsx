'use client'
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import useRequireRole from '@/hooks/use-require-role'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const ready = useRequireRole(['sub_admin', 'admin'], '/auth/login')
  if (!ready) return null

  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
