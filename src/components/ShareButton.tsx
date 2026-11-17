import { useState, useRef, useEffect, MouseEvent } from "react";
import { Share2, Link as LinkIcon, Mail, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

interface ShareButtonProps {
  title: string;
  url?: string;
  className?: string;
  size?: "sm" | "md";
  variant?: "default" | "light";
  /** When true, stops propagation so it can be safely nested inside Link/clickable cards */
  stopPropagation?: boolean;
}

export function ShareButton({
  title,
  url,
  className,
  size = "md",
  variant = "default",
  stopPropagation = true,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `Check this out on Margea Travel: ${title} — ${shareUrl}`;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const stop = (e: MouseEvent) => {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleClick = async (e: MouseEvent) => {
    stop(e);
    // Try native share on mobile / supported browsers
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: `Margea Travel — ${title}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or error → fall through to dropdown
      }
    }
    setOpen((v) => !v);
  };

  const handleCopy = async (e: MouseEvent) => {
    stop(e);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {
      // ignore
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    `Margea Travel — ${title}`
  )}&body=${encodeURIComponent(shareText)}`;

  const sizeClasses =
    size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize = size === "sm" ? 14 : 16;

  const variantClasses =
    variant === "light"
      ? "bg-white/90 text-[#1d2839] hover:bg-white"
      : "bg-transparent text-[#1d2839] hover:bg-[#1d2839]/10";

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Share ${title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out",
          "border border-[rgba(29,40,57,0.12)] focus:outline-none focus:ring-2 focus:ring-[#1d2839]/30",
          sizeClasses,
          variantClasses
        )}
      >
        <Share2 size={iconSize} strokeWidth={1.8} />
      </button>

      {open && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute right-0 top-full mt-2 z-50 min-w-[200px]",
            "rounded-[10px] border border-[rgba(29,40,57,0.1)] bg-white shadow-[0_12px_36px_rgba(29,40,57,0.18)]",
            "py-1.5 font-inter text-[13px] text-[#1d2839]",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#1d2839]/5 transition-colors"
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon size={15} />
                <span>Copy link</span>
              </>
            )}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              setTimeout(() => setOpen(false), 100);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#1d2839]/5 transition-colors"
          >
            <WhatsAppIcon className="w-[15px] h-[15px]" />
            <span>WhatsApp</span>
          </a>
          <a
            href={mailHref}
            onClick={(e) => {
              e.stopPropagation();
              setTimeout(() => setOpen(false), 100);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#1d2839]/5 transition-colors"
          >
            <Mail size={15} />
            <span>Email</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
