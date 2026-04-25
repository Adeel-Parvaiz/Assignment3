import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import Lead from '@/models/Lead';
import User from '@/models/User';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();

  const leads = await Lead.find({}).populate('assignedTo', 'name');

  // Priority distribution
  const priorityStats = {
    High:   leads.filter(l => l.priority === 'High').length,
    Medium: leads.filter(l => l.priority === 'Medium').length,
    Low:    leads.filter(l => l.priority === 'Low').length,
  };

  // Status distribution
  const statusStats = {
    New:         leads.filter(l => l.status === 'New').length,
    Contacted:   leads.filter(l => l.status === 'Contacted').length,
    'In Progress': leads.filter(l => l.status === 'In Progress').length,
    Closed:      leads.filter(l => l.status === 'Closed').length,
  };

  // Agent performance: leads per agent
  const agentMap: Record<string, { name: string; count: number }> = {};
  leads.forEach(lead => {
    if (lead.assignedTo) {
      const agent = lead.assignedTo as any;
      if (!agentMap[agent._id]) {
        agentMap[agent._id] = { name: agent.name, count: 0 };
      }
      agentMap[agent._id].count++;
    }
  });

  return NextResponse.json({
    total:        leads.length,
    priorityStats,
    statusStats,
    agentPerformance: Object.values(agentMap),
  });
}