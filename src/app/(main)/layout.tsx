import NavBar from '~/app/components/NavBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="w-full flex items-center justify-center border-b border-gray-200">
        <NavBar />
      </header>
      <main className="mx-auto w-full max-w-7xl p-6 lg:px-8">{children}</main>
    </div>
  );
}
