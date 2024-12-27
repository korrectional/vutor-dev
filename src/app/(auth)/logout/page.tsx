'use client';

import { authClient } from '@/lib/auth-client'; //import the auth client
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login'); // redirect to login page
        },
      },
    });
  };

  return (
    <div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
