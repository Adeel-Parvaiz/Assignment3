import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth';
import Activity from '@/models/Activity';

// GET all activities for a specific lead
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth();
  if (error) return error;

  await connectDB();

  const activities = await Activity.find({ lead: params.id })
    .populate('performedBy', 'name role')
    .sort({ createdAt: -1 }); // Latest first

  return NextResponse.json(activities);
}