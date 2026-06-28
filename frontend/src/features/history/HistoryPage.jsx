import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { historyApi } from "../../shared/api";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    historyApi.list()
      .then(({ data }) => setItems(data))
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Interview History</h1>
      {items.length === 0 ? (
        <GlassCard>
          <p className="text-slate-400">No interviews yet. <Link to="/interview/setup" className="text-blue-400">Start your first interview</Link></p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link key={item.id} to={item.status === "completed" ? `/interview/${item.id}/result` : `/interview/${item.id}`}
              className="block rounded-2xl border border-slate-700/50 bg-surface-800/40 p-5 backdrop-blur-md transition hover:border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{item.role}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.interview_type} · {item.difficulty} · {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === "completed" ? "bg-emerald-950/50 text-emerald-400" : "bg-blue-950/50 text-blue-400"
                  }`}>{item.status}</span>
                  {item.overall_score != null && (
                    <p className="mt-1 text-lg font-bold text-white">{item.overall_score}%</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
