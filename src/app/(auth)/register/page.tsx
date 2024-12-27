'use client';

import { authClient } from '@/lib/auth-client'; //import the auth client
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const register = async () => {
    try {
      const { data, error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onSuccess: (ctx) => {
            if (ctx.data.session) {
              router.push('/test');
            }
          },
          onError: (ctx) => {
            alert(ctx.error.message);
          },
        }
      );
      if (error) {
        console.error('Registration failed:', error);
      } else if (data) {
        console.log('User registered successfully:', data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
      <input
        type="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={register}>Sign Up</button>
    </div>
  );
}
