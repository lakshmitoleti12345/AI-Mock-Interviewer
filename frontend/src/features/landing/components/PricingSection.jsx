const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["3 interviews/month", "Basic AI feedback", "Text answers", "Interview history"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: ["Unlimited interviews", "Advanced AI evaluation", "Voice interviews", "Resume-based questions", "Analytics dashboard"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    features: ["Everything in Pro", "Team management", "Custom domains", "Priority support", "API access"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">Choose the plan that fits your interview prep journey.</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 backdrop-blur-md transition hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-blue-500/50 bg-gradient-to-b from-blue-950/40 to-surface-800/40 card-glow"
                  : "border-slate-700/50 bg-surface-800/40"
              }`}
            >
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-blue-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/register"
                className={`mt-8 block rounded-lg py-2.5 text-center text-sm font-medium transition ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
                    : "border border-slate-600 text-slate-200 hover:border-blue-500/60"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
