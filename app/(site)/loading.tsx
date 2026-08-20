export default function Loading() {
  return (
    <div className="container-site pt-36" aria-busy="true" aria-live="polite">
      <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
      <div className="mt-6 h-12 w-2/3 animate-pulse rounded bg-secondary" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-secondary" />
        ))}
      </div>
    </div>
  );
}
