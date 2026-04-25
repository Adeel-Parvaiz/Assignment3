'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AgentDashboard() {
  const { data: session }     = useSession();
  const [leads, setLeads]     = useState<any[]>([]);
  const [overdue, setOverdue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch assigned leads
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(data); setLoading(false); });

    // Fetch overdue leads
    fetch('/api/leads/overdue')
      .then(r => r.json())
      .then(data => setOverdue(data.overdueLeads || []));
  }, []);

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
        Welcome, {session?.user?.name} 👋
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Here is your leads overview for today
      </p>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card blue">
          <p>Total Assigned</p>
          <p style={{ color: '#2563eb' }}>{leads.length}</p>
        </div>
        <div className="stat-card red">
          <p>High Priority</p>
          <p style={{ color: '#ef4444' }}>
            {leads.filter(l => l.priority === 'High').length}
          </p>
        </div>
        <div className="stat-card green">
          <p>Closed</p>
          <p style={{ color: '#16a34a' }}>
            {leads.filter(l => l.status === 'Closed').length}
          </p>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f97316' }}>
          <p>Overdue</p>
          <p style={{ color: '#f97316' }}>{overdue.length}</p>
        </div>
      </div>

      {/* Overdue Follow-ups Warning */}
      {overdue.length > 0 && (
        <div style={{
          background:   '#fef2f2',
          border:       '1px solid #fecaca',
          borderRadius: '12px',
          padding:      '16px',
          marginBottom: '24px',
        }}>
          <h3 style={{ color: '#dc2626', fontWeight: '600', marginBottom: '8px' }}>
            ⚠️ Overdue Follow-ups ({overdue.length})
          </h3>
          {overdue.map((lead: any) => (
            <p key={lead._id} style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              • {lead.name} — Due: {new Date(lead.followUpDate).toLocaleDateString()}
            </p>
          ))}
        </div>
      )}

      {/* Recent Leads */}
      <div className="card">
        <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>
          My Recent Leads
        </h2>
        {leads.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
            No leads assigned yet
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Budget</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead: any) => (
                <tr key={lead._id}>
                  <td style={{ fontWeight: '500' }}>{lead.name}</td>
                  <td>PKR {lead.budget.toLocaleString()}</td>
                  <td>
                    <span className={
                      lead.priority === 'High'   ? 'badge badge-high'   :
                      lead.priority === 'Medium' ? 'badge badge-medium' : 'badge badge-low'
                    }>
                      {lead.priority}
                    </span>
                  </td>
                  <td style={{ color: '#6b7280' }}>{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}