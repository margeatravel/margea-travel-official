import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Gift, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Language } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  category: string;
}

const WHATSAPP =
  "https://wa.me/529982334867?text=" +
  encodeURIComponent("Hi Margea, I'd like to redeem my Margea Points for a reward.");

export default function MembersRewards() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [firstName, setFirstName] = useState<string>("");
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        navigate("/members/login?redirect=/members/rewards", { replace: true });
        return;
      }

      const [{ data: member }, { data: rewardRows, error: rewardsError }] = await Promise.all([
        supabase
          .from("members")
          .select("first_name, credits_balance")
          .eq("email", userData.user.email ?? "")
          .maybeSingle(),
        supabase
          .from("member_rewards")
          .select("id, title, description, points_cost, category")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
      ]);

      if (!mounted) return;
      if (rewardsError) toast.error("Could not load the rewards catalog.");
      setFirstName(member?.first_name ?? "");
      setBalance(member?.credits_balance ?? 0);
      setRewards((rewardRows as Reward[]) ?? []);
      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <Helmet>
        <title>Redeem Your Points | Margea Members</title>
        <meta
          name="description"
          content="Browse the Margea Members rewards catalog and redeem your Margea Points for stay credits, tours, transfers and upgrades."
        />
      </Helmet>

      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Balance header */}
          <div
            className="rounded-[20px] p-8 md:p-10 mb-10"
            style={{ background: "linear-gradient(135deg, #1d2839 0%, #2a3a52 100%)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="font-inter text-[12px] uppercase tracking-[0.2em] text-[#c9a96e] mb-3">
                  Margea Members
                </p>
                <h1 className="font-cormorant text-4xl md:text-5xl text-white mb-2">
                  Redeem Your Points
                </h1>
                <p className="font-inter text-[14px] text-white/70 max-w-xl leading-relaxed">
                  {firstName ? `${firstName}, y` : "Y"}our points can be applied to stays, tours,
                  transfers and in-villa upgrades. Choose a reward and our team confirms it with you
                  directly.
                </p>
              </div>
              <div className="rounded-[16px] border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-8 py-6 text-center flex-shrink-0">
                <p className="font-inter text-[11px] uppercase tracking-[0.18em] text-[#c9a96e] mb-2">
                  Your Balance
                </p>
                <p className="font-cormorant text-4xl text-white leading-none">
                  {loading ? "—" : balance.toLocaleString()}
                </p>
                <p className="font-inter text-[12px] text-white/60 mt-2">Margea Points</p>
              </div>
            </div>
          </div>

          {/* Catalog */}
          {loading ? (
            <p className="font-inter text-[14px] text-[#1d2839]/60">Loading rewards…</p>
          ) : rewards.length === 0 ? (
            <p className="font-inter text-[14px] text-[#1d2839]/60">
              No rewards are available right now. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => {
                const affordable = balance >= reward.points_cost;
                return (
                  <div
                    key={reward.id}
                    className="rounded-[20px] bg-white border border-[#1d2839]/10 p-7 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Gift className="h-4 w-4 text-[#c9a96e]" />
                      <span className="font-inter text-[11px] uppercase tracking-[0.16em] text-[#1d2839]/50">
                        {reward.category}
                      </span>
                    </div>
                    <h2 className="font-cormorant text-2xl text-[#1d2839] mb-2">{reward.title}</h2>
                    <p className="font-inter text-[13px] text-[#1d2839]/70 leading-relaxed mb-6">
                      {reward.description}
                    </p>
                    <div className="mt-auto">
                      <p className="font-inter text-[13px] text-[#1d2839] mb-4">
                        <span className="font-semibold">
                          {reward.points_cost.toLocaleString()} points
                        </span>
                        {!affordable && (
                          <span className="text-[#1d2839]/50">
                            {" "}
                            — {(reward.points_cost - balance).toLocaleString()} more to go
                          </span>
                        )}
                      </p>
                      <Button
                        asChild={affordable}
                        disabled={!affordable}
                        className="w-full bg-[#1d2839] hover:bg-[#2a3a52] text-white font-inter font-medium tracking-wide uppercase text-[13px] rounded-[10px] py-6 h-auto disabled:opacity-40"
                      >
                        {affordable ? (
                          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                            Redeem
                          </a>
                        ) : (
                          <span>Not enough points</span>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer links */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              variant="outline"
              className="border-[#1d2839]/30 bg-transparent hover:bg-[#1d2839]/5 text-[#1d2839] font-inter font-medium uppercase tracking-wide text-[13px] rounded-[10px] px-8 py-6 h-auto"
            >
              <Link to="/members/dashboard">
                <User className="h-4 w-4 mr-2" /> My Profile
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#1d2839]/30 bg-transparent hover:bg-[#1d2839]/5 text-[#1d2839] font-inter font-medium uppercase tracking-wide text-[13px] rounded-[10px] px-8 py-6 h-auto"
            >
              <Link to="/members/dashboard">
                <Sparkles className="h-4 w-4 mr-2" /> Earn More Points
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
