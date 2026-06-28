import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-900/40">
        AI
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">
        AI Mock Interviewer
      </span>
    </Link>
  );
}
