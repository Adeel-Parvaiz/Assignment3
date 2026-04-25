'use client';
import { useEffect, useState } from 'react';

interface Activity {
  _id:         string;
  action:      string;
  details?:    string;
  performedBy: { name: string; role: string };
  createdAt:   string;
}

const ACTION_ICONS: Record<string, string> = {
  'Lead Created':   '🟢',
  'Lead Updated':   '🔵',
  'Lead Assigned':  '🟡',
  'Status Updated': '🟠',
};

export default function ActivityTimeline({ leadId }: { leadId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch(`/api/leads/${leadId}/activity`)
      .then(r => r.json())
      .then(setActivities);
  }, [leadId]);

  return (
    <div>
      <h3 style={{ fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
        Activity Timeline
      </h3>

      {/* No activity message */}
      {activities.length === 0 && (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          No activity recorded yet.
        </p>
      )}

      {/* Activity list */}
      {activities.map(activity => (
        <div
          key={activity._id}
          style={{
            display:      'flex',
            gap:          '12px',
            alignItems:   'flex-start',
            marginBottom: '12px',
          }}
        >
          {/* Action icon */}
          <span style={{ fontSize: '20px', marginTop: '2px' }}>
            {ACTION_ICONS[activity.action] || '⚪'}
          </span>

          {/* Activity card */}
          <div
            style={{
              flex:         '1',
              background:   '#f9fafb',
              border:       '1px solid #e5e7eb',
              borderRadius: '8px',
              padding:      '12px',
            }}
          >
            {/* Action name + time */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', fontSize: '14px', color: '#1f2937' }}>
                {activity.action}
              </span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {new Date(activity.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Details */}
            {activity.details && (
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                {activity.details}
              </p>
            )}

            {/* Performed by */}
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              by {activity.performedBy?.name} ({activity.performedBy?.role})
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}