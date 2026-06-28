import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Get in touch</h2>
            <p className="mt-4 text-slate-400">Have questions? We&apos;d love to hear from you.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-10 space-y-4 rounded-2xl border border-slate-700/50 bg-surface-800/40 p-8 backdrop-blur-md">
            <input className="w-full rounded-xl border border-slate-700/60 bg-surface-900/60 px-4 py-2.5 text-sm text-white"
              placeholder="Your name" value={form.name} required
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="w-full rounded-xl border border-slate-700/60 bg-surface-900/60 px-4 py-2.5 text-sm text-white"
              placeholder="Email" type="email" value={form.email} required
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea className="min-h-[120px] w-full rounded-xl border border-slate-700/60 bg-surface-900/60 px-4 py-2.5 text-sm text-white"
              placeholder="Your message" value={form.message} required
              onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  );
}
