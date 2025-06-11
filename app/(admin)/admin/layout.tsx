import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
