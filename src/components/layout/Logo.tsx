export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif text-[1.65rem] font-medium tracking-[0.42em] pl-[0.42em]">SHINE</span>
      <span className="mt-1 text-[0.5rem] font-semibold tracking-[0.5em] pl-[0.5em] opacity-80">NGWE SAUNG</span>
    </span>
  )
}
