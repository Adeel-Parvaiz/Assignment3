import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';

// PATCH set follow-up date for a lead
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth();
  if (error) return error;

  await connectDB();

  const { followUpDate } = await req.json();

  if (!followUpDate) {
    return NextResponse.json({ error: 'Follow-up date is required' }, { status: 400 });
  }

  const lead = await Lead.findByIdAndUpdate(
    params.id,
    { followUpDate: new Date(followUpDate) },
    { new: true }
  );

  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

  await Activity.create({
    lead:        lead._id,
    performedBy: user!.id,
    action:      'Follow-up Scheduled',
    details:     `Follow-up set for ${new Date(followUpDate).toLocaleDateString()}`,
  });

  return NextResponse.json(lead);
}