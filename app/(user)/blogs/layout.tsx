export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto px-4 lg:px-8 xl:px-[60px] pb-8 lg:pb-16">{children}</div>
}
