import { Navbar } from '@/components/admin-panel/navbar'

interface ContentLayoutProps {
  title: string
  children: React.ReactNode
  leftSection?: React.ReactNode
  rightSection?: React.ReactNode
}

export function ContentLayout({ title, children, leftSection, rightSection}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} leftSection={leftSection} rightSection={rightSection} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  )
}
