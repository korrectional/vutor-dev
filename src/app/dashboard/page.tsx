import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  async function ServerComponent() {
  
    const session = await auth.api.getSession({ // check if user is authenticated
      headers: await headers(),
    });

    if (session) {
      return <Dashboard />;
    }
    else{
      redirect('/login');
    }
  }

  return <ServerComponent />;
}
