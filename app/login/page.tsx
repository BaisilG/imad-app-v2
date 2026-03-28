'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      window.location.href = '/admin';
      return;
    }

    setError('Invalid credentials');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full space-y-4 rounded-xl border p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border p-3" placeholder="Email" required />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full rounded border p-3"
          placeholder="Password"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-blue-600 py-3 font-medium text-white">Login</button>
      </form>
    </main>
  );
}
