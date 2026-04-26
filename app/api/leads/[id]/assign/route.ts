import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import User from '@/models/User';
import { sendEmail } from '@/lib/mailer';
import { assignmentTemplate } from '@/lib/emailTemplates';

// PATCH assign lead to an agent
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const { id } = await params;
  const { agentId } = await req.json();

  if (!agentId) {
    return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
  }

  // Check if agent exists
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'agent') {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const lead = await Lead.findByIdAndUpdate(
    id,
    { assignedTo: agentId, status: 'Contacted' },
    { returnDocument: 'after' }
  ).populate('assignedTo', 'name email');

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Log assignment activity
  await Activity.create({
    lead:        lead._id,
    performedBy: user!.id,
    action:      'Lead Assigned',
    details:     `Lead assigned to agent: ${agent.name}`,
  });

  // Send email to agent
  try {
    await sendEmail({
      to:      agent.email,
      subject: `Lead Assigned to You: ${lead.name}`,
      html:    assignmentTemplate(agent.name, lead.name),
    });
    console.log('Assignment email sent to:', agent.email);
  } catch (emailError: any) {
    console.error('Email error:', emailError.message);
  }

  return NextResponse.json(lead);
}