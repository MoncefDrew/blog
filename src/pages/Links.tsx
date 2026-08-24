export default function Links() {
  const sections: { heading: string; links: { text: string; url: string; note?: string }[] }[] = [
    {
      heading: 'people',
      links: [
        { text: "jwz's home page", url: 'https://www.jwz.org/', note: 'the inspiration for this site' },
        { text: 'Justin Searls', url: 'https://searls.co/', note: 'thoughtful writing about software' },
        { text: 'Julia Evans', url: 'https://jvns.ca/', note: 'zines and posts about systems' },
        { text: 'Drew DeVault', url: 'https://drewdevault.com/', note: 'opinionated and prolific' },
      ],
    },
    {
      heading: 'software & tools',
      links: [
        { text: 'Plan 9 from Bell Labs', url: 'https://9p.io/plan9/', note: "the future that didn't happen" },
        { text: 'OpenBSD', url: 'https://www.openbsd.org/', note: 'correct, secure, simple' },
        { text: 'suckless.org', url: 'https://suckless.org/', note: 'software that sucks less' },
        { text: 'cat-v.org', url: 'https://harmful.cat-v.org/', note: 'things considered harmful' },
      ],
    },
    {
      heading: 'reading',
      links: [
        { text: 'The Unix Programming Environment', url: 'https://en.wikipedia.org/wiki/The_Unix_Programming_Environment', note: 'Kernighan & Pike, 1984' },
        { text: 'The Art of Unix Programming', url: 'https://www.catb.org/esr/writings/taoup/', note: 'Eric Raymond' },
        { text: 'The Jargon File', url: 'https://www.catb.org/jargon/', note: 'a glossary of hacker slang' },
        { text: 'RFC 1', url: 'https://www.rfc-editor.org/rfc/rfc1', note: 'where it all started' },
      ],
    },
    {
      heading: 'old web',
      links: [
        { text: 'Wiby search', url: 'https://wiby.me/', note: 'search engine for the old web' },
        { text: 'The 512kb Club', url: 'https://512kb.club/', note: 'sites under 512 KB' },
        { text: 'Marginalia Search', url: 'https://search.marginalia.nu/', note: 'search for the non-commercial web' },
        { text: 'tilde.club', url: 'http://tilde.club/', note: 'a community of personal home pages' },
      ],
    },
  ];

  return (
    <div className="space-y-4 text-[0.92rem] leading-relaxed max-w-[640px]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-[#a84d10]"><span className="mr-0.5">&gt;</span>links</h2>
      </div>

      <p className="text-[0.82rem] text-[#555]">A link roll, in the old sense. Places I go back to. I don't guarantee they're current, useful, or even still online &mdash; that's half the fun.</p>

      <hr className="border-[#ddd]" />

      {sections.map((sec) => (
        <section key={sec.heading}>
          <h3 className="serif text-[1rem] font-bold text-[#a84d10] mb-1">{sec.heading}</h3>
          <ul className="space-y-1">
            {sec.links.map((link) => (
              <li key={link.url} className="text-[0.86rem]">
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
                {link.note && <span className="text-[#666]"> &mdash; {link.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <hr className="border-[#ddd]" />
      <p className="text-[0.76rem] text-[#666] italic">If your site belongs here and it isn't, that's probably because I forgot. I forget things. It's not personal.</p>
    </div>
  );
}
