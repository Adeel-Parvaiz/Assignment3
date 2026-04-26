import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import Lead from '@/models/Lead';

export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  await connectDB();

  const now = new Date();
  const staleDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const baseFilter =
    user!.role === 'admin'
      ? {}
      : { assignedTo: user!.id };

  // ✅ single optimized approach (parallel DB calls)
  const [overdueLeads, staleLeads] = await Promise.all([
    Lead.find({
      ...baseFilter,
      followUpDate: { $lt: now },
      status: { $ne: 'Closed' },
    }).populate('assignedTo', 'name'),

    Lead.find({
      ...baseFilter,
      updatedAt: { $lt: staleDate },
      status: { $ne: 'Closed' },
    }).populate('assignedTo', 'name'),
  ]);

  return NextResponse.json({
    overdueLeads,
    staleLeads,
  });
}