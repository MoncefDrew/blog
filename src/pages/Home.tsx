import type { Post } from '@/lib/turso';
import type { Page } from '@/App';

interface Props {
  posts: Post[];
  loading: boolean;
  onOpenPost: (id: string) => void;
  onNavigate: (page: Page) => void;
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

function SectionHeading({ children, more }: { children: string; more?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex items-baseline justify-between border-b border-[#888] pb-0.5 mb-2">
      <h2 className="serif text-[1.1rem] font-bold text-theme-accent">
        <span className="text-theme-accent mr-0.5">&gt;</span>{children}
      </h2>
      {more && (
        <button className="nav-link text-[0.78rem]" onClick={more.onClick}>
          {more.label} &rarr;
        </button>
      )}
    </div>
  );
}

export default function Home({ posts, loading, onOpenPost, onNavigate }: Props) {
  const published = posts.filter((p) => p.published !== false);
  const recent = published.slice(0, 5);
  const latest = published[0];

  return (
    <div className="space-y-5 text-[0.92rem] leading-relaxed">
      {/* Intro */}
      <section className="border-b border-[#ccc] pb-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[0.75rem] mono bg-theme-card border border-theme px-1.5 py-0.5 text-[#555] shadow-sm">
            [ home / index.html ]
          </span>
        </div>
        <p className="serif text-[1.05rem] leading-[1.55]">
          <strong>Hello, traveler beyond the fog!</strong> You have reached a humble corner of the World Wide Web
          devoted to exploring IT topics and deep diving into concepts, paradigms, and techniques of the tech world.
          This blog was created by <a href="#/about">Moncef Mokrani</a>, a Systems Engineering fresh graduate and
          Software Developer.
        </p>
        <p className="text-[0.82rem] text-[#555]">
          All I do here is learn new IT topics and give you the best of it &mdash; exploring computer engineering,
          low-level operating system layers, and software architecture.
        </p>
      </section>

      {/* Latest */}
      {latest && !loading && (
        <section>
          <SectionHeading more={{ label: 'all reflections', onClick: () => onNavigate('writing') }}>
            latest reflection
          </SectionHeading>
          <p className="text-[0.76rem] mono text-[#666]">
            {fmtDate(latest.created_at)} &middot; {latest.author}
          </p>
          <h3 className="serif text-[1.15rem] font-bold mt-0.5">
            <button
              className="text-[#0000cc] hover:text-[#cc0000] underline text-left"
              onClick={() => onOpenPost(latest.id)}
            >
              {latest.title}
            </button>
          </h3>
          <p className="text-[0.88rem] mt-0.5 leading-snug text-[#333]">
            {latest.body
              .replace(/<[^>]*>/g, ' ')
              .split('\n')
              .slice(0, 2)
              .join(' ')
              .slice(0, 240)}
            {latest.body.length > 240 && '...'}
          </p>
          <p className="text-[0.78rem] mt-1">
            <button className="nav-link" onClick={() => onOpenPost(latest.id)}>
              read reflection &rarr;
            </button>
          </p>
        </section>
      )}

      <hr className="border-[#ddd]" />

      {/* Recent reflections list */}
      <section>
        <SectionHeading more={{ label: 'archive', onClick: () => onNavigate('writing') }}>
          recent reflections
        </SectionHeading>
        {loading && <p className="text-[0.82rem] text-[#666]">loading reflections from database...</p>}
        {!loading && recent.length === 0 && (
          <p className="text-[0.82rem] text-[#666]">No reflections posted yet. <a href="#/new">Write one</a>.</p>
        )}
        <div className="space-y-2">
          {recent.map((post) => (
            <article key={post.id} className="border-b border-[#eee] pb-2">
              <div className="flex flex-wrap items-baseline gap-x-2 text-[0.74rem] mono text-[#666]">
                <span>{fmtDate(post.created_at)}</span>
                <span>&middot;</span>
                <span>{post.author}</span>
              </div>
              <h3 className="serif text-[0.98rem] font-bold">
                <button
                  className="text-[#0000cc] hover:text-[#cc0000] underline text-left"
                  onClick={() => onOpenPost(post.id)}
                >
                  {post.title}
                </button>
              </h3>
              <p className="text-[0.82rem] mt-0.5 leading-snug text-[#333]">
                {post.body
                  .replace(/<[^>]*>/g, ' ')
                  .split('\n')
                  .slice(0, 1)
                  .join(' ')
                  .slice(0, 160)}
                {post.body.length > 160 && '...'}
              </p>
            </article>
          ))}
        </div>
      </section>

      <hr className="border-[#ddd]" />

      {/* Quote card */}
      <section className="bg-theme-card border border-theme p-3 text-[0.86rem] shadow-sm">
        <blockquote className="italic text-[#333]">
          &ldquo;Non-technical questions sometimes don't have an answer at all.&rdquo;
        </blockquote>
        <p className="text-right text-[0.75rem] mono text-theme-accent font-bold mt-1">
          &mdash; Linus Torvalds
        </p>
      </section>
    </div>
  );
}
