export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col justify-center items-center mt-20">
      {children}
    </div>
  );
}
