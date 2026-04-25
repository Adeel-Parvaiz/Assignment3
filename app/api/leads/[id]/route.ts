import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAuth, requireAdmin } from '@/lib/auth';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';

// GET single lead by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  await connectDB();

  const lead = await Lead.findById(params.id).populate('assignedTo', 'name email');
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  return NextResponse.json(lead);
}

// PATCH update lead fields
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  await connectDB();

  const body = await req.json();
  const lead = await Lead.findByIdAndUpdate(params.id, body, { new: true });

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  // Log which fields were updated
  await Activity.create({
    lead:        lead._id,
    performedBy: user!.id,
    action:      'Lead Updated',
    details:     `Updated fields: ${Object.keys(body).join(', ')}`,
  });

  return NextResponse.json(lead);
}

// DELETE lead (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const lead = await Lead.findByIdAndDelete(params.id);
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  return NextResponse.json({ message: 'Lead deleted successfully' });
}