export default function Projects() {
  const projects = [
    { name: 'buckler', desc: 'A keyboard firmware for people who think QMK has too many features. Six layers, no macros, no RGB. 14 KB compiled. I use it every day.', tech: 'C', date: '2026' },
    { name: 'gopher-hole', desc: 'A gopher server that serves this site\'s posts over the gopher protocol. Nobody asked for it. Almost nobody will use it. That\'s the point.', tech: 'Go', date: '2025' },
    { name: 'txt2html', desc: 'A tiny text-to-HTML converter with one rule: blank lines become paragraphs. 80 lines of Perl, unchanged since 2003, which I consider a feature.', tech: 'Perl', date: '2003' },
    { name: 'hit-counter', desc: 'A hit counter that doesn\'t count anything. It displays a random number and increments occasionally. It makes me happy.', tech: 'JavaScript', date: '2024' },
    { name: 'this website', desc: 'The thing you\'re looking at. React + Tailwind on top, Postgres underneath, old-web aesthetic all the way through.', tech: 'TypeScript', date: 'ongoing' },
  ];

  return (
    <div className="space-y-4 text-[0.92rem] leading-relaxed max-w-[640px]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-[#a84d10]"><span className="mr-0.5">&gt;</span>projects</h2>
      </div>

      <p className="text-[0.82rem] text-[#555]">Things I've built or am building. Some are useful, some are jokes, some are both.</p>

      <hr className="border-[#ddd]" />

      {projects.map((p) => (
        <article key={p.name} className="border-b border-[#eee] pb-3">
          <h3 className="serif text-[1.05rem] font-bold">
            <a href="#/projects">{p.name}</a> <span className="text-[0.7rem] mono font-normal text-[#888]">[{p.tech}, {p.date}]</span>
          </h3>
          <p className="text-[0.86rem] mt-0.5 text-[#333]">{p.desc}</p>
        </article>
      ))}

      <hr className="border-[#ddd]" />
      <p className="text-[0.8rem] text-[#666]">More projects live in <code>~/src</code> and may or may not ever be finished. That's okay. The web is patient.</p>
    </div>
  );
}
