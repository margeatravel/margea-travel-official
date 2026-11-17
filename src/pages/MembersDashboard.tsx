import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Tag, Star, Key, Lock, LogOut, User, ShieldCheck, CalendarDays, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import margeaLogoWhite from "@/assets/margea-logo-white.png";
import { MemberContentSection } from "@/components/members/MemberContentSection";
import { ClaimPastBookingForm } from "@/components/members/ClaimPastBookingForm";
import { MemberSecuritySection } from "@/components/members/MemberSecuritySection";
import { MemberBookingsSection } from "@/components/members/MemberBookingsSection";

type Section = "profile" | "security" | "bookings" | "claims";

const NAV: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Password & Security", icon: ShieldCheck },
  { id: "bookings", label: "My Bookings", icon: CalendarDays },
  { id: "claims", label: "Claim Points", icon: Gift },
];

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  status: string;
  credits_balance: number;
  created_at: string;
}

export default function MembersDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState<Section>("profile");
  const [hasClaims, setHasClaims] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMember = async (email: string) => {
      const { data, error } = await supabase
        .from("members")
        .select("id, first_name, last_name, email, country, status, credits_balance, created_at")
        .eq("email", email)
        .maybeSingle();
      if (!isMounted) return;
      if (error) {
        toast.error("Could not load your member profile.");
      }
      setMember(data as Member | null);
      setLoading(false);
    };

    // A submitted points claim unlocks member benefits
    const checkClaims = async (userId: string) => {
      const { count } = await supabase
        .from("point_claims")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      if (isMounted && (count ?? 0) > 0) setHasClaims(true);
    };

    const checkAdmin = async (userId: string) => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (isMounted) setIsAdmin(!!data);
    };


    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/members/login", { replace: true });
        return;
      }
      setAuthEmail(session.user.email ?? "");
      loadMember(session.user.email ?? "");
      checkAdmin(session.user.id);
      checkClaims(session.user.id);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/members/login", { replace: true });
        return;
      }
      setAuthEmail(session.user.email ?? "");
      loadMember(session.user.email ?? "");
      checkAdmin(session.user.id);
      checkClaims(session.user.id);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/members/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
        <div className="font-inter text-[14px] text-[#1d2839]/60">Loading your dashboard...</div>
      </div>
    );
  }

  const displayName = member ? `${member.first_name} ${member.last_name}` : authEmail;
  const initials = member
    ? `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase()
    : (authEmail[0] ?? "M").toUpperCase();
  // Benefits unlock for admins, activated members, anyone with credited points,
  // or anyone who has submitted a points claim (Stay/Tour/Transport).
  const hasEarnedPoints = (member?.credits_balance ?? 0) > 0;
  const isPending =
    !isAdmin && !hasEarnedPoints && !hasClaims && (!member || member.status === "pending");
  const memberSince = member
    ? new Date(member.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <Helmet>
        <title>Member Dashboard — Margea Members</title>
        <meta name="description" content="Your Margea Members dashboard. Track your credits, status, and member benefits." />
      </Helmet>

      {/* Header */}
      <header className="bg-[#1d2839] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={margeaLogoWhite} alt="Margea" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-3 md:gap-5">
            <span className="hidden sm:block font-inter text-[13px] text-white/70">
              {displayName}
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-inter text-[13px] uppercase tracking-[0.1em] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-[1fr_240px] gap-6 md:gap-8">
          {/* Side menu (right on desktop, top on mobile) */}
          <nav className="bg-[#1d2839] rounded-[20px] p-3 h-fit lg:sticky lg:top-6 lg:order-2">

            <ul className="flex lg:flex-col gap-1 overflow-x-auto">
              {NAV.map((item) => {
                const active = section === item.id;
                return (
                  <li key={item.id} className="flex-shrink-0 lg:w-full">
                    <button
                      onClick={() => setSection(item.id)}
                      className={`w-full flex items-center gap-2.5 px-4 h-11 rounded-[12px] font-inter text-[12px] uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${
                        active
                          ? "bg-[#c9a96e] text-[#1d2839]"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="lg:order-1">

            {section === "profile" && (
              <>
                <div className="grid xl:grid-cols-[340px_1fr] gap-6 md:gap-8">
                  {/* Profile Card */}
                  <aside className="bg-white rounded-[20px] p-8 border border-[rgba(29,40,57,0.06)] shadow-sm h-fit">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full bg-[#c9a96e] flex items-center justify-center mb-5 shadow-md shadow-[#c9a96e]/30">
                        <span className="font-cormorant text-3xl text-[#1d2839] font-semibold">
                          {initials || "M"}
                        </span>
                      </div>
                      <h1 className="font-cormorant text-2xl md:text-3xl text-[#1d2839] mb-1">
                        {displayName}
                      </h1>
                      <p className="font-inter text-[12px] text-[#1d2839]/55 uppercase tracking-[0.15em] mb-4">
                        Member since {memberSince}
                      </p>

                      <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-inter font-medium uppercase tracking-[0.15em] bg-[#c9a96e]/15 text-[#1d2839] border border-[#c9a96e]/40">
                        ★ Membership Active
                      </span>

                      {/* Margea Points balance */}
                      <div
                        className="w-full mt-6 rounded-[14px] px-5 py-4 text-center"
                        style={{ background: "linear-gradient(135deg, #c9a96e 0%, #dcb988 100%)" }}
                      >
                        <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-[#1d2839]/70 mb-1">
                          Margea Points
                        </p>
                        <p className="font-cormorant text-4xl leading-none text-[#1d2839] font-semibold">
                          {(member?.credits_balance ?? 0).toLocaleString()}
                        </p>
                        <p className="font-inter text-[11px] text-[#1d2839]/70 mt-1.5">
                          {(member?.credits_balance ?? 0) === 1 ? "point earned" : "points earned"}
                        </p>
                      </div>


                      <div className="w-full border-t border-[rgba(29,40,57,0.08)] mt-6 pt-5 space-y-2 text-left">
                        <div>
                          <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-[#1d2839]/45 mb-0.5">
                            Email
                          </p>
                          <p className="font-inter text-[13px] text-[#1d2839] break-all">
                            {member?.email ?? authEmail}
                          </p>
                        </div>
                        {member?.country && (
                          <div className="pt-2">
                            <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-[#1d2839]/45 mb-0.5">
                              Country
                            </p>
                            <p className="font-inter text-[13px] text-[#1d2839]">{member.country}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </aside>

                  {/* Benefits */}
                  <section>
                    <h2 className="font-cormorant text-2xl md:text-3xl text-[#1d2839] mb-5">
                      Your Member Benefits
                    </h2>
                    <div className="grid sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
                      <BenefitCard
                        icon={Tag}
                        title="Direct Booking Discount"
                        description="Show this to your Margea concierge to apply your member discount on direct bookings."
                        locked={isPending}
                      />
                      <BenefitCard
                        icon={Star}
                        title="Member Credits"
                        description="Earn credits on every stay. Redeem for nights, upgrades, or experiences."
                        locked={isPending}
                        highlight={!isPending ? `${member?.credits_balance ?? 0} credits` : undefined}
                      />
                      <BenefitCard
                        icon={Key}
                        title="Priority Access"
                        description="You have early access to new properties and high-season availability."
                        locked={isPending}
                      />
                    </div>
                  </section>
                </div>

                {isPending && (
                  <div
                    className="mt-8 rounded-[20px] p-8 md:p-10"
                    style={{
                      background: "linear-gradient(135deg, #c9a96e 0%, #dcb988 100%)",
                    }}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="max-w-xl">
                        <h3 className="font-cormorant text-2xl md:text-3xl text-[#1d2839] mb-2">
                          Ready to unlock your benefits?
                        </h3>
                        <p className="font-inter text-[14px] text-[#1d2839]/85 leading-relaxed">
                          Book direct with Margea, or claim points from a past booking, to activate your membership and start earning credits.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        <Button
                          asChild
                          className="bg-[#1d2839] hover:bg-[#2a3a52] text-white font-inter font-medium tracking-wide px-8 py-6 h-auto text-[14px] uppercase rounded-[10px]"
                        >
                          <Link to="/stays">Book a Stay</Link>
                        </Button>
                        <Button
                          onClick={() => setSection("claims")}
                          variant="outline"
                          className="border-[#1d2839]/40 bg-transparent hover:bg-[#1d2839]/10 text-[#1d2839] font-inter font-medium tracking-wide px-8 py-6 h-auto text-[14px] uppercase rounded-[10px]"
                        >
                          Claim Points
                        </Button>
                      </div>
                    </div>
                  </div>
                )}


                <MemberContentSection isPending={isPending} />
              </>
            )}

            {section === "security" && (
              <MemberSecuritySection email={member?.email ?? authEmail} />
            )}

            {section === "bookings" && (
              <MemberBookingsSection email={member?.email ?? authEmail} />
            )}

            {section === "claims" && (
              <ClaimPastBookingForm
                standalone
                onPointsCredited={(pts) => {
                  setHasClaims(true);
                  setMember((prev) =>
                    prev ? { ...prev, credits_balance: (prev.credits_balance ?? 0) + pts } : prev
                  );
                }}

                memberEmail={member?.email ?? authEmail}
                memberName={member ? `${member.first_name} ${member.last_name}` : undefined}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  locked?: boolean;
  highlight?: string;
}

function BenefitCard({ icon: Icon, title, description, locked, highlight }: BenefitCardProps) {
  return (
    <div className="relative rounded-[16px] p-6 bg-white border border-[rgba(29,40,57,0.06)] shadow-sm overflow-hidden">
      <div className={locked ? "opacity-40 pointer-events-none select-none" : ""}>
        <div className="w-11 h-11 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center mb-4">
          <Icon className="w-4 h-4 text-[#c9a96e]" />
        </div>
        <h3 className="font-cormorant text-xl text-[#1d2839] mb-1">{title}</h3>
        {highlight && (
          <p className="font-cormorant text-2xl text-[#c9a96e] font-semibold mb-1">{highlight}</p>
        )}
        <p className="font-inter text-[13px] text-[#1d2839]/65 leading-relaxed">{description}</p>
      </div>

      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-[#1d2839]/10 flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-[#1d2839]/70" />
          </div>
          <p className="font-inter text-[12px] text-[#1d2839]/75 font-medium max-w-[200px]">
            Unlocks with your first direct booking
          </p>
        </div>
      )}
    </div>
  );
}
