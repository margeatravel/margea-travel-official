import { useEffect, useState } from "react";
import { KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fieldClass =
  "w-full h-10 rounded-[10px] bg-white border border-[#1d2839]/15 px-3 font-inter text-[13px] text-[#1d2839] focus:outline-none focus:border-[#1d2839]/40";
const labelClass =
  "block font-inter text-[11px] uppercase tracking-[0.14em] text-[#1d2839]/60 mb-1.5";

export function MemberSecuritySection({ email }: { email: string }) {
  const [providers, setProviders] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const identities = data.user?.identities ?? [];
      const list = identities.map((i) => i.provider);
      setProviders(list.length ? list : ["email"]);
    });
  }, []);

  const hasPassword = providers.includes("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setSaving(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (signInError) {
      setSaving(false);
      toast.error("Current password is incorrect.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: next });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Password updated.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] p-6 md:p-8 border border-[rgba(29,40,57,0.06)] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#c9a96e]" />
          </div>
          <h2 className="font-cormorant text-2xl md:text-3xl text-[#1d2839]">Login method</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {providers.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-inter font-medium uppercase tracking-[0.14em] bg-[#1d2839]/5 text-[#1d2839] border border-[#1d2839]/15"
            >
              <Mail className="w-3.5 h-3.5" />
              {p}
            </span>
          ))}
        </div>
        <p className="font-inter text-[13px] text-[#1d2839]/65 mt-3">{email}</p>
      </div>

      <div className="bg-white rounded-[20px] p-6 md:p-8 border border-[rgba(29,40,57,0.06)] shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-[#c9a96e]" />
          </div>
          <h2 className="font-cormorant text-2xl md:text-3xl text-[#1d2839]">Change password</h2>
        </div>

        {!hasPassword ? (
          <p className="font-inter text-[13px] text-[#1d2839]/70 mt-3">
            Your account signs in with {providers.join(", ")}. Password changes are managed by that
            provider.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 grid sm:grid-cols-2 gap-4 max-w-xl">
            <div className="sm:col-span-2">
              <label className={labelClass}>Current password</label>
              <input
                type="password"
                className={fieldClass}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className={labelClass}>New password</label>
              <input
                type="password"
                className={fieldClass}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className={labelClass}>Confirm new password</label>
              <input
                type="password"
                className={fieldClass}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving || !current || !next || !confirm}
                className="inline-flex items-center gap-2 bg-[#1d2839] hover:bg-[#2a3a52] disabled:opacity-60 text-white font-inter font-medium tracking-wide px-6 h-11 text-[13px] uppercase rounded-[10px] transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Update password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
