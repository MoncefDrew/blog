import { useState, useRef } from 'react';
import { tursoDb } from '@/lib/turso';
import PostEditor, { type PostEditorHandle } from '@/components/PostEditor';

interface Props {
  onCreated: () => void;
  onCancel: () => void;
  writerEmail: string | null;
}

export default function NewPost({ onCreated, onCancel, writerEmail }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Moncef Mokrani');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<PostEditorHandle>(null);

  async function handleSubmit(e: React.FormEvent, publish: boolean) {
    e.preventDefault();
    const content = editorRef.current ? editorRef.current.getHTML() : body;
    if (!title.trim() || !content.trim()) {
      setError('Title and reflection body are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await tursoDb.from('posts').insert({
      title: title.trim(),
      body: content.trim(),
      author: author.trim() || 'Moncef Mokrani',
      published: publish,
    });
    setSubmitting(false);
    if (insertError) {
      setError(insertError.message || 'Could not save the reflection. Please try again.');
      return;
    }
    onCreated();
  }

  return (
    <div className="space-y-4 max-w-[580px] text-[0.9rem]">
      <div className="flex items-baseline justify-between border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.15rem] font-bold text-theme-accent">
          <span className="mr-0.5">&gt;</span>write a new reflection
        </h2>
        <button className="nav-link text-[0.8rem]" onClick={onCancel}>
          &larr; cancel
        </button>
      </div>

      <p className="text-[0.8rem] text-[#555]">
        Compose your reflection. You can publish it immediately or save it as a private draft.
        Signed in as <strong>{writerEmail}</strong>.
      </p>

      <form className="space-y-3" onSubmit={(e) => handleSubmit(e, true)}>
        <div>
          <label htmlFor="title" className="block text-[0.8rem] font-bold mb-0.5">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-old"
            maxLength={140}
            placeholder="Reflection title..."
          />
        </div>
        <div>
          <label htmlFor="author" className="block text-[0.8rem] font-bold mb-0.5">
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input-old"
            maxLength={60}
          />
        </div>
        <div>
          <label htmlFor="post_new_body_editor" className="block text-[0.8rem] font-bold mb-0.5">
            Body
          </label>
          <PostEditor
            ref={editorRef}
            id="post_new_body_editor"
            value={body}
            onChange={(html) => setBody(html)}
            placeholder="Write your reflection here..."
          />
        </div>
        {error && (
          <p className="text-[0.82rem]" style={{ color: '#cc0000' }}>
            <strong>Error:</strong> {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="nav-link disabled:opacity-50"
          >
            {submitting ? 'saving...' : 'publish reflection'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmit(e, false)}
            className="nav-link disabled:opacity-50"
          >
            save as draft
          </button>
          <button type="button" onClick={onCancel} className="nav-link">
            cancel
          </button>
        </div>
      </form>
    </div>
  );
}
