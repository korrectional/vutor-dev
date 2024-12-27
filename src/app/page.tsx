'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [message, setMessage] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/hello');
      const { message } = await res.json();
      setMessage(message);
    };
    fetchData();
  }, []);

  if (!message) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <button
        className="absolute top-0 left-0 m-4 bg-black hover:bg-gray-700 text-gray-300 font-bold py-2 px-4 rounded-md"
        onClick={() => router.push('/chat')}
      >
        Chat
      </button>
      <p>{message}</p>
    </div>
  );
}
