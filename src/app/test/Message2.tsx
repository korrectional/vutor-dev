'use client'
import { useEffect, useState } from 'react';
import { authClient } from "@/lib/auth-client";

function Message2(){
  const [session1, setSession] = useState<any>(null); // Use 'any' type for simplicity
  const getUser = async () => {
    const session = await authClient.getSession();
    setSession(session);
  }
  useEffect(() => {
    getUser();
  }, [])

  return <h1>Hello {session1?.data?.user?.name || '...'}</h1>
}


export default Message2