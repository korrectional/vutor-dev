import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import MainPage from '../pages/MainPage';

export default function Home() {
  async function ServerComponent() {
  
    const session = await auth.api.getSession({ // check if user is authenticated
      headers: await headers(),
    });

    if (!session) {
      return <MainPage />;
    }
    redirect('/dashboard');
  }

  return <ServerComponent />;
}
