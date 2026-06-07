'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.raheeqarabia.com';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
      });

      if (res.status === 401) {
        setError('Wrong username or password.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(`Server error (${res.status}). Try again.`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      window.location.href = '/admin';
    } catch {
      setError('Cannot reach server. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-[0_18px_55px_rgba(0,0,0,0.05)] border border-stone-100">
        <div className="text-center mb-8">
          <h1 className="font-tajawal font-black text-3xl text-emerald mb-2">Raheeq Admin</h1>
          <p className="font-tajawal text-sm text-charcoal/50">Sign in to your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 font-sans text-sm text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-sans font-bold text-sm text-charcoal mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="w-full rounded-xl border border-stone-200 p-4 font-sans text-left bg-stone-50 focus:bg-white focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block font-sans font-bold text-sm text-charcoal mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-stone-200 p-4 font-sans text-left bg-stone-50 focus:bg-white focus:border-emerald focus:ring-1 focus:ring-emerald outline-none transition-all"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth className="h-14 mt-4 text-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
