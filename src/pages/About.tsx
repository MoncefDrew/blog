export default function About() {
  return (
    <div className="space-y-5 text-[0.92rem] leading-relaxed max-w-[660px]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-theme-accent">
          <span className="mr-0.5">&gt;</span>about me
        </h2>
      </div>

      {/* Profile Card with prof.jpg */}
      <div className="bg-theme-card border border-theme p-3 sm:p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start shadow-sm">
        <img
          src="/blog/prof.jpg"
          alt="Portrait of Moncef Mokrani"
          className="w-28 h-28 shrink-0 object-cover object-[50%_20%] border border-[#888]"
        />
        <div className="text-center sm:text-left space-y-1">
          <h3 className="serif text-[1.25rem] font-bold text-[#181818]">Moncef Mokrani</h3>
          <p className="mono text-[0.78rem] text-[#333]">
            System Engineering Graduate &middot; Software Developer
          </p>
          <p className="mono text-[0.75rem] text-[#666]">Algeria</p>
          <p className="text-[0.78rem] text-theme-accent font-mono pt-1">
            Author &amp; Maintainer &mdash; The Daemon Abyss
          </p>
        </div>
      </div>

      <p>
        I'm <strong>Moncef Mokrani</strong>, a fresh system engineering graduate from Algeria, and a software
        developer with 2 years of experience building scalable and maintainable software solutions.
      </p>

      <p>
        I'm currently focusing more on system administration and enterprise software management while
        empowering my understanding of low-level layers and thus improving my problem-solving and
        analytical skills for the future.
      </p>

      <p>
        This journal &mdash; <strong>The Daemon Abyss</strong> &mdash; is where I explore Computer
        Engineering, Software Development, and IT topics. Browse the{' '}
        <a href="#/writing">reflections</a> or find my contact channels on the{' '}
        <a href="#/links">links page</a>.
      </p>

     

      <h3 className="serif text-[1.05rem] font-bold text-theme-accent mt-3">technical focus</h3>
      <ul className="list-disc pl-5 space-y-1 text-[0.88rem]">
        <li><strong>Systems Engineering:</strong> Operating systems, low-level architecture, process concurrency</li>
        <li><strong>System Administration:</strong> Linux environments, enterprise server management, automation</li>
        <li><strong>Software Development:</strong> Clean, scalable, maintainable application architectures</li>
        <li><strong>Data &amp; Persistence:</strong> Distributed databases, SQL, libSQL / Turso</li>
      </ul>

      <h3 className="serif text-[1.05rem] font-bold text-theme-accent mt-3">find me online</h3>
      <div className="bg-theme-card border border-theme p-3 text-[0.84rem] shadow-sm">
        <ul className="space-y-1">
          <li>
            <span className="font-bold text-theme-accent">&gt;</span>{' '}
            <a href="https://github.com/moncefdrew" target="_blank" rel="noopener noreferrer">
              GitHub &rarr;
            </a>{' '}
            <span className="text-[#666]">&mdash; Open-source projects &amp; code</span>
          </li>
          <li>
            <span className="font-bold text-theme-accent">&gt;</span>{' '}
            <a href="https://www.linkedin.com/in/moncef-mokrani/" target="_blank" rel="noopener noreferrer">
              LinkedIn &rarr;
            </a>{' '}
            <span className="text-[#666]">&mdash; Professional profile &amp; experience</span>
          </li>
          <li>
            <span className="font-bold text-theme-accent">&gt;</span>{' '}
            <a href="https://x.com/moncefdrew" target="_blank" rel="noopener noreferrer">
              Twitter / X &rarr;
            </a>{' '}
            <span className="text-[#666]">&mdash; Thoughts and tech musings</span>
          </li>
          <li>
            <span className="font-bold text-theme-accent">&gt;</span>{' '}
            <a href="mailto:moncefmokr@gmail.com">
              Email &rarr;
            </a>{' '}
            <span className="text-[#666]">&mdash; moncefmokr@gmail.com</span>
          </li>
        </ul>
      </div>

      <hr className="border-[#ddd]" />
      <p className="text-[0.76rem] text-[#666] italic">
        The Daemon Abyss &middot; established with care, curiosity, and code.
      </p>
    </div>
  );
}
