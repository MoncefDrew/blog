export default function About() {
  return (
    <div className="space-y-4 text-[0.92rem] leading-relaxed max-w-[640px]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-[#a84d10]"><span className="mr-0.5">&gt;</span>about</h2>
      </div>

      <hr className="border-[#ddd]" />

      <p>
        I'm <strong>webmaster</strong>. I've been on the internet long enough
        to remember when it was spelled with a capital I. I write software,
        collect old computers, and keep this website because I think personal
        home pages are one of the best things the web ever invented.
      </p>

      <p>
        This site is a blog in the original sense of the word: a web log. A
        sequence of things I felt like writing down, in reverse chronological
        order, with no editorial calendar and no analytics. You can{' '}
        <a href="#/writing">read the writing</a> or{' '}
        <a href="#/new">add your own post</a> &mdash; I left the door open.
      </p>

      <h3 className="serif text-[1rem] font-bold text-[#a84d10] mt-4">colophon</h3>
      <p>
        Built with React and Tailwind, backed by Postgres. The visual style is
        deliberately old: serif body type, underlined links, thin borders, no
        shadows, no gradients, no glassmorphism. The goal is to look like a
        website that has been here since 1998 and simply never saw a reason to
        redesign.
      </p>

      <h3 className="serif text-[1rem] font-bold text-[#a84d10] mt-4">contact</h3>
      <p>
        I don't have a contact form. I don't want one. If you know me, you know
        how to reach me. If you don't, you can write in the{' '}
        <a href="#/writing">log</a> &mdash; that's as close to a guestbook as
        this site gets.
      </p>

      <h3 className="serif text-[1rem] font-bold text-[#a84d10] mt-4">things I like</h3>
      <ul className="list-disc pl-5 space-y-0.5">
        <li>Keyboards with buckling springs</li>
        <li>Plain text</li>
        <li>Web pages that load fast and stay loaded</li>
        <li>Software that does one thing</li>
        <li>The semicolon (controversial)</li>
      </ul>

      <h3 className="serif text-[1rem] font-bold text-[#a84d10] mt-4">things I don't like</h3>
      <ul className="list-disc pl-5 space-y-0.5">
        <li>Cookie banners</li>
        <li>Websites that reload when you scroll</li>
        <li>The word "content" used as a mass noun</li>
        <li>Dark patterns</li>
        <li>Popups that ask if you want to subscribe before you've read anything</li>
      </ul>

      <hr className="border-[#ddd]" />
      <p className="text-[0.76rem] text-[#666] italic">This page was last updated on a Tuesday, which feels appropriate.</p>
    </div>
  );
}
