import Layout from '@/app/(user)/_components/layout'

export default async function MealPlansLayout({ children }: { children: React.ReactNode }) {
  //TODO: Use this slug later on for fetching data
  return (
    <Layout>
      <div className="p-4 sm:p-6 md:p-8 xl:p-10 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  )
}
