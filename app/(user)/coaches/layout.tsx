import Layout from '@/app/(user)/_components/layout'

export default async function CoachesLayout({ children }: { children: React.ReactNode }) {
  //TODO: Use this slug later on for fetching data
  return (
    <Layout>
      <div className="xl:px-12 lg:px-8 pb-12 lg:pb-20 px-1 max-w-screen-3xl mx-auto">{children}</div>
    </Layout>
  )
}
