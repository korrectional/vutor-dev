'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {pathname === '/login'
              ? 'Login'
              : pathname === '/logout'
                ? 'Logout'
                : 'Sign Up'}
          </h2>
        </div>
        {children}
        <nav className="flex justify-center space-x-4">
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
          <Link href="/logout" className="text-blue-600 hover:text-blue-800">
            Logout
          </Link>
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </nav>
      </div>
    </div>
  );
}
