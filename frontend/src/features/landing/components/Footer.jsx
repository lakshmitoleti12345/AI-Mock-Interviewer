import BackendStatusBadge from "./BackendStatusBadge";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#contact" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export default function Footer({ health, error, loading }) {
  return (
    <footer className="border-t border-slate-800 bg-surface-900/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-lg font-semibold text-white">AI Mock Interviewer</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Your personal AI interview coach. Practice smarter, get actionable feedback, and
              walk into every interview with confidence.
            </p>
            <div className="mt-4">
              <BackendStatusBadge health={health} error={error} loading={loading} />
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                {category}
              </h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-blue-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AI Mock Interviewer. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-blue-400">
              Twitter
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-400">
              GitHub
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-blue-400">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
