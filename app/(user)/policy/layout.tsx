import Layout from "@/app/(user)/_components/layout"

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="xl:p-10 max-lg:p-0 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  )
}
