import type { Post } from '@/lib/supabase';

interface Props {
  posts: Post[];
  loading: boolean;
  onOpenPost: (id: string) => void;
  onNewPost: () => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Writing({ posts, loading, onOpenPost, onNewPost }: Props) {
  return (
    <div className="space-y-4 text-[0.92rem] leading-relaxed">
      <div className="flex items-baseline justify-between border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-[#a84d10]">
          <span className="mr-0.5">&gt;</span>writing
        </h2>
        <button className="btn-old" onClick={onNewPost}>+ new post</button>
      </div>

      <p className="text-[0.78rem] mono text-[#666]">
        {loading ? 'loading...' : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}, newest first`}
      </p>

      <hr className="border-[#ddd]" />

      {posts.length === 0 && !loading && (
        <p className="text-[0.88rem] text-[#555]">
          No posts yet. <button className="nav-link" onClick={onNewPost}>Write the first one</button>.
        </p>
      )}

      <div className="space-y-0">
        {posts.map((post, idx) => (
          <article key={post.id} className={`py-3 ${idx > 0 ? 'border-t border-[#eee]' : ''}`}>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[0.74rem] mono text-[#666]">
              <span>{fmtDate(post.created_at)}</span>
              <span>&mdash;</span>
              <span>{post.author}</span>
            </div>
            <h3 className="serif text-[1.05rem] font-bold mt-0.5">
              <button className="text-[#0000cc] hover:text-[#cc0000] underline text-left" onClick={() => onOpenPost(post.id)}>
                {post.title}
              </button>
            </h3>
            <p className="text-[0.86rem] mt-0.5 leading-snug text-[#333]">
              {post.body.split('\n').slice(0, 2).join(' ').slice(0, 240)}
              {post.body.length > 240 && '...'}
            </p>
            <p className="text-[0.76rem] mt-1">
              <button className="nav-link" onClick={() => onOpenPost(post.id)}>read more &rarr;</button>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
