export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  //TODO: Use this slug later on for fetching data
  return <div className="p-6 max-lg:p-0 max-w-screen-3xl mx-auto mb-20">{children}</div>
}
