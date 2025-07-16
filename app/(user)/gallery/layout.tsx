import Layout from '@/app/(user)/_components/layout'

export default async function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="mx-auto px-5 lg:px-8 xl:px-[60px] pb-8 lg:pb-16">{children}</div>
    </Layout>
  )
}
