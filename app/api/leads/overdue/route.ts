import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import Lead from '@/models/Lead';

// GET leads with overdue or no follow-up (stale leads)
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  await connectDB();

  const now       = new Date();
  const staleDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const filter = user!.role === 'admin' ? {} : { assignedTo: user!.id };

  // Leads where follow-up date has passed
  const overdueLeads = await Lead.find({
    ...filter,
    followUpDate: { $lt: now },
    status:       { $ne: 'Closed' },
  }).populate('assignedTo', 'name');

  // Leads not updated in 7 days (stale)
  const staleLeads = await Lead.find({
    ...filter,
    updatedAt: { $lt: staleDate },
    status:    { $ne: 'Closed' },
  }).populate('assignedTo', 'name');

  return NextResponse.json({ overdueLeads, staleLeads });
}