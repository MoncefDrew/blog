import { useState } from 'react';

interface Props {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: string | null }>;
  onCancel: () => void;
}

export default function Login({ onSignIn, onSignUp, onCancel }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    setBusy(true);
    setError(null);
    const fn = mode === 'signin' ? onSignIn : onSignUp;
    const { error: msg } = await fn(email.trim(), password);
    setBusy(false);
    if (msg) {
      setError(msg);
      return;
    }
    if (mode === 'signup') {
      setError(null);
      setMode('signin');
    }
  }

  return (
    <div className="space-y-4 max-w-[420px] text-[0.92rem]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-[#a84d10]">
          <span className="mr-0.5">&gt;</span>{mode === 'signin' ? 'writer sign in' : 'create a writer account'}
        </h2>
      </div>

      <p className="text-[0.82rem] text-[#555]">
        {mode === 'signin'
          ? 'Sign in to write new posts. Reading is public and does not require an account.'
          : 'Create an account to start writing. Email confirmation is not required.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-[0.82rem] font-bold mb-0.5">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-old"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[0.82rem] font-bold mb-0.5">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-old"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && (
          <p className="text-[0.84rem]" style={{ color: '#cc0000' }}>
            <strong>Error:</strong> {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-old disabled:opacity-50">
            {busy ? '...' : mode === 'signin' ? 'sign in' : 'create account'}
          </button>
          <button
            type="button"
            className="btn-old"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
          >
            {mode === 'signin' ? 'need an account?' : 'already have one?'}
          </button>
          <button type="button" className="nav-link text-[0.82rem] self-center ml-auto" onClick={onCancel}>
            &larr; back to site
          </button>
        </div>
      </form>
    </div>
  );
}
