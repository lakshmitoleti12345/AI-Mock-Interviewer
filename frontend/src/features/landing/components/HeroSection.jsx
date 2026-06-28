import Button from "../../../components/ui/Button";

function IllustrationPlaceholder() {
  return (
    <div className="relative flex aspect-square w-full max-w-md items-center justify-center">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent blur-2xl" />
      <div className="card-glow relative w-full rounded-3xl border border-slate-700/60 bg-surface-800/80 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-400/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <div className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-2 text-xs text-slate-500">AI Interview Session</span>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-surface-900/80 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">Interviewer</p>
            <p className="mt-1 text-sm text-slate-300">
              Explain the difference between REST and GraphQL APIs.
            </p>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">Your Answer</p>
            <p className="mt-1 text-sm text-slate-400">
              REST uses fixed endpoints while GraphQL allows clients to request exactly the data they need...
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-950/30 px-4 py-3">
            <span className="text-lg">✓</span>
            <p className="text-sm text-emerald-400">Strong answer — clear structure and good examples</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section id="home" className="hero-glow relative pt-28 pb-20 sm:pt-32 sm:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-300">
            Powered by Google Gemini AI
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Crack Your Next Interview with{" "}
            <span className="gradient-text">AI</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Practice real interview scenarios, get instant AI-powered feedback, and track your
            progress across technical, behavioral, and domain-specific questions — all in one
            platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary" size="lg" href="/register">
              Get Started
            </Button>
            <Button variant="secondary" size="lg" href="#features">
              View Features
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <IllustrationPlaceholder />
        </div>
      </div>
    </section>
  );
}
