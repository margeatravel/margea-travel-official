import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Tag, Star, Key, Check, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Language } from "@/components/LanguageToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PhoneInputWithCountry } from "@/components/PhoneInputWithCountry";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import membersHeroKayak from "@/assets/members-hero-boats.png";
import { useMemberSession } from "@/hooks/useMemberSession";

const memberSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(6, "Please enter a valid phone number").max(30),
  country: z.string().trim().min(2, "Country is required").max(100),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  agreed_to_marketing: z.boolean(),
});

const COUNTRIES = [
  "Mexico", "United States", "Canada", "United Kingdom", "Spain", "France",
  "Germany", "Italy", "Brazil", "Argentina", "Colombia", "Chile", "Peru",
  "Australia", "Netherlands", "Switzerland", "Belgium", "Sweden", "Norway",
  "Denmark", "Ireland", "Portugal", "Austria", "Japan", "China", "India",
  "South Korea", "United Arab Emirates", "Saudi Arabia", "Israel", "South Africa",
  "New Zealand", "Singapore", "Other",
];

export default function Members() {
  const { loading: sessionLoading, isSignedIn } = useMemberSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const destination =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/members/rewards";
  const [language, setLanguage] = useState<Language>("en");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    agreed_to_marketing: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = memberSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    const data = parsed.data;

    // 1) Insert the member record
    const { error: insertError } = await supabase.from("members").insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      agreed_to_marketing: data.agreed_to_marketing,
    });

    if (insertError) {
      setSubmitting(false);
      if (insertError.code === "23505") {
        toast.error("This email is already a Margea Member. Try signing in instead.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return;
    }

    // 2) Create the auth account so they can sign in
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}${destination}`,
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      },
    });

    setSubmitting(false);

    if (authError) {
      // Member row already saved — surface the auth error but still consider it a soft success
      toast.error(authError.message || "Account could not be created. Please contact us.");
      return;
    }

    // Welcome email is now sent automatically by a DB trigger on auth.users INSERT
    // (see migration: send_welcome_email_on_user_created). No frontend invoke needed.

    // If a session was created immediately (no email confirmation required),
    // return the new member to where they came from (e.g. checkout with cart intact).
    const { data: { session } } = await supabase.auth.getSession();
    if (session && destination !== "/members/dashboard") {
      toast.success("Welcome to Margea Members!");
      navigate(destination, { replace: true });
      return;
    }

    setSubmitted(true);
  };

  useEffect(() => {
    if (!sessionLoading && !isSignedIn && redirectParam) {
      setTimeout(() => {
        document.getElementById("join-form")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [sessionLoading, isSignedIn, redirectParam]);

  const scrollToForm = () => {
    document.getElementById("join-form")?.scrollIntoView({ behavior: "smooth" });
  };

  if (sessionLoading) return null;
  if (isSignedIn) return <Navigate to={destination} replace />;

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <Helmet>
        <title>Margea Members — Travel More. Pay Less. Stay Better.</title>
        <meta
          name="description"
          content="Join Margea Members for free. Get exclusive direct booking discounts, points on every stay, and priority access to luxury properties in the Riviera Maya."
        />
      </Helmet>

      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* HERO */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${membersHeroKayak})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(29,40,57,0.78) 0%, rgba(42,58,82,0.62) 50%, rgba(29,40,57,0.82) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(201, 169, 110, 0.1) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10">
            <span className="font-inter text-[11px] tracking-[0.2em] uppercase text-[#c9a96e]">
              Margea Members
            </span>
          </div>
          <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
            Travel More.<br className="md:hidden" /> Pay Less. Stay Better.
          </h1>
          <p className="font-inter text-base md:text-lg text-white/75 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Margea Members get exclusive rates, priority access, and rewards on
            every stay — all for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToForm}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-[10px] border border-white/30 text-white font-inter font-medium tracking-wide px-8 py-6 h-auto text-[14px] uppercase rounded-full transition-all"
            >
              Join Now
            </Button>
            <Button
              asChild
              className="bg-white/15 hover:bg-white/25 backdrop-blur-[10px] border border-white/30 text-white font-inter font-medium tracking-wide px-8 py-6 h-auto text-[14px] uppercase rounded-full transition-all"
            >
              <Link to={`/members/login?redirect=${encodeURIComponent(destination)}`}>Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 md:py-28 bg-[#1d2839]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-cormorant text-3xl md:text-5xl text-white mb-4">
              Why Join Margea Members?
            </h2>
            <div className="w-16 h-[2px] bg-[#c9a96e] mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Tag,
                title: "Direct Booking Discounts",
                desc: "Skip the platform fees. Book directly and save on every reservation.",
              },
              {
                icon: Star,
                title: "Points on Every Stay",
                desc: "Earn credits with each booking. Redeem them for nights, upgrades, or curated experiences.",
              },
              {
                icon: Key,
                title: "Priority Access",
                desc: "Get early access to new properties and high-season availability before anyone else.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="p-8 rounded-[16px] border border-[#c9a96e]/30 bg-[#1d2839]/40 backdrop-blur-sm hover:border-[#c9a96e]/60 transition-all duration-300 group"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                }}
              >
                <div className="w-12 h-12 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center mb-5 group-hover:bg-[#c9a96e]/25 transition-colors">
                  <b.icon className="w-5 h-5 text-[#c9a96e]" />
                </div>
                <h3 className="font-cormorant text-2xl text-white mb-3">
                  {b.title}
                </h3>
                <p className="font-inter text-[14px] text-white/65 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 bg-[#f7f6f3]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-3xl md:text-5xl text-[#1d2839] mb-4">
              It's Simple.
            </h2>
            <div className="w-16 h-[2px] bg-[#c9a96e] mx-auto" />
          </div>
          <div className="relative">
            {/* Connecting line - desktop only */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent" />
            <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
              {[
                { n: 1, text: "Create your free account" },
                { n: 2, text: "Make your first direct booking" },
                { n: 3, text: "Enjoy member benefits on every stay" },
              ].map((s) => (
                <div key={s.n} className="text-center">
                  <div className="relative inline-flex">
                    <div className="w-16 h-16 rounded-full bg-[#c9a96e] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#c9a96e]/20 relative z-10">
                      <span className="font-cormorant text-2xl text-[#1d2839] font-semibold">
                        {s.n}
                      </span>
                    </div>
                  </div>
                  <p className="font-inter text-[15px] text-[#1d2839]/80 max-w-[220px] mx-auto leading-relaxed">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="join-form" className="py-20 md:py-28 bg-white">
        <div className="max-w-xl mx-auto px-6">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center mx-auto mb-6">
                <Check className="w-9 h-9 text-[#c9a96e]" />
              </div>
              <h2 className="font-cormorant text-3xl md:text-4xl text-[#1d2839] mb-4">
                Welcome to Margea Members!
              </h2>
              <p className="font-inter text-[15px] text-[#1d2839]/70 leading-relaxed mb-6">
                Please check your email to confirm your account, then sign in to access your member dashboard.
              </p>
              <Link
                to="/members/login"
                className="inline-block bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter font-medium tracking-wide px-8 py-3 rounded-[10px] transition-all text-[13px] uppercase"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="font-cormorant text-3xl md:text-5xl text-[#1d2839] mb-3">
                  Become a Margea Member
                </h2>
                <p className="font-inter text-[14px] text-[#1d2839]/60 italic">
                  It's free. Always.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="font-inter text-[13px] text-[#1d2839] mb-1.5 block">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      required
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name" className="font-inter text-[13px] text-[#1d2839] mb-1.5 block">
                      Last Name *
                    </Label>
                    <Input
                      id="last_name"
                      required
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="font-inter text-[13px] text-[#1d2839] mb-1.5 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="font-inter text-[13px] text-[#1d2839] mb-1.5 block">
                    Phone *
                  </Label>
                  <PhoneInputWithCountry
                    value={form.phone}
                    onChange={(e164) => setForm({ ...form, phone: e164 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="font-inter text-[13px] text-[#1d2839] mb-1.5 block">
                    Country *
                  </Label>
                  <select
                    id="country"
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="flex h-10 w-full rounded-[12px] border border-[rgba(29,40,57,0.08)] bg-background px-3 py-2 text-base font-inter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="password" className="font-inter text-[13px] text-[#1d2839] mb-1.5 block">
                    Create a Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="At least 8 characters"
                  />
                  <p className="font-inter text-[11px] text-[#1d2839]/50 mt-1.5">
                    You'll use this to sign in to your member dashboard.
                  </p>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="marketing"
                    checked={form.agreed_to_marketing}
                    onCheckedChange={(v) =>
                      setForm({ ...form, agreed_to_marketing: v === true })
                    }
                    className="mt-0.5 border-[#1d2839]/30 data-[state=checked]:bg-[#c9a96e] data-[state=checked]:border-[#c9a96e]"
                  />
                  <Label
                    htmlFor="marketing"
                    className="font-inter text-[13px] text-[#1d2839]/75 leading-relaxed cursor-pointer"
                  >
                    I agree to receive exclusive offers and updates from Margea
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter font-medium tracking-wide py-6 h-auto text-[14px] uppercase rounded-[10px] transition-all mt-2"
                >
                  {submitting ? "Joining..." : "Join Margea Members"}
                </Button>

                <p className="text-center font-inter text-[13px] text-[#1d2839]/60 pt-2">
                  Already a member?{" "}
                  <Link
                    to={`/members/login?redirect=${encodeURIComponent(destination)}`}
                    className="text-[#c9a96e] hover:text-[#b8985d] underline underline-offset-2"
                  >
                    Sign in here
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className="py-12 bg-[#1d2839] border-t border-[#c9a96e]/20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-cormorant text-2xl md:text-3xl text-white mb-1">
              Have questions? We're here.
            </h3>
            <p className="font-inter text-[13px] text-white/60">
              Chat with our concierge anytime on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/529982334867"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter font-medium tracking-wide px-6 py-3 rounded-[10px] transition-all text-[13px] uppercase"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
}
