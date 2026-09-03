export default function Links() {
  const personalLinks = [
    {
      title: 'GitHub',
      url: 'https://github.com/moncefdrew',
      note: 'Open-source projects, code samples, and software experiments.',
    },
    {
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/moncef-mokrani/',
      note: 'Professional profile, experience, and career updates.',
    },
    {
      title: 'Twitter / X',
      url: 'https://x.com/moncefdrew',
      note: 'Thoughts, links, and occasional musings from the timeline.',
    },
    {
      title: 'Email',
      url: 'mailto:moncefmokr@gmail.com',
      note: 'Drop me a line at moncefmokr@gmail.com.',
    },
  ];

  const readingLinks = [
    {
      title: 'Alan Watts Organization',
      url: 'https://alanwatts.org/',
      note: 'Official archive, lectures, and writings of Alan Watts.',
    },
    {
      title: 'Stanford Encyclopedia of Philosophy',
      url: 'https://plato.stanford.edu/',
      note: 'Peer-reviewed entries on consciousness, mind, and Eastern philosophy.',
    },
    {
      title: 'Internet Archive',
      url: 'https://archive.org/',
      note: 'A digital library preserving the wisdom of ages past.',
    },
  ];

  return (
    <div className="space-y-4 text-[0.92rem] leading-relaxed max-w-[640px]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-theme-accent">
          <span className="mr-0.5">&gt;</span>links
        </h2>
      </div>

      <p className="text-[0.82rem] text-[#555]">
        Hyperlinks to find <strong>Moncef Mokrani</strong> on the wider web, plus recommended destinations
        for the curious mind.
      </p>

      <hr className="border-[#ddd]" />

      <section>
        <h3 className="serif text-[1rem] font-bold text-theme-accent mb-2">&gt; contact &amp; social</h3>
        <ul className="space-y-2.5">
          {personalLinks.map((link) => (
            <li key={link.url} className="border border-theme bg-theme-card p-2.5 shadow-sm">
              <a
                href={link.url}
                target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="font-bold text-[0.92rem]"
              >
                {link.title} &rarr;
              </a>
              <p className="text-[0.8rem] text-[#444] mt-0.5">{link.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-[#ddd]" />

      <section>
        <h3 className="serif text-[1rem] font-bold text-theme-accent mb-2">&gt; further reading &amp; resources</h3>
        <ul className="space-y-2.5">
          {readingLinks.map((link) => (
            <li key={link.url} className="border border-theme bg-theme-card p-2.5 shadow-sm">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[0.92rem]">
                {link.title} &rarr;
              </a>
              <p className="text-[0.8rem] text-[#444] mt-0.5">{link.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-[#ddd]" />
      <p className="text-[0.76rem] text-[#666] italic">
        More links will be added over time as I discover worthy places on the web.
      </p>
    </div>
  );
}
