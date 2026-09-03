import type { ReactNode } from 'react';
import type { Page } from '@/App';
import { isTursoConfigured } from '@/lib/turso';
import { useTheme } from '@/lib/theme';

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
  { key: 'writing', label: 'reflections' },
  { key: 'about', label: 'about me' },
  { key: 'links', label: 'links' },
];

export default function Layout({
  children,
  currentPage,
  onNavigate,
  recentPostTitles,
  postCount,
  writerEmail,
  onSignOut,
  onSignInNavigate,
}: Props) {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white text-[#111]">
      <header className="border-b border-[#888]">
        <div className="max-w-[1040px] mx-auto px-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <img
                src="/sword-2.png"
                alt="The Daemon Abyss icon"
                className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 object-contain"
              />
              <div>
                <p className="serif text-[0.68rem] uppercase tracking-[0.24em] text-[#777]">
                  systems engineering &middot; tech journal
                </p>
                <h1 className="serif text-[1.9rem] sm:text-[2.25rem] leading-none font-bold text-[#181818]">
                  <button onClick={() => onNavigate('home')} className="hover-text-theme-accent text-left">
                    The Daemon <span className="text-theme-accent italic">Abyss</span>
                  </button>
                </h1>
                <p className="text-[0.78rem] text-[#555] mt-1 font-mono">
                  ~ reflections in the spirit of the tech ~
                </p>
              </div>
            </div>

            <div className="text-right text-[0.75rem] leading-relaxed">
              <p>
                <a href="#/about">about me</a> &nbsp;|&nbsp; <a href="#/links">links</a>
                {writerEmail ? (
                  <>
                    {' '}&nbsp;|&nbsp; <a href="#/new">write post</a>
                    {' '}&nbsp;|&nbsp;{' '}
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="btn-old text-[0.7rem] py-0 px-1.5 font-bold border-theme-dark bg-theme-card"
                      title="Admin theme toggle: Click to switch between Sword and Classic palettes"
                    >
                      theme: {theme === 'sword' ? '⚔️ sword' : '📜 classic'}
                    </button>
                  </>
                ) : (
                  <>
                    {' '}&nbsp;|&nbsp;{' '}
                    <button className="nav-link" onClick={onSignInNavigate}>
                      writer login
                    </button>
                  </>
                )}
              </p>
              <p className="mono text-[0.68rem] text-[#777]">
                {postCount} {postCount === 1 ? 'reflection' : 'reflections'} in log
                {writerEmail ? <> &middot; writer: {writerEmail}</> : null}
              </p>
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
            <p className="mono text-[0.68rem] text-[#666]">
              no tracking &middot; no nonsense &middot;{' '}
              {isTursoConfigured ? (
                <span className="text-[#006600]">connected to turso db</span>
              ) : (
                <span>local cache</span>
              )}
            </p>
            {writerEmail && (
              <>
                <span className="hidden sm:inline text-[#aaa]">|</span>
                <button className="nav-link text-[0.78rem]" onClick={onSignOut}>
                  sign out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1040px] mx-auto px-3 sm:px-5 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-x-7">
          <main className="min-w-0">{children}</main>

          <aside className="mt-7 lg:mt-0 text-[0.78rem] bg-[#f6f8fb] border border-[#ccd2e0] px-3 py-2.5 self-start shadow-sm">
            <SidebarHeading>quick links</SidebarHeading>
            <ul className="space-y-0.5">
              <li><a href="#/writing">&gt; all reflections</a></li>
              <li><a href="#/about">&gt; about me</a></li>
              <li><a href="#/links">&gt; find me online</a></li>
            </ul>

            <SidebarRule />
            <SidebarHeading>latest reflections</SidebarHeading>
            <ul className="space-y-1">
              {recentPostTitles.length === 0 && <li className="muted">no reflections yet</li>}
              {recentPostTitles.slice(0, 6).map((post, index) => (
                <li key={post.id}>
                  <span className="text-[#999] mr-1">{index === 0 ? 'new' : '•'}</span>
                  <a href={`#/post/${post.id}`}>{post.title}</a>
                </li>
              ))}
            </ul>

            <SidebarRule />
            <SidebarHeading>author</SidebarHeading>
            <div className="space-y-1 text-[#333]">
              <p className="font-bold">Moncef Mokrani</p>
              <p className="text-[0.74rem] text-[#555]">
                System Engineering Graduate &middot; Software Developer
              </p>
              <p className="text-[0.74rem] text-[#666]">Algeria</p>
            </div>

            <SidebarRule />
            <SidebarHeading>focus areas</SidebarHeading>
            <p className="leading-relaxed text-[#444]">
              Systems Engineering &middot; Linux Administration &middot; Low-Level Layers &middot; Enterprise Software
            </p>

            <SidebarRule />
            <p className="mono text-[0.68rem] text-[#666] leading-relaxed">
              The Daemon Abyss &mdash; exploring tech, mind &amp; machine.
            </p>
          </aside>
        </div>
      </div>

      {/* Improved Retro Footbar */}
      <footer className="border-t border-[#a8b2c8] bg-[#f6f8fb] mt-8">
        <div className="max-w-[1040px] mx-auto px-3 sm:px-5 pt-5 pb-4">
          {/* Footbar Identity & Live System Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#ccd2e0]">
            <div className="flex items-center gap-2.5">
              <img
                src="/sword-2.png"
                alt="Sword glyph"
                className="w-7 h-7 object-contain shrink-0"
              />
              <div>
                <span className="serif font-bold text-[0.98rem] text-[#181818]">
                  The Daemon <span className="text-[#a62646] italic">Abyss</span>
                </span>
                <span className="mono text-[0.68rem] text-[#666] ml-2 hidden sm:inline">
                  // systems engineering &middot; tech journal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[0.72rem] mono">
              <span className="inline-block w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span className="text-[#444]">
                {isTursoConfigured ? 'TURSO DATABASE ONLINE (aws-eu-west-1)' : 'LOCAL CACHE MODE'}
              </span>
            </div>
          </div>

          {/* 4-column Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 text-[0.78rem]">
            <FooterColumn
              title="navigation"
              links={[
                ['> home / portal', '#/'],
                ['> all reflections', '#/writing'],
                ['> author profile', '#/about'],
                ['> web directory', '#/links'],
              ]}
            />
            <FooterColumn
              title="topics & areas"
              links={[
                ['> systems architecture', '#/writing'],
                ['> linux kernel & low-level', '#/writing'],
                ['> enterprise engineering', '#/writing'],
                ['> network & protocols', '#/links'],
              ]}
            />
            <FooterColumn
              title="connect & social"
              links={[
                ['GitHub [moncefmokrani]', 'https://github.com/moncefmokrani'],
                ['LinkedIn [/in/moncef-mokrani]', 'https://www.linkedin.com/in/moncef-mokrani/'],
                ['Twitter / X [@moncefdrew]', 'https://x.com/moncefdrew'],
                ['Email [direct]', 'mailto:moncefmokr@gmail.com'],
              ]}
              isExternal
            />
            <FooterColumn
              title="writer tools"
              links={[
                ['> write new post', '#/new'],
                ['> drafts & editor', '#/writing'],
                ['> writer sign in', '#/login'],
                ['> external links', '#/links'],
              ]}
            />
          </div>

          {/* Retro 88x31-style Web Badges & Theme Switcher */}
          <div className="my-4 pt-3 border-t border-theme flex flex-wrap items-center justify-between gap-3 text-[0.68rem] mono text-[#666]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-theme-dark bg-white px-2 py-0.5 shadow-sm font-bold text-[#333]">
                HTML 4.01 STRICT
              </span>
              <span className="border border-theme-dark bg-white px-2 py-0.5 shadow-sm text-[#333]">
                800x600 OPTIMIZED
              </span>
              <span className="border border-theme-dark bg-white px-2 py-0.5 shadow-sm text-[#006600]">
                NO TRACKING
              </span>
              <span className="border border-theme-dark bg-white px-2 py-0.5 shadow-sm text-theme-accent font-bold">
                TURSO LIBSQL
              </span>
            </div>

            {/* Theme Switcher in Footbar */}
            <div className="flex items-center gap-2">
              <span className="text-[#666]">theme:</span>
              <button
                type="button"
                onClick={() => setTheme('sword')}
                className={`px-1.5 py-0.5 text-[0.68rem] border ${
                  theme === 'sword'
                    ? 'bg-white border-theme-dark font-bold text-theme-accent'
                    : 'border-transparent text-[#777] hover:underline'
                }`}
                title="Sword Theme (Ruby & Steel Blue)"
              >
                ⚔️ sword
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => setTheme('classic')}
                className={`px-1.5 py-0.5 text-[0.68rem] border ${
                  theme === 'classic'
                    ? 'bg-white border-theme-dark font-bold text-theme-accent'
                    : 'border-transparent text-[#777] hover:underline'
                }`}
                title="Classic Theme (Amber & Parchment)"
              >
                📜 classic
              </button>
              <span className="text-[#ccc] mx-1">|</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="nav-link text-[0.74rem] font-bold text-theme-accent"
              >
                [^ top]
              </button>
            </div>
          </div>

          {/* Bottom Copyright & Colophon */}
          <div className="pt-2 border-t border-theme flex flex-wrap justify-between items-center gap-2 text-[0.7rem] text-[#666]">
            <p>&copy; 2024&ndash;2026 Moncef Mokrani &middot; The Daemon Abyss. All rights reserved.</p>
            <p className="mono">Handcrafted in 1998 retro spirit &middot; Vite &amp; React</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SidebarHeading({ children }: { children: ReactNode }) {
  return <h2 className="serif text-[1rem] font-bold text-theme-accent mb-1">{children}</h2>;
}

function SidebarRule() {
  return <hr className="my-3 border-theme" />;
}

function FooterColumn({
  title,
  links,
  isExternal = false,
}: {
  title: string;
  links: [string, string][];
  isExternal?: boolean;
}) {
  return (
    <section>
      <h2 className="serif text-[0.96rem] font-bold text-theme-accent mb-1.5">{title}</h2>
      <ul className="space-y-0.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              target={isExternal && !href.startsWith('mailto:') ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
