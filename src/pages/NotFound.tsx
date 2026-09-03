interface Props {
  onHome: () => void;
}

export default function NotFound({ onHome }: Props) {
  return (
    <div className="space-y-3 text-[0.92rem] max-w-[480px]">
      <div className="border-b border-[#888] pb-0.5">
        <h2 className="serif text-[1.25rem] font-bold text-theme-accent"><span className="mr-0.5">&gt;</span>404 &mdash; not found</h2>
      </div>
      <p>The page you asked for doesn't exist. It might have moved, been deleted, or never existed. These things happen on the web.</p>
      <p><button className="nav-link" onClick={onHome}>&larr; back to the home page</button></p>
    </div>
  );
}
