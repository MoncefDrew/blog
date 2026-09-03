import { useState } from 'react';
import { isTursoConfigured } from '@/lib/turso';

interface Props {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  onCancel: () => void;
}

export default function Login({ onSignIn, onCancel }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Email/username and password are required.');
      return;
    }
    setBusy(true);
    setError(null);
    const { error: msg } = await onSignIn(identifier.trim(), password);
    setBusy(false);
    if (msg) {
      setError(msg);
      return;
    }
  }

  return (
    <div className="space-y-4 max-w-[420px] text-[0.92rem]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-theme-accent">
          <span className="mr-0.5">&gt;</span>writer sign in
        </h2>
      </div>

      <div className="bg-theme-card border border-theme p-2.5 text-[0.8rem] text-[#444] space-y-1 shadow-sm">
        <p className="font-bold text-theme-accent">
          &gt; {isTursoConfigured ? 'Turso Cloud Database Connected' : 'Local Storage Mode'}
        </p>
        <p>
          Authentication is reserved for authorized writers (managed via <code>.env</code>).
        </p>
      </div>

      <p className="text-[0.82rem] text-[#555]">
        Sign in with your primary writer account or the secondary account configured in <code>.env</code>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="identifier" className="block text-[0.82rem] font-bold mb-0.5">
            Email or Username
          </label>
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="input-old"
            autoComplete="username"
            placeholder="e.g. moncef or editor"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[0.82rem] font-bold mb-0.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-old"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-[0.84rem]" style={{ color: '#cc0000' }}>
            <strong>Error:</strong> {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button type="submit" disabled={busy} className="btn-old disabled:opacity-50">
            {busy ? 'signing in...' : 'sign in'}
          </button>
          <button type="button" className="nav-link text-[0.82rem] ml-auto" onClick={onCancel}>
            &larr; back to site
          </button>
        </div>
      </form>
    </div>
  );
}
