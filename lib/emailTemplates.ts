// Email template for new lead notification (sent to admin)
export function newLeadTemplate(leadName: string, priority: string, budget: number) {
  const priorityColor =
    priority === 'High' ? '#ef4444' :
    priority === 'Medium' ? '#f97316' : '#22c55e';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
      <div style="background: #1e40af; color: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h1 style="margin: 0;">Property CRM</h1>
        <p style="margin: 5px 0 0;">New Lead Notification</p>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
        <h2 style="color: #1f2937;">New Lead Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; color: #6b7280;">Lead Name:</td>
            <td style="padding: 8px; font-weight: bold;">${leadName}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 8px; color: #6b7280;">Budget:</td>
            <td style="padding: 8px; font-weight: bold;">PKR ${budget.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; color: #6b7280;">Priority:</td>
            <td style="padding: 8px;">
              <span style="background: ${priorityColor}; color: white; padding: 3px 10px; border-radius: 20px; font-size: 13px;">
                ${priority}
              </span>
            </td>
          </tr>
        </table>
        <a href="${process.env.NEXTAUTH_URL}/admin/leads"
           style="display: inline-block; margin-top: 15px; background: #1e40af; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          View Lead
        </a>
      </div>
    </div>
  `;
}

// Email template for lead assignment notification (sent to agent)
export function assignmentTemplate(agentName: string, leadName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
      <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h1 style="margin: 0;">Property CRM</h1>
        <p style="margin: 5px 0 0;">Lead Assignment Notification</p>
      </div>
      <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
        <h2 style="color: #1f2937;">Lead Assigned to You</h2>
        <p>Hi <strong>${agentName}</strong>,</p>
        <p>Lead <strong>${leadName}</strong> has been assigned to you. Please follow up as soon as possible.</p>
        <a href="${process.env.NEXTAUTH_URL}/agent/leads"
           style="display: inline-block; margin-top: 15px; background: #16a34a; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          View My Leads
        </a>
      </div>
    </div>
  `;
}