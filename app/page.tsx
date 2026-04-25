import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Redirect based on role
  if (!session) {
    redirect('/login');
  }

  if ((session.user as any).role === 'admin') {
    redirect('/admin');
  }

  redirect('/agent');
}