import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { resumeApi, userApi } from "../../shared/api";
import { useAuth } from "../../shared/context/AuthContext";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ full_name: "", experience: "", preferred_role: "", skills: "", photo_url: "" });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        experience: user.experience || "",
        preferred_role: user.preferred_role || "",
        skills: user.skills || "",
        photo_url: user.photo_url || "",
      });
    }
  }, [user]);

  useEffect(() => {
    resumeApi.list().then(({ data }) => setResumes(data)).catch(() => {});
  }, []);

  const handleSave = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    try {
      await userApi.updateProfile(form);
      await refreshUser();
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await resumeApi.upload(file);
      const { data } = await resumeApi.list();
      setResumes(data);
      toast.success("Resume uploaded!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <GlassCard>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Email" value={user.email} disabled />
          <Input label="Photo URL" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
          <Input label="Experience Level" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          <Input label="Preferred Role" value={form.preferred_role} onChange={(e) => setForm({ ...form, preferred_role: e.target.value })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Skills</label>
            <textarea className="min-h-[80px] w-full rounded-xl border border-slate-700/60 bg-surface-800/60 px-4 py-2.5 text-sm text-white"
              value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Profile"}</Button>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-white">Resume Upload</h2>
        <input type="file" accept=".pdf" onChange={handleUpload} disabled={uploading}
          className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-blue-500" />
        {resumes.length > 0 && (
          <ul className="mt-4 space-y-2">
            {resumes.map((r) => (
              <li key={r.id} className="rounded-lg bg-surface-900/50 px-4 py-2 text-sm text-slate-300">
                {r.filename} · {new Date(r.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
