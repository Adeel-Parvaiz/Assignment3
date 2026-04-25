'use client';
import { useEffect, useState } from 'react';
import LeadCard from '@/components/LeadCard';
import ActivityTimeline from '@/components/ActivityTimeline';

interface Lead {
  _id:              string;
  name:             string;
  email?:           string;
  phone?:           string;
  propertyInterest?: string;
  budget:           number;
  status:           string;
  priority:         string;
  score:            number;
  source:           string;
  assignedTo?:      { name: string; email: string };
  followUpDate?:    string;
  createdAt:        string;
}

export default function AgentLeadsPage() {
  const [leads, setLeads]           = useState<Lead[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(data); setLoading(false); });
  };

  // Update lead status
  const handleStatusUpdate = async (leadId: string, status: string) => {
    await fetch(`/api/leads/${leadId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    });
    fetchLeads();
  };

  // Set follow-up date
  const handleFollowUp = async (leadId: string) => {
    if (!followUpDate) return;

    await fetch(`/api/leads/${leadId}/followup`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ followUpDate }),
    });

    setFollowUpDate('');
    fetchLeads();
  };

  // Filter leads by status
  const filteredLeads = leads.filter(lead => {
    if (filterStatus && lead.status !== filterStatus) return false;
    return true;
  });

  if (loading) return <div style={{ padding: '24px' }}>Loading leads...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 380px' : '1fr', gap: '24px' }}>

      {/* Left — Leads List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
            My Leads ({filteredLeads.length})
          </h1>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
            No leads assigned yet
          </div>
        ) : (
          filteredLeads.map(lead => (
            <div
              key={lead._id}
              onClick={() => setSelectedLead(lead)}
              style={{ cursor: 'pointer' }}
            >
              <LeadCard
                lead={lead}
                showAdmin={false}
                onEdit={(lead) => setSelectedLead(lead)}
              />
            </div>
          ))
        )}
      </div>

      {/* Right — Lead Detail Panel */}
      {selectedLead && (
        <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: '700', fontSize: '16px' }}>{selectedLead.name}</h2>
            <button
              onClick={() => setSelectedLead(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
            >
              ✕
            </button>
          </div>

          {/* Update Status */}
          <div className="form-group">
            <label>Update Status</label>
            <select
              value={selectedLead.status}
              onChange={e => handleStatusUpdate(selectedLead._id, e.target.value)}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Set Follow-up Date */}
          <div className="form-group">
            <label>Set Follow-up Date</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => handleFollowUp(selectedLead._id)}
                className="btn-success"
                style={{ whiteSpace: 'nowrap' }}
              >
                Set
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <ActivityTimeline leadId={selectedLead._id} />
          </div>

        </div>
      )}
    </div>
  );
}