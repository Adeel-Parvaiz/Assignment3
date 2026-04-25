'use client';
import { useEffect, useState } from 'react';

interface Agent {
  _id:       string;
  name:      string;
  email:     string;
  role:      string;
  createdAt: string;
}

export default function AdminAgentsPage() {
  const [agents, setAgents]   = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => { setAgents(data); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: '24px' }}>Loading agents...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '24px' }}>
        Agents ({agents.length})
      </h1>

      {agents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
          No agents found. Ask agents to signup.
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent._id}>
                  <td style={{ fontWeight: '600' }}>{agent.name}</td>
                  <td style={{ color: '#6b7280' }}>{agent.email}</td>
                  <td>
                    <span className="badge badge-new">
                      {agent.role}
                    </span>
                  </td>
                  <td style={{ color: '#6b7280', fontSize: '13px' }}>
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}