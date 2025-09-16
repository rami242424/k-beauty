type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline'
}

export default function Button({ variant = 'outline', className = '', ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition'
  const styles = variant === 'solid'
    ? "btn-brand" 
    : "btn-outline-brand";
  return <button className={`${base} ${styles} ${className}`} {...rest} />
}
