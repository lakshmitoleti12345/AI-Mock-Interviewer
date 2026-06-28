import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { interviewApi, resumeApi } from "../../shared/api";

const EXPERIENCE_LEVELS = ["fresher", "junior", "mid", "senior", "lead"];
const DIFFICULTIES = ["easy", "medium", "hard"];
const INTERVIEW_TYPES = ["technical", "behavioral", "system_design", "mixed"];

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "Software Engineer",
    experience_level: "mid",
    difficulty: "medium",
    interview_type: "mixed",
    question_count: 5,
    resume_id: "",
  });

  useEffect(() => {
    resumeApi.list().then(({ data }) => setResumes(data)).catch(() => {});
  }, []);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, question_count: Number(form.question_count) };
      if (!payload.resume_id) delete payload.resume_id;
      else payload.resume_id = Number(payload.resume_id);
      const { data } = await interviewApi.create(payload);
      toast.success("Interview created!");
      navigate(`/interview/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Interview Setup</h1>
      <p className="mb-8 text-slate-400">Configure your mock interview session</p>

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Target Role" value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })} required />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Experience Level</label>
              <select className="w-full rounded-xl border border-slate-700/60 bg-surface-800/60 px-4 py-2.5 text-sm text-white"
                value={form.experience_level} onChange={(e) => setForm({ ...form, experience_level: e.target.value })}>
                {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Difficulty</label>
              <select className="w-full rounded-xl border border-slate-700/60 bg-surface-800/60 px-4 py-2.5 text-sm text-white"
                value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Interview Type</label>
              <select className="w-full rounded-xl border border-slate-700/60 bg-surface-800/60 px-4 py-2.5 text-sm text-white"
                value={form.interview_type} onChange={(e) => setForm({ ...form, interview_type: e.target.value })}>
                {INTERVIEW_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
            <Input label="Question Count" type="number" min={1} max={15} value={form.question_count}
              onChange={(e) => setForm({ ...form, question_count: e.target.value })} />
          </div>

          {resumes.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Resume (optional)</label>
              <select className="w-full rounded-xl border border-slate-700/60 bg-surface-800/60 px-4 py-2.5 text-sm text-white"
                value={form.resume_id} onChange={(e) => setForm({ ...form, resume_id: e.target.value })}>
                <option value="">No resume</option>
                {resumes.map((r) => <option key={r.id} value={r.id}>{r.filename}</option>)}
              </select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating questions..." : "Start Interview"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
