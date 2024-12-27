import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default function TestPage() {
  async function ServerComponent() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return <div>Not authenticated</div>;
    }
    return (
      <div>
        <h1>Welcome {session.user.name}</h1>
      </div>
    );
  }

  return <ServerComponent />;
}
