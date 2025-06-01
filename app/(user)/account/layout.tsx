import Layout from "@/app/(user)/_components/layout";

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //TODO: Use this slug later on for fetching data
  return (
    <Layout className="p-0">
      <div className="p-0 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Layout>
  );
}
