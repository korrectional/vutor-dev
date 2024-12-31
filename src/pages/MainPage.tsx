'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';




export default function Home() {
  const [message, setMessage] = useState(); // this is how you create carrying vars in nextjs
  const router = useRouter();

  
  useEffect(() => { // test to see if everything is working
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
      <p className="absolute top-0 right-0 m-4 text-gray-700 font-medium">
        {message}
      </p>
      <div className="flex space-x-4 mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
          onClick={() => router.push('/login')}
        >
          Login
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          onClick={() => router.push('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
}
