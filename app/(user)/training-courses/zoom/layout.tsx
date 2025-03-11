import Layout from "@/components/common/Layout";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  //TODO: Use this slug later on for fetching data
  const { slug } = await params
  return (
    <Layout>
      <div className="p-6 max-w-screen-2xl mx-auto mb-20">
        <img
          src="/temp/courseDetail.png"
          alt={`${slug}`}
          className=" rounded-xl mb-4"
        />
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Easy Slim - Zoom</p>
            <p className="text-[#737373]">Độ Mông Đào</p>
            <p className="text-[#737373]">Miss Vi Salano - 4 Tuần</p>
          </div>
          <p className="text-[#737373]">Dáng quả lê</p>
        </div>
        <div className="bg-primary rounded-xl my-4 p-4">
          <p className="text-white text-center text-2xl">Tóm tắt khoá học</p>
          <ul className="text-white list-disc pl-8">
            <li>Torem ipsum dolor sit amet</li>
            <li>Torem ipsum dolor sit amet</li>
            <li>Torem ipsum dolor sit amet</li>
          </ul>
        </div>
        {children}
      </div>
    </Layout>
  );
}
