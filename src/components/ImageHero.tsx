import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

const HERO_SLIDES = [
  "/hero-slides/slide-1.jpg",
  "/hero-slides/slide-2.jpg",
  "/hero-slides/slide-3.jpg",
  "/hero-slides/slide-4.jpg",
  "/hero-slides/slide-5.jpg",
  "/hero-slides/slide-6.jpg",
  "/hero-slides/slide-7.jpg",
  "/hero-slides/slide-8.jpg",
  "/hero-slides/slide-9.jpg",
  "/hero-slides/slide-10.jpg",
  "/property-images/sunset-surfer.jpg",
];

interface ImageHeroProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function ImageHero({ children, title, subtitle }: ImageHeroProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(Math.random() * HERO_SLIDES.length)
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preload all images immediately
  useEffect(() => {
    let loaded = 0;
    HERO_SLIDES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === HERO_SLIDES.length) setImagesLoaded(true);
      };
    });
  }, []);

  // Start interval once images are loaded
  useEffect(() => {
    if (!imagesLoaded) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imagesLoaded]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Stacked background images */}
      {HERO_SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === activeIndex ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}

      {/* Gradient overlay — fixed, never animates */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(160deg, rgba(29,40,57,0.55) 0%, rgba(29,40,57,0.35) 50%, rgba(29,40,57,0.65) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 w-full px-5 md:px-4 flex flex-col items-center pt-6 md:pt-0" style={{ marginTop: "-10vh" }}>
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-6 mt-10 md:mt-0 opacity-0 translate-y-4"
          style={{ animation: "heroFadeUp 0.6s ease-out 0.4s forwards" }}
        >
          <span className="block w-10 h-px bg-white/30" />
          <span className="font-inter text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/65">
            Riviera Maya · Mexico
          </span>
          <span className="block w-10 h-px bg-white/30" />
        </div>
        {/* Heading */}
        <h1
          className="text-center text-white font-cormorant text-[44px] md:text-[82px] leading-[1.1] max-w-[700px] opacity-0 translate-y-5"
          style={{ animation: "heroFadeUp 0.7s ease-out 0.6s forwards" }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-center font-inter text-[15px] md:text-[17px] font-light text-white/75 max-w-[480px] mt-4 opacity-0"
          style={{ animation: "heroFadeIn 0.6s ease-out 0.85s forwards" }}
        >
          {subtitle}
        </p>

        {/* Search bar */}
        <div
          className="w-full max-w-5xl mt-[120px] md:mt-10 opacity-0 translate-y-3 scale-[0.92] md:scale-100 origin-top"
          style={{ animation: "heroFadeUp 0.6s ease-out 1.05s forwards" }}
        >
          <div className="mt-8 md:mt-0">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
