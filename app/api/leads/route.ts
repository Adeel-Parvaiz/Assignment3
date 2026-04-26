import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAuth, requireAdmin } from '@/lib/auth';
import Lead from '@/models/Lead';
import Activity from '@/models/Activity';
import { sendEmail } from '@/lib/mailer';
import { newLeadTemplate } from '@/lib/emailTemplates';

// GET all leads — admin sees all, agent sees only assigned
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  await connectDB();

  const leads = user!.role === 'admin'
    ? await Lead.find({}).populate('assignedTo', 'name email').sort({ score: -1 })
    : await Lead.find({ assignedTo: user!.id }).populate('assignedTo', 'name email');

  return NextResponse.json(leads);
}

// POST create new lead — admin only
export async function POST(req: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const body = await req.json();

  if (!body.name || !body.budget) {
    return NextResponse.json(
      { error: 'Name and budget are required' },
      { status: 400 }
    );
  }

  // Create lead in database
  const lead = await Lead.create(body);
  console.log('Lead created:', lead.name, '| Priority:', lead.priority);

  // Record activity in audit log
  await Activity.create({
    lead:        lead._id,
    performedBy: user!.id,
    action:      'Lead Created',
    details:     `New lead "${lead.name}" created with ${lead.priority} priority`,
  });

  // Send email notification to admin
  console.log('Sending email to:', process.env.ADMIN_EMAIL);
  try {
    await sendEmail({
      to:      process.env.ADMIN_EMAIL!,
      subject: `New Lead Created: ${lead.name}`,
      html:    newLeadTemplate(lead.name, lead.priority, lead.budget),
    });
    console.log('Email sent successfully to admin!');
  } catch (emailError: any) {
    console.error('Email sending failed:', emailError.message);
  }

  return NextResponse.json(lead, { status: 201 });
}