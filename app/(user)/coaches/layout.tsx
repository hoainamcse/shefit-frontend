import Layout from "@/app/(user)/_components/layout"

export default async function CoachesLayout({ children }: { children: React.ReactNode }) {
  //TODO: Use this slug later on for fetching data
  return (
    <Layout>
      <div className="lg:px-6 px-1 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  )
}
