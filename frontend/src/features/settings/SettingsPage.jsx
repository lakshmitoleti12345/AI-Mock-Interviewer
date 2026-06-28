import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import GlassCard from "../../components/ui/GlassCard";

import Button from "../../components/ui/Button";

import LoadingSpinner from "../../components/ui/LoadingSpinner";

import ErrorMessage from "../../components/ui/ErrorMessage";

import { settingsApi } from "../../shared/api";

import { useAuth } from "../../shared/context/AuthContext";



export default function SettingsPage() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    settingsApi.get()

      .then(({ data }) => setSettings(data))

      .catch(() => setError("Failed to load settings"))

      .finally(() => setLoading(false));

  }, []);



  const handleLogout = async () => {

    await logout();

    navigate("/login");

  };



  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error} />;



  return (

    <div className="mx-auto max-w-2xl space-y-6">

      <h1 className="text-2xl font-bold text-white">Settings</h1>



      <GlassCard>

        <h2 className="mb-4 text-lg font-semibold text-white">Account</h2>

        <dl className="space-y-3 text-sm">

          <div className="flex justify-between"><dt className="text-slate-400">Name</dt><dd className="text-white">{user?.full_name}</dd></div>

          <div className="flex justify-between"><dt className="text-slate-400">Email</dt><dd className="text-white">{user?.email}</dd></div>

          <div className="flex justify-between"><dt className="text-slate-400">Role</dt><dd className="text-white capitalize">{user?.role}</dd></div>

        </dl>

      </GlassCard>



      <GlassCard>

        <h2 className="mb-4 text-lg font-semibold text-white">AI Configuration</h2>

        <div className="flex items-center gap-3">

          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${settings?.gemini_configured ? "bg-emerald-400" : "bg-amber-400"}`} />

          <span className="text-sm text-slate-300">

            {settings?.gemini_configured ? "Gemini AI is configured" : "Gemini AI is not configured"}

          </span>

        </div>

        {settings?.gemini_message && (

          <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">

            {settings.gemini_message}

          </p>

        )}

        <p className="mt-3 text-xs text-slate-500">

          Environment: {settings?.app_env} · App: {settings?.app_name}

        </p>

      </GlassCard>



      <GlassCard>

        <h2 className="mb-4 text-lg font-semibold text-red-400">Session</h2>

        <p className="mb-4 text-sm text-slate-400">Sign out of your account on this device.</p>

        <Button variant="secondary" onClick={handleLogout}>Sign Out</Button>

      </GlassCard>

    </div>

  );

}


