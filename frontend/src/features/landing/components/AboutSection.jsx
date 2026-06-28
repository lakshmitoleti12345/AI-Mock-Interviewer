export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Built for <span className="gradient-text">serious candidates</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              AI Mock Interviewer combines Google Gemini AI with structured interview frameworks
              to simulate real hiring conversations. Whether you&apos;re preparing for FAANG,
              startups, or your first job — practice with confidence.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-blue-400">10K+</p>
                <p className="text-sm text-slate-500">Questions generated</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-400">95%</p>
                <p className="text-sm text-slate-500">User satisfaction</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-surface-800/40 p-8 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-white">Our Mission</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Democratize interview preparation by giving every candidate access to
              AI-powered coaching that was once only available through expensive coaching services.
            </p>
            <h3 className="mt-6 text-lg font-semibold text-white">How It Works</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-400">
              <li>1. Upload your resume or select a role</li>
              <li>2. AI generates tailored interview questions</li>
              <li>3. Answer via text or voice</li>
              <li>4. Get instant scoring and improvement tips</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
