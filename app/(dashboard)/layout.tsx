import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Sidebar left side */}
      <Sidebar />

      {/* Main content right side */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}