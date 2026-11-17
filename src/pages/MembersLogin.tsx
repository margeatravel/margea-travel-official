import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Language } from "@/components/LanguageToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import margeaLogoWhite from "@/assets/margea-logo-white.png";

export default function MembersLogin() {
  const [language, setLanguage] = useState<Language>("en");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const destination = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/members/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Redirect if already signed in (validated against the auth server)
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error && data.user) navigate(destination, { replace: true });
    });
  }, [navigate, destination]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Unable to sign in. Please try again.");
      return;
    }
    toast.success("Welcome back!");
    navigate(destination, { replace: true });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email above first, then click 'Forgot your password?'");
      return;
    }
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/members/reset-password`,
    });
    setResetting(false);
    if (error) {
      if ((error as { status?: number }).status === 429) {
        toast.info("A reset email was just sent. Please wait a moment and check your inbox (and spam folder).");
      } else {
        toast.error(error.message || "Could not send reset email.");
      }
      return;
    }
    toast.success("Password reset email sent. Check your inbox (and spam folder).");
  };


  return (
    <div className="min-h-screen bg-[#1d2839] flex flex-col">
      <Helmet>
        <title>Sign In — Margea Members</title>
        <meta name="description" content="Sign in to your Margea Members account to access exclusive benefits, credits, and priority access." />
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
            Welcome Back
          </h1>
          <p className="font-inter text-[13px] text-white/60 text-center mb-8">
            Sign in to access your Margea Members benefits
          </p>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <Label htmlFor="email" className="font-inter text-[13px] text-white/80 mb-1.5 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="font-inter text-[13px] text-white/80">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetting}
                  className="font-inter text-[12px] text-[#c9a96e] hover:text-[#dcb988] transition-colors"
                >
                  {resetting ? "Sending..." : "Forgot your password?"}
                </button>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter font-medium tracking-wide py-6 h-auto text-[14px] uppercase rounded-[10px] transition-all"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center font-inter text-[13px] text-white/60 mt-6">
            Not a member yet?{" "}
            <Link to="/members" className="text-[#c9a96e] hover:text-[#dcb988] underline underline-offset-2">
              Join for free
            </Link>
          </p>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
