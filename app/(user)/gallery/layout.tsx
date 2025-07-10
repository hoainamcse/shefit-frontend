import Layout from '@/app/(user)/_components/layout'

export default async function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="mx-auto mb-20">{children}</div>
    </Layout>
  )
}
