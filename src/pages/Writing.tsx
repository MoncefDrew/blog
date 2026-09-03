import { useState } from 'react';
import type { Post } from '@/lib/turso';

interface Props {
  posts: Post[];
  loading: boolean;
  onOpenPost: (id: string) => void;
  onNewPost: () => void;
  writerEmail: string | null;
  onEditPost?: (id: string) => void;
  onToggleMask?: (id: string, currentlyPublished: boolean) => void;
  onDeletePost?: (id: string) => void;
}

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function Writing({
  posts,
  loading,
  onOpenPost,
  onNewPost,
  writerEmail,
  onEditPost,
  onToggleMask,
  onDeletePost,
}: Props) {
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');

  const publishedPosts = posts.filter((p) => p.published !== false);
  const draftPosts = posts.filter((p) => p.published === false);

  const displayedPosts =
    !writerEmail
      ? publishedPosts
      : filter === 'published'
      ? publishedPosts
      : filter === 'drafts'
      ? draftPosts
      : posts;

  return (
    <div className="space-y-4 text-[0.92rem] leading-relaxed">
      <div className="flex items-baseline justify-between border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-theme-accent">
          <span className="mr-0.5">&gt;</span>reflections
        </h2>
        {writerEmail && (
          <button className="nav-link" onClick={onNewPost}>
            + new reflection
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.78rem] mono text-[#666]">
        <p>
          {loading
            ? 'loading reflections...'
            : `${displayedPosts.length} ${displayedPosts.length === 1 ? 'reflection' : 'reflections'}, newest first`}
        </p>

        {writerEmail && (
          <div className="flex items-center gap-2">
            <span>view:</span>
            <button
              onClick={() => setFilter('all')}
              className={`nav-link ${filter === 'all' ? 'font-bold underline' : ''}`}
            >
              all ({posts.length})
            </button>
            <span>&middot;</span>
            <button
              onClick={() => setFilter('published')}
              className={`nav-link ${filter === 'published' ? 'font-bold underline' : ''}`}
            >
              published ({publishedPosts.length})
            </button>
            <span>&middot;</span>
            <button
              onClick={() => setFilter('drafts')}
              className={`nav-link ${filter === 'drafts' ? 'font-bold underline text-theme-accent' : ''}`}
            >
              drafts / masked ({draftPosts.length})
            </button>
          </div>
        )}
      </div>

      <hr className="border-[#ddd]" />

      {displayedPosts.length === 0 && !loading && (
        <p className="text-[0.88rem] text-[#555]">
          {filter === 'drafts'
            ? 'No draft or masked reflections.'
            : 'No reflections yet. '}
          {writerEmail && (
            <button className="nav-link" onClick={onNewPost}>
              Write one
            </button>
          )}
        </p>
      )}

      <div className="space-y-0">
        {displayedPosts.map((post, idx) => (
          <article key={post.id} className={`py-3 ${idx > 0 ? 'border-t border-[#eee]' : ''}`}>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.74rem] mono text-[#666]">
              <span>{fmtDate(post.created_at)}</span>
              <span>&mdash;</span>
              <span>{post.author}</span>
              {!post.published && (
                <span className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] px-1.5 py-0.2 text-[0.68rem] font-bold">
                  [DRAFT / MASKED]
                </span>
              )}
            </div>

            <h3 className="serif text-[1.05rem] font-bold mt-0.5">
              <button
                className="text-[#0000cc] hover:text-[#cc0000] underline text-left"
                onClick={() => onOpenPost(post.id)}
              >
                {post.title}
              </button>
            </h3>

            <p className="text-[0.86rem] mt-0.5 leading-snug text-[#333]">
              {post.body
                .replace(/<[^>]*>/g, ' ')
                .split('\n')
                .slice(0, 2)
                .join(' ')
                .slice(0, 240)}
              {post.body.length > 240 && '...'}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[0.76rem] mt-1">
              <button className="nav-link" onClick={() => onOpenPost(post.id)}>
                read reflection &rarr;
              </button>

              {writerEmail && onEditPost && (
                <>
                  <span className="text-[#bbb]">|</span>
                  <button
                    className="nav-link font-bold text-theme-accent"
                    onClick={() => onEditPost(post.id)}
                  >
                    [edit]
                  </button>
                  {onToggleMask && (
                    <button
                      className="nav-link text-[#555]"
                      onClick={() => onToggleMask(post.id, post.published !== false)}
                    >
                      {post.published !== false ? '[mask]' : '[unmask]'}
                    </button>
                  )}
                  {onDeletePost && (
                    <button
                      className="nav-link text-[#cc0000]"
                      onClick={() => {
                        if (window.confirm(`Permanently delete "${post.title}"?`)) {
                          onDeletePost(post.id);
                        }
                      }}
                    >
                      [delete]
                    </button>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
