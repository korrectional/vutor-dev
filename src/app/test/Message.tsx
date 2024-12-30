'use client'
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from 'react';
//import { useSession } from "@/lib/auth-client"; // Ensure this is a hook

function Message(){
  // JSX: Javascript XML
  const [name, setName] = useState<string | null>(null);
  const { data: session } = authClient.useSession(); // Use the hook correctly

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  return <h1>Hello {name || '...'}</h1>;
}

export default Message;