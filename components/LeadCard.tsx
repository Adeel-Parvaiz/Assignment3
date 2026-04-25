'use client';
import { getWhatsAppLink } from '@/lib/whatsapp';

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

interface Props {
  lead:       Lead;
  onEdit?:    (lead: Lead) => void;
  onDelete?:  (id: string) => void;
  onAssign?:  (lead: Lead) => void;
  showAdmin?: boolean;
}

// Priority badge colors
const PRIORITY_STYLES: Record<string, string> = {
  High:   'badge badge-high',
  Medium: 'badge badge-medium',
  Low:    'badge badge-low',
};

// Status badge colors
const STATUS_STYLES: Record<string, object> = {
  New:           { background: '#dbeafe', color: '#1d4ed8' },
  Contacted:     { background: '#fef9c3', color: '#ca8a04' },
  'In Progress': { background: '#ffedd5', color: '#ea580c' },
  Closed:        { background: '#dcfce7', color: '#16a34a' },
};

export default function LeadCard({ lead, onEdit, onDelete, onAssign, showAdmin = false }: Props) {

  // Check if follow-up is overdue
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  return (
    <div className="card" style={{ marginBottom: '16px' }}>

      {/* Top Row — Name + Priority */}
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
          {/* Priority Badge */}
          <span className={PRIORITY_STYLES[lead.priority] || 'badge'}>
            {lead.priority}
          </span>

          {/* Status Badge */}
          <span style={{
            ...(STATUS_STYLES[lead.status] || {}),
            padding:      '4px 12px',
            borderRadius: '20px',
            fontSize:     '12px',
            fontWeight:   '600',
          }}>
            {lead.status}
          </span>
        </div>
      </div>

      {/* Lead Details */}
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
          <p style={{ fontSize: '13px', color: isOverdue ? '#ef4444' : '#6b7280', fontWeight: isOverdue ? '600' : 'normal' }}>
            📅 {isOverdue ? '⚠️ Overdue: ' : 'Follow-up: '}
            {new Date(lead.followUpDate).toLocaleDateString()}
          </p>
        )}

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>

        {/* WhatsApp Button */}
        {lead.phone && (
          
            href={getWhatsAppLink(lead.phone)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background:   '#16a34a',
              color:        'white',
              padding:      '6px 14px',
              borderRadius: '6px',
              fontSize:     '13px',
              textDecoration: 'none',
            }}
          >
            💬 WhatsApp
          </a>
        )}

        {/* Edit Button */}
        {onEdit && (
          <button
            onClick={() => onEdit(lead)}
            style={{
              background:   '#2563eb',
              color:        'white',
              border:       'none',
              padding:      '6px 14px',
              borderRadius: '6px',
              fontSize:     '13px',
              cursor:       'pointer',
            }}
          >
            ✏️ Edit
          </button>
        )}

        {/* Assign Button — Admin only */}
        {showAdmin && onAssign && (
          <button
            onClick={() => onAssign(lead)}
            style={{
              background:   '#7c3aed',
              color:        'white',
              border:       'none',
              padding:      '6px 14px',
              borderRadius: '6px',
              fontSize:     '13px',
              cursor:       'pointer',
            }}
          >
            👤 Assign
          </button>
        )}

        {/* Delete Button — Admin only */}
        {showAdmin && onDelete && (
          <button
            onClick={() => onDelete(lead._id)}
            style={{
              background:   '#ef4444',
              color:        'white',
              border:       'none',
              padding:      '6px 14px',
              borderRadius: '6px',
              fontSize:     '13px',
              cursor:       'pointer',
            }}
          >
            🗑️ Delete
          </button>
        )}

      </div>
    </div>
  );
}