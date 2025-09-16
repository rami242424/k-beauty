type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <article
      className={`flex h-full flex-col rounded-xl border p-3 shadow-sm hover:shadow-md transition ${className}`}
    >
      {children}
    </article>
  );
}
