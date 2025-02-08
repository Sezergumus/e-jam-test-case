export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center w-full">
      <div className="container mx-auto w-full pt-12 md:pt-14 flex-grow text-center max-w-5xl">
        {children}
      </div>
    </section>
  );
}
