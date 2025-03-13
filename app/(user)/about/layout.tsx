import Layout from "@/components/common/Layout"

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="xl:p-6 max-lg:p-0 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  )
}
