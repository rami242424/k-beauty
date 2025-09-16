type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline'
}

export default function Button({ variant = 'outline', className = '', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition'
  const styles = variant === 'solid'
    ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-600)]"
    : "border border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-600)] hover:text-white";
  return <button className={`${base} ${styles} ${className}`} {...rest} />
}
