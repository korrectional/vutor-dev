'use client';

import { authClient } from '@/lib/auth-client'; //import the auth client
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const Loading = () => {
    return (loading ? <div>Loading...</div> : <div>Login</div>);
  }
  const LoadingColor = (loading: boolean) => {
    return (loading ? "#63aeff" : "#007bff");
  }

  const login = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          console.log("THINKING");
          setLoading(true);
        },
        onSuccess: () => {
          console.log("SUCCESS");
          router.push('/dashboard');
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem", color: "#333" }}>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: LoadingColor(loading),
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          <Loading/>
        </button>
      </div>
    </div>
  );
}