interface SiteSearchFormProps {
  defaultQuery?: string
  compact?: boolean
}

export function SiteSearchForm({ defaultQuery = "", compact = false }: SiteSearchFormProps) {
  if (compact) {
    return (
      <form action="/reflections" method="get" className="flex items-stretch gap-2 min-w-0 w-full sm:w-auto">
        <label htmlFor="header-search" className="sr-only">
          Search reflections
        </label>
        <input
          id="header-search"
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search ..."
          className="bevel-in flex-1 min-w-0   text-sm font-mono text-black sm:w-44 focus:outline-none focus:ring-2 focus:ring-nav/50"
        />
        <button type="submit" className="btn3d px-3  text-xs font-bold shrink-0 hover:bg-[#e8e4dc] active:bg-[#d4d0c8]">
          GO!
        </button>
      </form>
    )
  }

  return (
    <form action="/reflections" method="get" className="flex flex-col gap-2">
      <label htmlFor="sidebar-search" className="sr-only">
        Search reflections
      </label>
      <input
        id="sidebar-search"
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="find wisdom…"
        className="bevel-in w-full px-2  text-base sm:text-sm font-mono text-black focus:outline-none focus:ring-2 focus:ring-nav/50"
      />
      <button type="submit" className="btn3d self-start px-4 py-1 text-xs font-bold hover:bg-[#e8e4dc] active:bg-[#d4d0c8]">
        GO!
      </button>
    </form>
  )
}
