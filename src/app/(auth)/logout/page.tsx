'use client'; // not moved yet

import { authClient } from '@/lib/auth-client'; //import the auth client
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/'); // redirect to login page
        },
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <div className="flex space-x-4 mt-4">
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
        onClick={() => logout()}
      >
        Are you sure?
      </button>
    </div>
  </div>
  );
}
