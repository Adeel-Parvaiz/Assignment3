'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error: ${r.status}`);
        return r.json();
      })
      .then(data => { setStats(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ padding: '24px', color: '#6b7280' }}>
      Loading dashboard...
    </div>
  );

  if (error) return (
    <div style={{ padding: '24px' }}>
      <div className="error-box">Error: {error}</div>
    </div>
  );

  if (!stats) return null;

  const total = stats.total || 1;

  return (
    <div className="main-content">
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#1f2937' }}>
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card blue">
          <p>Total Leads</p>
          <p style={{ color: '#2563eb' }}>{stats.total}</p>
        </div>
        <div className="stat-card red">
          <p>High Priority</p>
          <p style={{ color: '#ef4444' }}>{stats.priorityStats?.High || 0}</p>
        </div>
        <div className="stat-card green">
          <p>Closed Leads</p>
          <p style={{ color: '#16a34a' }}>{stats.statusStats?.Closed || 0}</p>
        </div>
        <div className="stat-card purple">
          <p>Active Agents</p>
          <p style={{ color: '#7c3aed' }}>{stats.agentPerformance?.length || 0}</p>
        </div>
      </div>

      {/* Priority Distribution — CSS Bars */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>Priority Distribution</h2>

          {[
            { label: 'High',   value: stats.priorityStats?.High   || 0, color: '#ef4444' },
            { label: 'Medium', value: stats.priorityStats?.Medium || 0, color: '#f97316' },
            { label: 'Low',    value: stats.priorityStats?.Low    || 0, color: '#22c55e' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: '600' }}>{item.value}</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px' }}>
                <div style={{
                  background:    item.color,
                  height:        '8px',
                  borderRadius:  '4px',
                  width:         `${total > 0 ? (item.value / total) * 100 : 0}%`,
                  transition:    'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Status Distribution — CSS Bars */}
        <div className="card">
          <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>Leads by Status</h2>

          {[
            { label: 'New',         value: stats.statusStats?.New           || 0, color: '#2563eb' },
            { label: 'Contacted',   value: stats.statusStats?.Contacted     || 0, color: '#7c3aed' },
            { label: 'In Progress', value: stats.statusStats?.['In Progress'] || 0, color: '#f97316' },
            { label: 'Closed',      value: stats.statusStats?.Closed        || 0, color: '#22c55e' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: '600' }}>{item.value}</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px' }}>
                <div style={{
                  background:   item.color,
                  height:       '8px',
                  borderRadius: '4px',
                  width:        `${total > 0 ? (item.value / total) * 100 : 0}%`,
                  transition:   'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="card">
        <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>Agent Performance</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Leads Assigned</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {!stats.agentPerformance?.length ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                  No agents assigned yet
                </td>
              </tr>
            ) : (
              stats.agentPerformance.map((agent: any) => (
                <tr key={agent.name}>
                  <td style={{ fontWeight: '500' }}>{agent.name}</td>
                  <td style={{ fontWeight: '600', color: '#2563eb' }}>{agent.count}</td>
                  <td>
                    <div style={{ background: '#f3f4f6', borderRadius: '4px', height: '8px', width: '100px' }}>
                      <div style={{
                        background:   '#2563eb',
                        height:       '8px',
                        borderRadius: '4px',
                        width:        `${(agent.count / total) * 100}%`,
                      }} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}