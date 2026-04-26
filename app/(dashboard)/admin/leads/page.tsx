'use client';
import { useEffect, useState } from 'react';
import LeadCard from '@/components/LeadCard';

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

interface Agent {
  _id:  string;
  name: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads]             = useState<Lead[]>([]);
  const [agents, setAgents]           = useState<Agent[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [assignModal, setAssignModal] = useState<Lead | null>(null);
  const [editModal, setEditModal]     = useState<Lead | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [filterStatus,   setFilterStatus]   = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // New lead form
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    propertyInterest: '', budget: '',
    source: 'Other', notes: '',
  });

  // Edit form
  const [editForm, setEditForm] = useState({
    name: '', email: '', phone: '',
    propertyInterest: '', budget: '',
    source: 'Other', notes: '', status: 'New',
  });

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const fetchLeads = () => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(data); setLoading(false); });
  };

  const fetchAgents = () => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(setAgents);
  };

  // Open edit modal with lead data
  const handleEditOpen = (lead: Lead) => {
    setEditModal(lead);
    setEditForm({
      name:             lead.name,
      email:            lead.email            || '',
      phone:            lead.phone            || '',
      propertyInterest: lead.propertyInterest || '',
      budget:           lead.budget.toString(),
      source:           lead.source,
      notes:            '',
      status:           lead.status,
    });
  };

  // Save edited lead
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;

    await fetch(`/api/leads/${editModal._id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...editForm,
        budget: Number(editForm.budget),
      }),
    });

    setEditModal(null);
    fetchLeads();
  };

  // Create new lead
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/leads', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, budget: Number(form.budget) }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', propertyInterest: '', budget: '', source: 'Other', notes: '' });
      fetchLeads();
    }
  };

  // Delete lead
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    fetchLeads();
  };

  // Assign lead
  const handleAssign = async () => {
    if (!assignModal || !selectedAgent) return;
    await fetch(`/api/leads/${assignModal._id}/assign`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ agentId: selectedAgent }),
    });
    setAssignModal(null);
    setSelectedAgent('');
    fetchLeads();
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (filterStatus   && lead.status   !== filterStatus)   return false;
    if (filterPriority && lead.priority !== filterPriority) return false;
    return true;
  });

  if (loading) return <div style={{ padding: '24px' }}>Loading leads...</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
          All Leads ({filteredLeads.length})
        </h1>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '10px 20px' }}
          onClick={() => setShowForm(true)}
        >
          + New Lead
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
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

        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
        >
          <option value="">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {(filterStatus || filterPriority) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterPriority(''); }}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>
          No leads found
        </div>
      ) : (
        filteredLeads.map(lead => (
          <LeadCard
            key={lead._id}
            lead={lead}
            showAdmin={true}
            onDelete={handleDelete}
            onAssign={(lead) => setAssignModal(lead)}
            onEdit={handleEditOpen}
          />
        ))
      )}

      {/* Create Lead Modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
              Create New Lead
            </h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Client name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="client@email.com" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="03001234567" />
              </div>
              <div className="form-group">
                <label>Property Interest</label>
                <input value={form.propertyInterest} onChange={e => setForm({ ...form, propertyInterest: e.target.value })} placeholder="Plot, Apartment, House..." />
              </div>
              <div className="form-group">
                <label>Budget (PKR) *</label>
                <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="5000000" required />
              </div>
              <div className="form-group">
                <label>Source</label>
                <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                  <option value="Facebook">Facebook</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary">Create Lead</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
              ✏️ Edit Lead — {editModal.name}
            </h2>
            <form onSubmit={handleEditSave}>
              <div className="form-group">
                <label>Full Name *</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Property Interest</label>
                <input value={editForm.propertyInterest} onChange={e => setEditForm({ ...editForm, propertyInterest: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Budget (PKR) *</label>
                <input type="number" value={editForm.budget} onChange={e => setEditForm({ ...editForm, budget: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Source</label>
                <select value={editForm.source} onChange={e => setEditForm({ ...editForm, source: e.target.value })}>
                  <option value="Facebook">Facebook</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" onClick={() => setEditModal(null)} style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Assign Lead</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
              Assigning: <strong>{assignModal.name}</strong>
            </p>
            <div className="form-group">
              <label>Select Agent</label>
              <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
                <option value="">Choose an agent...</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>{agent.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAssign} className="btn-primary" disabled={!selectedAgent}>
                Assign
              </button>
              <button onClick={() => { setAssignModal(null); setSelectedAgent(''); }} style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}