type Props = {
  children: React.ReactNode;
  className?: string;
};
export default function Card({ children, className = "" }: Props) {
  return <article className={`card ${className}`}>{children}</article>;
}
