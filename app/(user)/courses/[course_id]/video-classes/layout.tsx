export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  //TODO: Use this slug later on for fetching data
  return <div className="sm:p-6 md:p-8 xl:p-10 max-w-screen-3xl mx-auto mb-20">{children}</div>
}
