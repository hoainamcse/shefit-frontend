import Layout from "@/components/common/Layout"

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <div className="p-6 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  )
}
