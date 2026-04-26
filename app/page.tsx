import Sidebar from '@/components/Sidebar';

// No html or body tags here — only wrapper div
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar left side */}
      <Sidebar />

      {/* Main content right side */}
      <div style={{
        marginLeft: '240px',
        padding:    '24px',
        flex:       '1',
        background: '#f3f4f6',
        minHeight:  '100vh',
      }}>
        {children}
      </div>

    </div>
  );
}