import Layout from '@/app/(user)/_components/layout'

export default async function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="mx-auto px-1 md:px-4 lg:px-8 xl:px-11 pb-4 lg:pb-16">{children}</div>
    </Layout>
  )
}
