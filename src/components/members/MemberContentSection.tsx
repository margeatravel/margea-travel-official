import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Tag, Lock, Clock, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  category: string;
  read_time: string;
  published_at: string;
}

interface Experience {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  valid_until: string | null;
}

type Tab = "journal" | "experiences" | "offers";

const WHATSAPP_BASE = "https://wa.me/529982334867";

const buildWaUrl = (text: string) =>
  `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;

export function MemberContentSection({ isPending }: { isPending: boolean }) {
  const [tab, setTab] = useState<Tab>("journal");
  const [articles, setArticles] = useState<Article[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    (async () => {
      const [a, e, o] = await Promise.all([
        supabase
          .from("member_articles")
          .select("id, title, excerpt, cover_image_url, category, read_time, published_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false }),
        supabase
          .from("member_experiences")
          .select("id, name, description, image_url")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("member_offers")
          .select("id, title, description, valid_until")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
      ]);
      if (a.data) setArticles(a.data as Article[]);
      if (e.data) setExperiences(e.data as Experience[]);
      if (o.data) setOffers(o.data as Offer[]);
    })();
  }, []);

  return (
    <section className="mt-12 md:mt-16">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#c9a96e] mb-2">
            Members Only
          </p>
          <h2 className="font-cormorant text-3xl md:text-4xl text-[#1d2839]">
            Curated for you
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 md:gap-2 border-b border-[rgba(29,40,57,0.08)] mb-8 overflow-x-auto">
        <TabButton active={tab === "journal"} onClick={() => setTab("journal")} icon={BookOpen} label="Journal" />
        <TabButton active={tab === "experiences"} onClick={() => setTab("experiences")} icon={Sparkles} label="Experiences" />
        <TabButton active={tab === "offers"} onClick={() => setTab("offers")} icon={Tag} label="Offers" />
      </div>

      <div className="relative">
        <div className={isPending ? "pointer-events-none select-none blur-sm opacity-60" : ""}>
          {tab === "journal" && <JournalGrid articles={articles} />}
          {tab === "experiences" && <ExperiencesGrid items={experiences} />}
          {tab === "offers" && <OffersList items={offers} />}
        </div>

        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-8 md:p-10 border border-[#c9a96e]/30 shadow-xl max-w-md text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-[#c9a96e]" />
              </div>
              <h3 className="font-cormorant text-2xl text-[#1d2839] mb-2">
                Members-only content
              </h3>
              <p className="font-inter text-[13px] text-[#1d2839]/70 leading-relaxed mb-5">
                This content unlocks with your first direct booking with Margea.
              </p>
              <Button
                asChild
                className="bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter font-medium tracking-wide px-7 py-5 h-auto text-[13px] uppercase rounded-full"
              >
                <Link to="/stays">Book a Stay</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 px-4 md:px-5 py-3 font-inter text-[13px] uppercase tracking-[0.12em] transition-colors whitespace-nowrap ${
        active ? "text-[#1d2839]" : "text-[#1d2839]/50 hover:text-[#1d2839]/80"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {active && <span className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#c9a96e]" />}
    </button>
  );
}

function JournalGrid({ articles }: { articles: Article[] }) {
  if (!articles.length) {
    return <EmptyState message="New stories coming soon." />;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((a) => (
        <Link
          key={a.id}
          to={`/members/journal/${a.id}`}
          className="group bg-white rounded-[16px] overflow-hidden border border-[rgba(29,40,57,0.06)] shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="aspect-[4/3] bg-gradient-to-br from-[#1d2839] to-[#2a3a52] relative overflow-hidden">
            {a.cover_image_url ? (
              <img src={a.cover_image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white/20" />
              </div>
            )}
            <span className="absolute top-3 left-3 inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-inter uppercase tracking-[0.15em] text-[#1d2839]">
              {a.category}
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-cormorant text-xl text-[#1d2839] leading-tight mb-2 group-hover:text-[#c9a96e] transition-colors">
              {a.title}
            </h3>
            <p className="font-inter text-[13px] text-[#1d2839]/65 leading-relaxed line-clamp-2 mb-4">
              {a.excerpt}
            </p>
            <div className="flex items-center gap-3 text-[11px] font-inter text-[#1d2839]/50">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {a.read_time}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(a.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ExperiencesGrid({ items }: { items: Experience[] }) {
  if (!items.length) {
    return <EmptyState message="New experiences coming soon." />;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {items.map((x) => (
        <div
          key={x.id}
          className="bg-white rounded-[16px] overflow-hidden border border-[rgba(29,40,57,0.06)] shadow-sm flex flex-col"
        >
          <div className="aspect-[16/9] bg-gradient-to-br from-[#1d2839] to-[#2a3a52] relative">
            {x.image_url ? (
              <img src={x.image_url} alt={x.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white/20" />
              </div>
            )}
            <span className="absolute top-3 left-3 inline-block px-3 py-1 rounded-full bg-[#c9a96e] text-[10px] font-inter uppercase tracking-[0.15em] text-[#1d2839] font-medium">
              Members Only
            </span>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-cormorant text-2xl text-[#1d2839] mb-2">{x.name}</h3>
            <p className="font-inter text-[13px] text-[#1d2839]/70 leading-relaxed mb-5 flex-1">
              {x.description}
            </p>
            <a
              href={buildWaUrl(`Hi, I'm a Margea Member and I'd like to book: ${x.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1d2839] hover:bg-[#2a3a52] text-white font-inter text-[12px] uppercase tracking-[0.12em] px-5 py-3 rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Request This Experience
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function OffersList({ items }: { items: Offer[] }) {
  if (!items.length) {
    return <EmptyState message="No active offers right now." />;
  }
  return (
    <div className="space-y-4">
      {items.map((o) => (
        <div
          key={o.id}
          className="bg-white rounded-[16px] p-6 md:p-7 border border-[#c9a96e]/30 shadow-sm flex flex-col md:flex-row md:items-center gap-5 md:gap-8"
        >
          <div className="w-12 h-12 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center flex-shrink-0">
            <Tag className="w-5 h-5 text-[#c9a96e]" />
          </div>
          <div className="flex-1">
            <h3 className="font-cormorant text-2xl text-[#1d2839] mb-1">{o.title}</h3>
            <p className="font-inter text-[13px] text-[#1d2839]/70 leading-relaxed mb-2">
              {o.description}
            </p>
            {o.valid_until && (
              <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-[#1d2839]/50">
                Valid until{" "}
                {new Date(o.valid_until).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <a
            href={buildWaUrl(`Hi, I'm a Margea Member and I'd like to claim: ${o.title}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#c9a96e] hover:bg-[#b8985d] text-[#1d2839] font-inter font-medium text-[12px] uppercase tracking-[0.12em] px-5 py-3 rounded-full transition-colors flex-shrink-0"
          >
            Claim Offer <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-[16px] p-10 text-center border border-[rgba(29,40,57,0.06)]">
      <p className="font-inter text-[13px] text-[#1d2839]/60">{message}</p>
    </div>
  );
}
