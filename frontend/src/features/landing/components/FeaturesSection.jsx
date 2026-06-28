const features = [
  {
    icon: "🤖",
    title: "AI Generated Questions",
    description:
      "Get tailored interview questions based on your role, experience level, and target company — powered by Google Gemini.",
  },
  {
    icon: "⚡",
    title: "Instant Feedback",
    description:
      "Receive real-time evaluation on clarity, depth, and structure after every answer so you can improve on the spot.",
  },
  {
    icon: "📊",
    title: "Performance Analytics",
    description:
      "Track scores over time, identify weak areas, and measure your readiness with detailed session reports.",
  },
  {
    icon: "🎯",
    title: "Multiple Interview Domains",
    description:
      "Practice across software engineering, data science, product management, system design, and behavioral interviews.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to{" "}
            <span className="gradient-text">ace your interview</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            From question generation to performance tracking — built for serious interview prep.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="card-glow group rounded-2xl border border-slate-700/50 bg-surface-800/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 text-2xl ring-1 ring-blue-500/20">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
