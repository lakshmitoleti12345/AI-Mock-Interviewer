export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <input
        className={`w-full rounded-xl border border-slate-700/60 bg-surface-800/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${error ? "border-red-500/60" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
