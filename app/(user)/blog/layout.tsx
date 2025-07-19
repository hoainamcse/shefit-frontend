export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="p-4 sm:p-6 md:p-8 xl:p-10 max-w-screen-3xl mx-auto mb-20">{children}</div>
}
