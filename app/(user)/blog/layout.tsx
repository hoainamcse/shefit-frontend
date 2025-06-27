import Layout from '@/app/(user)/_components/layout'

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="lg:p-6 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  )
}
