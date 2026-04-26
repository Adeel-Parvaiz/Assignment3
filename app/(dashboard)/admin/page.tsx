'use client';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const PRIORITY_COLORS: Record<string, string> = {
  High:   '#ef4444',
  Medium: '#f97316',
  Low:    '#22c55e',
};

export default function AdminDashboard() {
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => {
        // Check if response is ok
        if (!r.ok) throw new Error(`HTTP error: ${r.status}`);
        return r.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Analytics fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ padding: '24px', color: '#6b7280' }}>
      Loading dashboard...
    </div>
  );

  if (error) return (
    <div style={{ padding: '24px' }}>
      <div className="error-box">
        Error loading dashboard: {error}
      </div>
    </div>
  );

  if (!stats) return (
    <div style={{ padding: '24px', color: '#6b7280' }}>
      No data found
    </div>
  );

  const priorityChartData = Object.entries(stats.priorityStats).map(
    ([name, value]) => ({ name, value })
  );
  const statusChartData = Object.entries(stats.statusStats).map(
    ([name, value]) => ({ name, count: value })
  );

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
          <p style={{ color: '#ef4444' }}>{stats.priorityStats.High}</p>
        </div>
        <div className="stat-card green">
          <p>Closed Leads</p>
          <p style={{ color: '#16a34a' }}>{stats.statusStats.Closed}</p>
        </div>
        <div className="stat-card purple">
          <p>Active Agents</p>
          <p style={{ color: '#7c3aed' }}>{stats.agentPerformance.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={priorityChartData}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={80}
                label
              >
                {priorityChartData.map(entry => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>Leads by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="card">
        <h2 style={{ fontWeight: '600', marginBottom: '16px' }}>Agent Performance</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Leads Assigned</th>
            </tr>
          </thead>
          <tbody>
            {stats.agentPerformance.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>
                  No agents assigned yet
                </td>
              </tr>
            ) : (
              stats.agentPerformance.map((agent: any) => (
                <tr key={agent.name}>
                  <td>{agent.name}</td>
                  <td style={{ fontWeight: '600', color: '#2563eb' }}>{agent.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}