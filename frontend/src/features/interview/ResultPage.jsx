import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { interviewApi } from "../../shared/api";

function ScoreBar({ label, score }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-white">{score ?? "—"}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-800">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
          style={{ width: `${score || 0}%` }} />
      </div>
    </div>
  );
}

function parseJsonList(str) {
  try { return JSON.parse(str); } catch { return []; }
}

export default function ResultPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    interviewApi.get(id)
      .then(({ data }) => setInterview(data))
      .catch(() => setError("Failed to load results"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!interview) return null;

  const strengths = parseJsonList(interview.strengths);
  const weaknesses = parseJsonList(interview.weaknesses);
  const suggestions = parseJsonList(interview.suggestions);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Interview Results</h1>
        <p className="text-slate-400">{interview.role} · {interview.overall_rating}</p>
      </div>

      <GlassCard className="text-center">
        <p className="text-sm text-slate-400">Overall Score</p>
        <p className="mt-2 text-6xl font-bold gradient-text">{interview.overall_score ?? "—"}%</p>
      </GlassCard>

      <GlassCard className="space-y-4">
        <ScoreBar label="Communication" score={interview.communication_score} />
        <ScoreBar label="Technical" score={interview.technical_score} />
        <ScoreBar label="Confidence" score={interview.confidence_score} />
        <ScoreBar label="Grammar" score={interview.grammar_score} />
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard>
          <h3 className="mb-2 font-semibold text-emerald-400">Strengths</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            {strengths.map((s) => <li key={s}>• {s}</li>)}
          </ul>
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 font-semibold text-amber-400">Weaknesses</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            {weaknesses.map((w) => <li key={w}>• {w}</li>)}
          </ul>
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 font-semibold text-blue-400">Suggestions</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            {suggestions.map((s) => <li key={s}>• {s}</li>)}
          </ul>
        </GlassCard>
      </div>

      <div className="flex justify-center gap-4">
        <Button to="/interview/setup">New Interview</Button>
        <Button variant="secondary" to="/dashboard">Dashboard</Button>
        <Button variant="ghost" to="/history">History</Button>
      </div>
    </div>
  );
}
