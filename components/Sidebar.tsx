'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname    = usePathname();
  const { data: session } = useSession();
  const role        = (session?.user as any)?.role;

  // Check if current link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="sidebar">

      {/* Logo */}
      <h2>🏠 Property CRM</h2>

      {/* User info */}
      <div style={{
        background:   '#334155',
        borderRadius: '8px',
        padding:      '12px',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Logged in as</p>
        <p style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
          {session?.user?.name}
        </p>
        <p style={{
          fontSize:     '11px',
          background:   role === 'admin' ? '#1d4ed8' : '#16a34a',
          color:        'white',
          padding:      '2px 8px',
          borderRadius: '20px',
          display:      'inline-block',
          marginTop:    '4px',
        }}>
          {role}
        </p>
      </div>

      {/* Admin Navigation Links */}
      {role === 'admin' && (
        <nav>
          <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
            Admin Menu
          </p>

          <Link href="/admin" className={isActive('/admin') ? 'active' : ''}>
            📊 Dashboard
          </Link>

          <Link href="/admin/leads" className={isActive('/admin/leads') ? 'active' : ''}>
            📋 All Leads
          </Link>

          <Link href="/admin/agents" className={isActive('/admin/agents') ? 'active' : ''}>
            👥 Agents
          </Link>
        </nav>
      )}

      {/* Agent Navigation Links */}
      {role === 'agent' && (
        <nav>
          <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
            Agent Menu
          </p>

          <Link href="/agent" className={isActive('/agent') ? 'active' : ''}>
            🏠 Dashboard
          </Link>

          <Link href="/agent/leads" className={isActive('/agent/leads') ? 'active' : ''}>
            📋 My Leads
          </Link>
        </nav>
      )}

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        style={{
          position:   'absolute',
          bottom:     '20px',
          left:       '20px',
          right:      '20px',
          background: '#ef4444',
          color:      'white',
          border:     'none',
          padding:    '10px',
          borderRadius: '8px',
          cursor:     'pointer',
          fontSize:   '14px',
        }}
      >
        🚪 Logout
      </button>

    </div>
  );
}