import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import User from '@/models/User';

// PATCH assign lead to an agent
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  await connectDB();

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
    params.id,
    { assignedTo: agentId, status: 'Contacted' },
    { new: true }
  ).populate('assignedTo', 'name email');

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  // Log assignment activity
  await Activity.create({
    lead:        lead._id,
    performedBy: user!.id,
    action:      'Lead Assigned',
    details:     `Lead assigned to agent: ${agent.name}`,
  });

  return NextResponse.json(lead);
}