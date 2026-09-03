import { useState, useEffect, useRef } from 'react';
import { updatePost, deletePost, type Post } from '@/lib/turso';
import PostEditor, { type PostEditorHandle } from '@/components/PostEditor';

interface Props {
  post: Post | null;
  loading: boolean;
  onUpdated: () => void;
  onDeleted: () => void;
  onCancel: () => void;
  writerEmail: string | null;
}

export default function EditPost({
  post,
  loading,
  onUpdated,
  onDeleted,
  onCancel,
  writerEmail,
}: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Moncef Mokrani');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const editorRef = useRef<PostEditorHandle>(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setAuthor(post.author || 'Moncef Mokrani');
      setBody(post.body || '');
      setPublished(post.published !== false);
    }
  }, [post]);

  if (loading) {
    return <p className="text-[0.85rem] text-[#666]">loading reflection for editing...</p>;
  }

  if (!post) {
    return (
      <div className="space-y-3 text-[0.92rem]">
        <p>Reflection not found to edit.</p>
        <p>
          <button className="nav-link" onClick={onCancel}>
            &larr; back to reflections
          </button>
        </p>
      </div>
    );
  }

  async function handleSave(newPublishStatus?: boolean) {
    const currentBody = editorRef.current ? editorRef.current.getHTML() : body;
    if (!title.trim() || !currentBody.trim()) {
      setError('Title and reflection body are required.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const targetPublished =
      newPublishStatus !== undefined ? newPublishStatus : published;

    const { error: updateError } = await updatePost(post!.id, {
      title: title.trim(),
      author: author.trim() || 'Moncef Mokrani',
      body: currentBody.trim(),
      published: targetPublished,
    });

    setSubmitting(false);
    if (updateError) {
      setError(updateError.message || 'Could not update reflection.');
      return;
    }
    onUpdated();
  }

  async function handleDeleteConfirm() {
    setDeleting(true);
    setError(null);
    const { error: delError } = await deletePost(post!.id);
    setDeleting(false);
    if (delError) {
      setError(delError.message || 'Could not delete reflection.');
      return;
    }
    onDeleted();
  }

  return (
    <div className="space-y-4 max-w-[620px] text-[0.9rem]">
      <div className="flex items-baseline justify-between border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.15rem] font-bold text-theme-accent">
          <span className="mr-0.5">&gt;</span>edit reflection
        </h2>
        <button className="nav-link text-[0.8rem]" onClick={onCancel}>
          &larr; cancel
        </button>
      </div>

      <div className="bg-theme-card border border-theme p-2.5 text-[0.8rem] flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div>
          <span>Status: </span>
          {published ? (
            <span className="text-[#006600] font-bold">Public (Published)</span>
          ) : (
            <span className="text-theme-accent font-bold">Masked / Draft (Hidden from public)</span>
          )}
        </div>
        <p className="mono text-[0.74rem] text-[#666]">
          signed in: {writerEmail}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-3"
      >
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
          <label
            htmlFor={`post_editor_${post.id}`}
            className="block text-[0.8rem] font-bold mb-0.5"
          >
            Body
          </label>
          <PostEditor
            ref={editorRef}
            id={`post_editor_${post.id}`}
            value={post.body || ''}
            height="360px"
            onChange={(html) => setBody(html)}
          />
        </div>

        <div className="border border-theme bg-theme-card p-2.5 space-y-1 text-[0.82rem] shadow-sm">
          <label className="flex items-center gap-2 cursor-pointer font-bold">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-[var(--theme-accent)]"
            />
            <span>Published (uncheck to mask/hide from public view)</span>
          </label>
          <p className="text-[0.74rem] text-[#666] pl-5">
            Masked reflections are stored in your drafts and are only visible when logged in.
          </p>
        </div>

        {error && (
          <p className="text-[0.82rem]" style={{ color: '#cc0000' }}>
            <strong>Error:</strong> {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting || deleting}
            className="btn-old disabled:opacity-50"
          >
            {submitting ? 'saving...' : 'save changes'}
          </button>

          <button
            type="button"
            disabled={submitting || deleting}
            onClick={() => handleSave(!published)}
            className="btn-old disabled:opacity-50"
          >
            {published ? 'mask reflection (hide)' : 'unmask & publish'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting || deleting}
            className="btn-old"
          >
            cancel
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            disabled={submitting || deleting}
            className="btn-old ml-auto text-[#cc0000] border-[#cc0000]"
          >
            delete entirely...
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal / Dialog */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-theme-card border-2 border-theme-dark p-4 max-w-sm w-full space-y-3 shadow-xl">
            <h3 className="serif text-[1.1rem] font-bold text-[#cc0000]">
              &gt; confirm permanent deletion
            </h3>
            <p className="text-[0.82rem] text-[#333]">
              Are you sure you want to delete <strong>&ldquo;{post.title}&rdquo;</strong> entirely?
              This action cannot be undone and permanently deletes the reflection from Turso.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="btn-old"
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleting}
              >
                cancel
              </button>
              <button
                type="button"
                className="btn-old text-[#cc0000] border-[#cc0000] font-bold"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'deleting...' : 'yes, delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
