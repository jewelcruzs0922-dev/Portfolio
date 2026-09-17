export default function Footer() {
  return (
    <footer className="py-6 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between opacity-70">
        <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)]">JC</span>
        <span className="text-[8px] tracking-[0.3em] text-[var(--color-ink-dim)]">{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
