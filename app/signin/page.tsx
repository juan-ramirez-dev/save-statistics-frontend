'use client';

import { SignInForm } from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-8">
          Click Statistics
        </h1>
        <SignInForm />
      </div>
    </main>
  );
} 