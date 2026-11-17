import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Calendar, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import margeaLogoWhite from "@/assets/margea-logo-white.png";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  read_time: string;
  published_at: string;
}

export default function MemberArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      // Require auth to view full articles
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/members/login", { replace: true });
        return;
      }
      if (!id) return;
      const { data } = await supabase
        .from("member_articles")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();
      if (!active) return;
      setArticle(data as Article | null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
        <div className="font-inter text-[14px] text-[#1d2839]/60">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-cormorant text-2xl text-[#1d2839] mb-3">Article not found</p>
          <Link to="/members/dashboard" className="font-inter text-[13px] text-[#c9a96e] underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <Helmet>
        <title>{article.title} — Margea Members Journal</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <header className="bg-[#1d2839] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={margeaLogoWhite} alt="Margea" className="h-12 w-auto" />
          </Link>
          <Link
            to="/members/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-inter text-[13px] uppercase tracking-[0.1em] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        <span className="inline-block px-3 py-1 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 text-[10px] font-inter uppercase tracking-[0.15em] text-[#1d2839] mb-5">
          {article.category}
        </span>
        <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-[#1d2839] leading-tight mb-5">
          {article.title}
        </h1>
        <p className="font-cormorant text-xl md:text-2xl text-[#1d2839]/70 italic mb-6 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4 text-[12px] font-inter text-[#1d2839]/55 uppercase tracking-[0.12em] mb-10 pb-8 border-b border-[rgba(29,40,57,0.1)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {article.read_time}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(article.published_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {article.cover_image_url ? (
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover rounded-[16px] mb-10"
          />
        ) : (
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#1d2839] to-[#2a3a52] rounded-[16px] mb-10 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/20" />
          </div>
        )}

        <div className="prose prose-lg max-w-none font-inter text-[16px] text-[#1d2839]/85 leading-[1.8] whitespace-pre-wrap">
          {renderMarkdown(article.content)}
        </div>
      </article>
    </div>
  );
}

// Lightweight markdown renderer (handles ##, ### and paragraphs/lists)
function renderMarkdown(text: string) {
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="font-cormorant text-2xl md:text-3xl text-[#1d2839] mt-8 mb-3">
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="font-cormorant text-3xl md:text-4xl text-[#1d2839] mt-10 mb-4">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split(/\n/).map((l) => l.replace(/^-\s+/, ""));
      return (
        <ul key={i} className="list-disc pl-6 my-4 space-y-2">
          {items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="my-4">
        {block}
      </p>
    );
  });
}
