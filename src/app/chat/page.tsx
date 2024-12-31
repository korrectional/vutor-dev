import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Chats from "@/pages/Chat";

export default function ChatsPage() {

  async function ServerComponent() {
  
    const session = await auth.api.getSession({ // check if user is authenticated
      headers: await headers(),
    });

    if (session) {
      return <Chats />;
    }
    else{
      redirect('/login');
    }
  }
  return <ServerComponent/>;
}
