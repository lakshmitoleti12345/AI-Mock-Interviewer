import { Link } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import AuthLayout from "./components/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset password" subtitle="Password reset via email coming soon">
      <GlassCard>
        <p className="text-sm leading-relaxed text-slate-400">
          For now, please contact support or create a new account. Full email-based password
          reset will be available in a future release.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          Back to login
        </Link>
      </GlassCard>
    </AuthLayout>
  );
}
