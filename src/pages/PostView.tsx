import type { Post } from '@/lib/supabase';

interface Props {
  post: Post | null;
  loading: boolean;
  onBack: () => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PostView({ post, loading, onBack }: Props) {
  if (loading) return <p className="text-[0.85rem] text-[#666]">loading post...</p>;

  if (!post) {
    return (
      <div className="space-y-2 text-[0.92rem]">
        <p>Post not found. It may have been deleted, or the link is wrong.</p>
        <p><button className="nav-link" onClick={onBack}>&larr; back to writing</button></p>
      </div>
    );
  }

  return (
    <article className="space-y-3 text-[0.92rem] leading-relaxed">
      <p className="text-[0.78rem]"><button className="nav-link" onClick={onBack}>&larr; back to writing</button></p>

      <h2 className="serif text-[1.4rem] font-bold text-[#181818]">{post.title}</h2>

      <div className="text-[0.74rem] mono text-[#666]">
        posted {fmtDate(post.created_at)} by {post.author}
      </div>

      <hr className="border-[#ddd]" />

      <div className="post-body serif whitespace-pre-line">{post.body}</div>

      <hr className="border-[#ddd]" />

      <p className="text-[0.72rem] text-[#666] text-center">--- end of post ---</p>
      <p className="text-[0.78rem] text-center"><button className="nav-link" onClick={onBack}>&larr; return to writing</button></p>
    </article>
  );
}
