import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  onCreated: () => void;
  onCancel: () => void;
  writerEmail: string | null;
}

export default function NewPost({ onCreated, onCancel, writerEmail }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) { setError('Title and body are required.'); return; }
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from('posts').insert({
      title: title.trim(), body: body.trim(), author: author.trim() || 'anonymous',
    });
    setSubmitting(false);
    if (insertError) { setError('Could not save the post. Please try again.'); return; }
    onCreated();
  }

  return (
    <div className="space-y-4 max-w-[580px] text-[0.9rem]">
      <div className="flex items-baseline justify-between border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.15rem] font-bold text-[#a84d10]"><span className="mr-0.5">&gt;</span>write a new post</h2>
        <button className="nav-link text-[0.8rem]" onClick={onCancel}>&larr; cancel</button>
      </div>

      <p className="text-[0.8rem] text-[#555]">Posts are public. Keep it interesting. Signed in as <strong>{writerEmail}</strong>.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="title" className="block text-[0.8rem] font-bold mb-0.5">Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-old" maxLength={140} />
        </div>
        <div>
          <label htmlFor="author" className="block text-[0.8rem] font-bold mb-0.5">Your name <span className="muted font-normal">(optional)</span></label>
          <input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="input-old" maxLength={60} placeholder="anonymous" />
        </div>
        <div>
          <label htmlFor="body" className="block text-[0.8rem] font-bold mb-0.5">Body</label>
          <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="input-old" />
          <p className="text-[0.7rem] text-[#666] mt-0.5">Line breaks preserved. No HTML, no markdown &mdash; just text.</p>
        </div>
        {error && <p className="text-[0.82rem]" style={{ color: '#cc0000' }}><strong>Error:</strong> {error}</p>}
        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={submitting} className="btn-old disabled:opacity-50">{submitting ? 'posting...' : 'submit post'}</button>
          <button type="button" onClick={onCancel} className="btn-old">cancel</button>
        </div>
      </form>
    </div>
  );
}
