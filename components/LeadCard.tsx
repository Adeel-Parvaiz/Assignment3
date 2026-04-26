'use client';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface Lead {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  propertyInterest?: string;
  budget: number;
  status: string;
  priority: string;
  score: number;
  source: string;
  assignedTo?: { name: string; email: string };
  followUpDate?: string;
  createdAt: string;
}

interface Props {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  onAssign?: (lead: Lead) => void;
  showAdmin?: boolean;
}

const PRIORITY_STYLES: Record<string, string> = {
  High: 'badge badge-high',
  Medium: 'badge badge-medium',
  Low: 'badge badge-low',
};

const STATUS_STYLES: Record<string, object> = {
  New: { background: '#dbeafe', color: '#1d4ed8' },
  Contacted: { background: '#fef9c3', color: '#ca8a04' },
  'In Progress': { background: '#ffedd5', color: '#ea580c' },
  Closed: { background: '#dcfce7', color: '#16a34a' },
};

export default function LeadCard({ lead, onEdit, onDelete, onAssign, showAdmin = false }: Props) {
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();
  const whatsappLink = lead.phone ? getWhatsAppLink(lead.phone) : '#';

  return (
    <div className="card" style={{ marginBottom: '16px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
            {lead.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
            {lead.source} • Score: {lead.score}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={PRIORITY_STYLES[lead.priority] || 'badge'}>
            {lead.priority}
          </span>
          <span style={{
            ...(STATUS_STYLES[lead.status] || {}),
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {lead.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {lead.email && (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            📧 {lead.email}
          </p>
        )}
        {lead.phone && (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            📞 {lead.phone}
          </p>
        )}
        <p style={{ fontSize: '13px', color: '#6b7280' }}>
          💰 PKR {lead.budget.toLocaleString()}
        </p>
        {lead.propertyInterest && (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            🏘️ {lead.propertyInterest}
          </p>
        )}
        {lead.assignedTo && (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            👤 {lead.assignedTo.name}
          </p>
        )}
        {lead.followUpDate && (
          <p style={{ fontSize: '13px', color: isOverdue ? '#ef4444' : '#6b7280' }}>
            📅 {isOverdue ? '⚠️ Overdue: ' : 'Follow-up: '}
            {new Date(lead.followUpDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

       {lead.phone && (
  <button
    onClick={() => window.open(whatsappLink, '_blank')}
    style={{
      background:   '#16a34a',
      color:        'white',
      border:       'none',
      padding:      '6px 14px',
      borderRadius: '6px',
      fontSize:     '13px',
      cursor:       'pointer',
    }}
  >
    💬 WhatsApp
  </button>
)}

        {onEdit && (
          <button
            onClick={() => onEdit(lead)}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            ✏️ Edit
          </button>
        )}

        {showAdmin && onAssign && (
          <button
            onClick={() => onAssign(lead)}
            style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            👤 Assign
          </button>
        )}

        {showAdmin && onDelete && (
          <button
            onClick={() => onDelete(lead._id)}
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            🗑️ Delete
          </button>
        )}

      </div>
    </div>
  );
}