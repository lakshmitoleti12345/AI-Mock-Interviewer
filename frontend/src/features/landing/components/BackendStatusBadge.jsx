export default function BackendStatusBadge({ health, error, loading }) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-surface-800 px-3 py-1 text-xs text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
        Checking API...
      </span>
    );
  }

  if (error) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-xs text-red-400"
        title={error}
      >
        <span className="h-2 w-2 rounded-full bg-red-500" />
        API Offline
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400"
      title={`Environment: ${health.environment} | Gemini: ${health.gemini_configured ? "configured" : "fallback mode"} | ${health.timestamp}`}
    >
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      API Online · {health.environment}
      {!health.gemini_configured && " · AI fallback"}
    </span>
  );
}
