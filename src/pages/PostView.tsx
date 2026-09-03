import type { Post } from '@/lib/turso';

interface Props {
  post: Post | null;
  loading: boolean;
  onBack: () => void;
  writerEmail: string | null;
  onEdit?: (id: string) => void;
  onToggleMask?: (id: string, currentlyPublished: boolean) => void;
  onDelete?: (id: string) => void;
}

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export default function PostView({
  post,
  loading,
  onBack,
  writerEmail,
  onEdit,
  onToggleMask,
  onDelete,
}: Props) {
  if (loading) return <p className="text-[0.85rem] text-[#666]">loading reflection...</p>;

  if (!post) {
    return (
      <div className="space-y-2 text-[0.92rem]">
        <p>Reflection not found. It may have been deleted, or the link is wrong.</p>
        <p><button className="nav-link" onClick={onBack}>&larr; back to reflections</button></p>
      </div>
    );
  }

  return (
    <article className="space-y-3 text-[0.92rem] leading-relaxed">
      <div className="flex items-baseline justify-between text-[0.78rem]">
        <button className="nav-link" onClick={onBack}>&larr; back to reflections</button>
        {writerEmail && onEdit && (
          <div className="flex items-center gap-3">
            <button className="nav-link font-bold text-theme-accent" onClick={() => onEdit(post.id)}>
              [ edit reflection ]
            </button>
            {onToggleMask && (
              <button
                className="nav-link"
                onClick={() => onToggleMask(post.id, post.published !== false)}
              >
                {post.published !== false ? '[ mask / hide ]' : '[ unmask / publish ]'}
              </button>
            )}
            {onDelete && (
              <button
                className="nav-link text-[#cc0000]"
                onClick={() => {
                  if (window.confirm(`Permanently delete "${post.title}"?`)) {
                    onDelete(post.id);
                  }
                }}
              >
                [ delete ]
              </button>
            )}
          </div>
        )}
      </div>

      {!post.published && (
        <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] px-2.5 py-1 text-[0.78rem] font-mono">
          [DRAFT / MASKED] This reflection is hidden from public visitors and only visible to you.
        </div>
      )}

      <h2 className="serif text-[1.4rem] font-bold text-[#181818]">{post.title}</h2>

      <div className="text-[0.74rem] mono text-[#666]">
        posted {fmtDate(post.created_at)} by {post.author}
      </div>

      <hr className="border-[#ddd]" />

      {/<[a-z][\s\S]*>/i.test(post.body) ? (
        <div
          className="post-body serif leading-relaxed space-y-2"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      ) : (
        <div className="post-body serif whitespace-pre-line">{post.body}</div>
      )}

      <hr className="border-[#ddd]" />

      <p className="text-[0.72rem] text-[#666] text-center">--- end of reflection ---</p>
      <p className="text-[0.78rem] text-center"><button className="nav-link" onClick={onBack}>&larr; return to reflections</button></p>
    </article>
  );
}
