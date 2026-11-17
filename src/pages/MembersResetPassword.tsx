import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Language } from "@/components/LanguageToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import margeaLogoWhite from "@/assets/margea-logo-white.png";

type Status = "verifying" | "ready" | "invalid";

export default function MembersResetPassword() {
  const [language, setLanguage] = useState<Language>("en");
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("verifying");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Establish the recovery session from the link (PKCE ?code=... or legacy #access_token=...)
  useEffect(() => {
    let active = true;

    const verify = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const errorDescription =
        url.searchParams.get("error_description") || hash.get("error_description");

      if (errorDescription) {
        if (active) setStatus("invalid");
        toast.error(errorDescription);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!active) return;
        setStatus(error ? "invalid" : "ready");
        if (error) toast.error("This reset link is invalid or has expired.");
        return;
      }

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!active) return;
        setStatus(error ? "invalid" : "ready");
        if (error) toast.error("This reset link is invalid or has expired.");
        return;
      }

      // Supabase client may have already consumed the link via detectSessionInUrl
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setStatus(data.session ? "ready" : "invalid");
    };

    verify();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setSubmitting(false);
      toast.error(error.message || "Could not update your password.");
      return;
    }
    await supabase.auth.signOut();
    setSubmitting(false);
    toast.success("Password updated. Please sign in.");
    navigate("/members/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#1d2839] flex flex-col">
      <Helmet>
        <title>Reset Password — Margea Members</title>
        <meta name="description" content="Set a new password for your Margea Members account." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar language={language} onLanguageChange={setLanguage} forceOpaque />

      <main className="flex-1 flex items-center justify-center px-6 py-24 md:py-32">
        <div
          className="w-full max-w-md rounded-[20px] p-8 md:p-10"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(201, 169, 110, 0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex justify-center mb-6">
            <img src={margeaLogoWhite} alt="Margea" className="h-14 w-auto" />
          </div>

          <h1 className="font-cormorant text-3xl md:text-4xl text-white text-center mb-2">
            Set a New Password
          </h1>

          {status === "verifying" && (
            <p className="font-inter text-[13px] text-white/60 text-center mt-6">
              Verifying your reset link…
            </p>
          )}

          {status === "invalid" && (
            <div className="mt-6 text-center">
              <p className="font-inter text-[13px] text-white/70 mb-6">
                This password reset link is invalid or has expired. Request a new one from the sign-in page.
              </p>
              <Button
                onClick={() => navigate("/members/login")}
                className="w-full bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter"
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {status === "ready" && (
            <>
              <p className="font-inter text-[13px] text-white/60 text-center mb-8">
                Choose a new password for your Margea Members account
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="new-password" className="font-inter text-[13px] text-white/80 mb-1.5 block">
                    New password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                    placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="font-inter text-[13px] text-white/80 mb-1.5 block">
                    Confirm new password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                    placeholder="Re-enter your password"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter"
                >
                  {submitting ? "Updating…" : "Update password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
