import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import User from '@/models/User';

// GET all agents — admin only
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  // Return only agents, exclude password field
  const agents = await User.find({ role: 'agent' }).select('-password');

  return NextResponse.json(agents);
}