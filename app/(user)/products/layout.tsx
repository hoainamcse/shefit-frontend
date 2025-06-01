import Layout from "@/app/(user)/_components/layout"

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  //TODO: Use this slug later on for fetching data
  return (
    <Layout>
      <div className="max-w-screen-3xl -m-4 -mx-4">{children}</div>
    </Layout>
  )
}
