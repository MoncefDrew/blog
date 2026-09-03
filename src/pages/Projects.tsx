export default function Projects() {
  const projects = [
    {
      name: 'The Daemon Abyss',
      desc: 'Reflections on Computer Engineering, Software Development, and IT topics. Built with React, TypeScript, and Turso libSQL database.',
      tech: 'React / TypeScript / Turso',
      url: 'https://github.com/moncefdrew',
      date: 'ongoing',
    },
  ];

  return (
    <div className="space-y-4 text-[0.92rem] leading-relaxed max-w-[640px]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-theme-accent">
          <span className="mr-0.5">&gt;</span>projects
        </h2>
      </div>

      <p className="text-[0.82rem] text-[#555]">
        Software and systems engineering projects by <strong>Moncef Mokrani</strong>.
      </p>

      <hr className="border-[#ddd]" />

      {projects.map((p) => (
        <article key={p.name} className="border-b border-[#eee] pb-3">
          <h3 className="serif text-[1.05rem] font-bold">
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.name} &rarr;
            </a>{' '}
            <span className="text-[0.7rem] mono font-normal text-[#888]">
              [{p.tech}, {p.date}]
            </span>
          </h3>
          <p className="text-[0.86rem] mt-0.5 text-[#333]">{p.desc}</p>
        </article>
      ))}

      <div className="bg-theme-card border border-theme p-3 text-[0.84rem] text-[#555] space-y-1 shadow-sm">
        <p className="font-bold text-theme-accent">&gt; more projects</p>
        <p>
          Additional projects and experiments are documented on my{' '}
          <a
            href="https://github.com/moncefdrew"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#0000cc]"
          >
            GitHub profile &rarr;
          </a>
          . More writeups will be added here as new repositories are released.
        </p>
      </div>
    </div>
  );
}
