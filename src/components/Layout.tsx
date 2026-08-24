import type { ReactNode } from 'react';
import type { Page } from '@/App';

interface Props {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  recentPostTitles: { id: string; title: string }[];
  postCount: number;
  writerEmail: string | null;
  onSignOut: () => void;
  onSignInNavigate: () => void;
}

const NAV_ITEMS: { key: Page; label: string }[] = [
  { key: 'home', label: 'home' },
  { key: 'writing', label: 'writing' },
  { key: 'about', label: 'about' },
  { key: 'projects', label: 'projects' },
  { key: 'links', label: 'links' },
];

export default function Layout({ children, currentPage, onNavigate, recentPostTitles, postCount, writerEmail, onSignOut, onSignInNavigate }: Props) {
  return (
    <div className="min-h-screen bg-white text-[#111]">
      <header className="border-b border-[#888]">
        <div className="max-w-[1040px] mx-auto px-3 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 py-3">
            <div>
              <p className="serif text-[0.68rem] uppercase tracking-[0.28em] text-[#777]">books, code &amp; other things</p>
              <h1 className="serif text-[2rem] sm:text-[2.25rem] leading-none font-bold text-[#181818]">
                <button onClick={() => onNavigate('home')} className="hover:text-[#a84d10]">
                  webmaster<span className="text-[#a84d10]">'s</span> home page
                </button>
              </h1>
              <p className="text-[0.78rem] text-[#555] mt-1">a personal web site, established sometime in the previous century</p>
            </div>
            <div className="text-right text-[0.75rem] leading-relaxed">
              <p><a href="#/about">about this site</a> &nbsp;|&nbsp; <a href="#/links">link roll</a>{writerEmail ? <> &nbsp;|&nbsp; <a href="#/new">write a post</a></> : <> &nbsp;|&nbsp; <button className="nav-link" onClick={onSignInNavigate}>writer login</button></>}</p>
              <p className="mono text-[0.68rem] text-[#777]">{postCount} {postCount === 1 ? 'entry' : 'entries'} in the log{writerEmail ? <> &middot; signed in as {writerEmail}</> : null}</p>
            </div>
          </div>

          <div className="border-t border-[#aaa] pt-1.5 pb-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <nav aria-label="Primary navigation" className="flex flex-wrap gap-x-4 gap-y-1 text-[0.82rem]">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`nav-link ${currentPage === item.key ? 'active' : ''}`}
                  aria-current={currentPage === item.key ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <span className="hidden sm:inline text-[#aaa]">|</span>
            <p className="mono text-[0.68rem] text-[#666]">no cookies &middot; no tracking &middot; no nonsense</p>
            {writerEmail && (
              <>
                <span className="hidden sm:inline text-[#aaa]">|</span>
                <button className="nav-link text-[0.78rem]" onClick={onSignOut}>sign out</button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1040px] mx-auto px-3 sm:px-5 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_218px] gap-x-7">
          <main className="min-w-0">{children}</main>

          <aside className="mt-7 lg:mt-0 text-[0.78rem] bg-[#fffef0] border-l border-[#e3dfbf] px-3 py-2.5 self-start">
            <SidebarHeading>quick links</SidebarHeading>
            <ul className="space-y-0.5">
              <li><a href="#/projects">&gt; things I've built</a></li>
              <li><a href="#/writing">&gt; all writing</a></li>
              <li><a href="#/about">&gt; what this is</a></li>
              <li><a href="#/links">&gt; useful places</a></li>
            </ul>

            <SidebarRule />
            <SidebarHeading>latest</SidebarHeading>
            <ul className="space-y-1">
              {recentPostTitles.length === 0 && <li className="muted">nothing here yet</li>}
              {recentPostTitles.slice(0, 6).map((post, index) => (
                <li key={post.id}>
                  <span className="text-[#999] mr-1">{index === 0 ? 'new' : '•'}</span>
                  <a href={`#/post/${post.id}`}>{post.title}</a>
                </li>
              ))}
            </ul>

            <SidebarRule />
            <SidebarHeading>currently</SidebarHeading>
            <ul className="space-y-1 text-[#333]">
              <li><span className="text-[#a84d10]">&gt;</span> rebuilding a Model M</li>
              <li><span className="text-[#a84d10]">&gt;</span> reading about punctuation</li>
              <li><span className="text-[#a84d10]">&gt;</span> thinking about gopher</li>
            </ul>

            <SidebarRule />
            <SidebarHeading>technical</SidebarHeading>
            <p className="leading-relaxed">
              <a href="#/projects">programming</a> &middot; <a href="#/projects">Linux</a> &middot; <a href="#/projects">systems</a> &middot; <a href="#/projects">networks</a> &middot; <a href="#/projects">old computers</a>
            </p>

            <SidebarRule />
            <p className="mono text-[0.68rem] text-[#666] leading-relaxed">
              This sidebar is not a dashboard. It is a list of links in a yellow box because that seemed right in 1998.
            </p>
          </aside>
        </div>
      </div>

      <footer className="border-t border-[#888] mt-4">
        <div className="max-w-[1040px] mx-auto px-3 sm:px-5 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 text-[0.78rem]">
            <FooterColumn title="explore" links={[['home', '#/'], ['writing', '#/writing'], ['projects', '#/projects'], ['links', '#/links']]} />
            <FooterColumn title="about" links={[['about this site', '#/about'], ['write a post', '#/new'], ['the colophon', '#/about'], ['the archive', '#/writing']]} />
            <FooterColumn title="technical" links={[['software', '#/projects'], ['systems', '#/projects'], ['networking', '#/projects'], ['old web', '#/links']]} />
            <FooterColumn title="elsewhere" links={[['link roll', '#/links'], ['useful things', '#/links'], ['interesting people', '#/links'], ['the wider web', '#/links']]} />
          </div>
          <hr className="my-3" />
          <div className="flex flex-wrap justify-between gap-2 text-[0.7rem] text-[#666]">
            <p>&copy; 1996&ndash;2026 webmaster. All rights reserved.</p>
            <p className="mono">HTML by hand &middot; best viewed with a browser</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SidebarHeading({ children }: { children: ReactNode }) {
  return <h2 className="serif text-[1rem] font-bold text-[#a84d10] mb-1">{children}</h2>;
}

function SidebarRule() {
  return <hr className="my-3 border-[#d9d5b5]" />;
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <section>
      <h2 className="serif text-[1rem] font-bold text-[#a84d10] mb-1">{title}</h2>
      <ul className="space-y-0.5">
        {links.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}
      </ul>
    </section>
  );
}
