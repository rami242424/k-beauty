export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-xl border p-3 shadow-sm hover:shadow-md transition">
      {children}
    </article>
  )
}
