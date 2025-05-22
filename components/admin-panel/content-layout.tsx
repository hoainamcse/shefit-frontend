import { Navbar } from '@/components/admin-panel/navbar'

interface ContentLayoutProps {
  title: string
  children: React.ReactNode
  rightSection?: React.ReactNode
}

export function ContentLayout({ title, children, rightSection}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} rightSection={rightSection} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  )
}
