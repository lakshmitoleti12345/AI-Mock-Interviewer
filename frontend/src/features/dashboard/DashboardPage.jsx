import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { dashboardApi } from "../../shared/api";

function StatCard({ label, value, accent }) {
  return (
    <GlassCard className="text-center">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent || "text-white"}`}>{value ?? "—"}</p>
    </GlassCard>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    dashboardApi.stats()
      .then(({ data }) => { setStats(data); setError(""); })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Track your interview progress</p>
        </div>
        <Button to="/interview/setup">Start New Interview</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Interviews" value={stats.total_interviews} />
        <StatCard label="Completed" value={stats.completed_interviews} accent="text-blue-400" />
        <StatCard label="Average Score" value={stats.average_score != null ? `${stats.average_score}%` : null} accent="text-emerald-400" />
        <StatCard label="Best Score" value={stats.best_score != null ? `${stats.best_score}%` : null} accent="text-indigo-400" />
      </div>

      {stats.score_trend?.length > 0 && (
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-white">Score Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.score_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="role" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }} />
              <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold text-emerald-400">Strong Topics</h2>
          <ul className="space-y-2">
            {(stats.strong_topics?.length ? stats.strong_topics : ["Complete interviews to see insights"]).map((t) => (
              <li key={t} className="text-sm text-slate-300">• {t}</li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <h2 className="mb-3 text-lg font-semibold text-amber-400">Weak Topics</h2>
          <ul className="space-y-2">
            {(stats.weak_topics?.length ? stats.weak_topics : ["Complete interviews to see insights"]).map((t) => (
              <li key={t} className="text-sm text-slate-300">• {t}</li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Interviews</h2>
        {stats.recent_interviews?.length === 0 ? (
          <p className="text-sm text-slate-400">No interviews yet. <Link to="/interview/setup" className="text-blue-400">Start one</Link></p>
        ) : (
          <div className="space-y-3">
            {stats.recent_interviews.map((i) => (
              <Link key={i.id} to={`/interview/${i.id}/result`} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-surface-900/50 px-4 py-3 transition hover:border-blue-500/30">
                <div>
                  <p className="font-medium text-white">{i.role}</p>
                  <p className="text-xs text-slate-500">{i.interview_type} · {i.difficulty}</p>
                </div>
                <span className="text-sm text-blue-400">{i.overall_score != null ? `${i.overall_score}%` : i.status}</span>
              </Link>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
