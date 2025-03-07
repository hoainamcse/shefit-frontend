import Layout from "@/components/common/Layout"

export default async function CartLayout({ children }: { children: React.ReactNode }) {
  //TODO: Use this slug later on for fetching data
  return (
    <Layout>
      <div className="p-6 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  )
}
