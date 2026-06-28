import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { interviewApi } from "../../shared/api";
import { useSpeechRecognition } from "../../shared/hooks/useSpeechRecognition";

export default function InterviewScreenPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { transcript, listening, supported, startListening, stopListening, setTranscript } =
    useSpeechRecognition();

  useEffect(() => {
    interviewApi.get(id)
      .then(({ data }) => {
        setInterview(data);
        const firstUnanswered = data.questions.findIndex((q) => !q.answered);
        setCurrentIdx(firstUnanswered >= 0 ? firstUnanswered : 0);
      })
      .catch(() => setError("Failed to load interview"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (transcript) setAnswer(transcript);
  }, [transcript]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!interview) return null;

  const questions = interview.questions;
  const current = questions[currentIdx];
  const allAnswered = questions.every((q) => q.answered);
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) { toast.error("Please provide an answer"); return; }
    setSubmitting(true);
    try {
      await interviewApi.submitAnswer(id, current.id, {
        answer_text: answer,
        transcript: transcript || null,
      });
      toast.success("Answer submitted!");
      const updated = await interviewApi.get(id);
      setInterview(updated.data);
      setAnswer("");
      setTranscript("");
      const nextUnanswered = updated.data.questions.findIndex((q) => !q.answered);
      if (nextUnanswered >= 0) {
        setCurrentIdx(nextUnanswered);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await interviewApi.complete(id);
      toast.success("Interview completed!");
      navigate(`/interview/${id}/result`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to complete");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{interview.role} Interview</h1>
          <p className="text-sm text-slate-400">Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <span className="rounded-full bg-blue-950/50 px-4 py-1.5 text-sm font-mono text-blue-300">
          {formatTime(timer)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-surface-800">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      <GlassCard>
        <span className="text-xs font-medium uppercase tracking-wider text-blue-400">{current.category}</span>
        <h2 className="mt-2 text-lg font-semibold text-white">{current.question_text}</h2>
      </GlassCard>

      <GlassCard>
        <label className="mb-2 block text-sm font-medium text-slate-300">Your Answer</label>
        <textarea
          className="min-h-[160px] w-full rounded-xl border border-slate-700/60 bg-surface-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Type your answer or use the microphone..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        {supported && (
          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={listening ? stopListening : startListening}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                listening ? "animate-pulse bg-red-600 text-white" : "bg-blue-600 text-white hover:bg-blue-500"
              }`}>
              🎤
            </button>
            <span className="text-sm text-slate-400">
              {listening ? "Listening... speak now" : "Click mic for voice input"}
            </span>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!current.answered && (
            <Button onClick={handleSubmitAnswer} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Answer"}
            </Button>
          )}
          {allAnswered && (
            <Button onClick={handleComplete} disabled={submitting}>
              {submitting ? "Evaluating..." : "Complete Interview"}
            </Button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
