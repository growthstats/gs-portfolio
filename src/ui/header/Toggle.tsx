export default function Toggle() {
  return (
    <label className="[grid-area:toggle] md:hidden">
      <input id="header-toggle" type="checkbox" hidden aria-label="Toggle navigation" />

      <span className="sr-only">Toggle navigation</span>
      <span
        aria-hidden="true"
        className="text-ink inline-flex h-10 w-10 items-center justify-center rounded-md"
      >
        <span className="relative block h-5 w-6">
          <span className="header-open:translate-y-2 header-open:rotate-45 absolute top-0 left-0 block h-0.5 w-6 bg-current transition-transform duration-200" />
          <span className="header-open:opacity-0 absolute top-2 left-0 block h-0.5 w-6 bg-current transition-opacity duration-200" />
          <span className="header-open:-translate-y-2 header-open:-rotate-45 absolute top-4 left-0 block h-0.5 w-6 bg-current transition-transform duration-200" />
        </span>
      </span>
    </label>
  )
}
