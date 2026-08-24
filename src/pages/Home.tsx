import type { Post } from '@/lib/supabase';
import type { Page } from '@/App';

interface Props {
  posts: Post[];
  loading: boolean;
  onOpenPost: (id: string) => void;
  onNavigate: (page: Page) => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function SectionHeading({ children, more }: { children: string; more?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex items-baseline justify-between border-b border-[#888] pb-0.5 mb-2">
      <h2 className="serif text-[1.1rem] font-bold text-[#a84d10]">
        <span className="text-[#a84d10] mr-0.5">&gt;</span>{children}
      </h2>
      {more && <button className="nav-link text-[0.78rem]" onClick={more.onClick}>{more.label} &rarr;</button>}
    </div>
  );
}

export default function Home({ posts, loading, onOpenPost, onNavigate }: Props) {
  const recent = posts.slice(0, 5);
  const latest = posts[0];

  return (
    <div className="space-y-5 text-[0.92rem] leading-relaxed">
      {/* Intro */}
      <section className="border-b border-[#ccc] pb-3">
        <p className="serif text-[1.05rem] leading-[1.55]">
          Hi. This is my website. I've been keeping it in one form or another
          since the late nineties. I write about <a href="#/writing">whatever I'm thinking about</a>,
          post notes on <a href="#/projects">things I've built</a>, and maintain a
          <a href="#/links"> list of links</a> I keep meaning to get back to.
        </p>
        <p className="text-[0.82rem] text-[#555] mt-1.5">
          There is no theme, no schedule, and no audience strategy. There is only the page. <span className="italic">You are welcome to look around.</span>
        </p>
      </section>

      {/* Latest */}
      {latest && !loading && (
        <section>
          <SectionHeading more={{ label: 'all writing', onClick: () => onNavigate('writing') }}>latest</SectionHeading>
          <p className="text-[0.76rem] mono text-[#666]">{fmtDate(latest.created_at)} &middot; {latest.author}</p>
          <h3 className="serif text-[1.15rem] font-bold mt-0.5">
            <button className="text-[#0000cc] hover:text-[#cc0000] underline text-left" onClick={() => onOpenPost(latest.id)}>
              {latest.title}
            </button>
          </h3>
          <p className="text-[0.88rem] mt-0.5 leading-snug">
            {latest.body.split('\n').slice(0, 2).join(' ').slice(0, 240)}
            {latest.body.length > 240 && '...'}
          </p>
          <p className="text-[0.78rem] mt-1">
            <button className="nav-link" onClick={() => onOpenPost(latest.id)}>read more &rarr;</button>
          </p>
        </section>
      )}

      <hr className="border-[#ddd]" />

      {/* Recent writing list */}
      <section>
        <SectionHeading more={{ label: 'archive', onClick: () => onNavigate('writing') }}>recent writing</SectionHeading>
        {loading && <p className="text-[0.82rem] text-[#666]">loading...</p>}
        {!loading && recent.length === 0 && (
          <p className="text-[0.82rem] text-[#666]">No posts yet. <a href="#/new">Write one</a>.</p>
        )}
        <div className="space-y-2">
          {recent.map((post) => (
            <article key={post.id} className="border-b border-[#eee] pb-1.5">
              <div className="flex flex-wrap items-baseline gap-x-2 text-[0.74rem] mono text-[#666]">
                <span>{fmtDate(post.created_at)}</span>
                <span>&middot;</span>
                <span>{post.author}</span>
              </div>
              <h3 className="serif text-[0.98rem] font-bold">
                <button className="text-[#0000cc] hover:text-[#cc0000] underline text-left" onClick={() => onOpenPost(post.id)}>
                  {post.title}
                </button>
              </h3>
              <p className="text-[0.82rem] mt-0.5 leading-snug text-[#333]">
                {post.body.split('\n').slice(0, 1).join(' ').slice(0, 150)}
                {post.body.length > 150 && '...'}
              </p>
            </article>
          ))}
        </div>
      </section>

      <hr className="border-[#ddd]" />

      {/* Projects */}
      <section>
        <SectionHeading more={{ label: 'all projects', onClick: () => onNavigate('projects') }}>projects</SectionHeading>
        <div className="space-y-3">
          <ProjectEntry name="buckler" desc="A keyboard firmware for people who think QMK has too many features. Six layers, no macros, no RGB. 14 KB compiled." tech="C" date="2026" />
          <ProjectEntry name="gopher-hole" desc="A gopher server that serves this site's posts over the gopher protocol. Nobody asked for it. Almost nobody will use it." tech="Go" date="2025" />
          <ProjectEntry name="txt2html" desc="A tiny text-to-HTML converter with one rule: blank lines become paragraphs. 80 lines of Perl, unchanged since 2003." tech="Perl" date="2003" />
        </div>
      </section>

      <hr className="border-[#ddd]" />

      {/* Currently */}
      <section>
        <SectionHeading>currently</SectionHeading>
        <ul className="space-y-0.5 text-[0.88rem] list-none pl-0">
          <li><span className="text-[#a84d10] mr-1">&gt;</span> Rebuilding a 1996 IBM Model M keyboard. The springs are louder than I remembered.</li>
          <li><span className="text-[#a84d10] mr-1">&gt;</span> Reading about the history of punctuation. The semicolon is more controversial than you'd think.</li>
          <li><span className="text-[#a84d10] mr-1">&gt;</span> Thinking about starting a gopher hole. Probably won't.</li>
          <li><span className="text-[#a84d10] mr-1">&gt;</span> Adding to <a href="#/links">my link roll</a> faster than I can read any of them.</li>
        </ul>
      </section>

      <hr className="border-[#ddd]" />

      {/* Interesting / misc */}
      <section>
        <SectionHeading>interesting</SectionHeading>
        <p className="text-[0.86rem]">
          A few things worth your time: <a href="#/links">the full link roll</a>, the{' '}
          <a href="#/about">colophon</a> for this site, and an old post about{' '}
          {posts[1] ? <button className="text-[#0000cc] underline" onClick={() => onOpenPost(posts[1].id)}>{posts[1].title.toLowerCase()}</button> : 'the death of the hit counter'}.
        </p>
      </section>
    </div>
  );
}

function ProjectEntry({ name, desc, tech, date }: { name: string; desc: string; tech: string; date: string }) {
  return (
    <div className="border-b border-[#eee] pb-2">
      <h3 className="serif text-[0.98rem] font-bold">
        <a href="#/projects">{name}</a> <span className="text-[0.68rem] mono font-normal text-[#888]">[{tech}, {date}]</span>
      </h3>
      <p className="text-[0.84rem] mt-0.5 text-[#333]">{desc}</p>
      <p className="text-[0.76rem] mt-0.5"><a href="#/projects">more &rarr;</a></p>
    </div>
  );
}
