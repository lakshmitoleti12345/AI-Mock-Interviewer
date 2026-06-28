export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-700/50 bg-surface-800/40 p-6 shadow-xl backdrop-blur-md card-glow ${className}`}
    >
      {children}
    </div>
  );
}
