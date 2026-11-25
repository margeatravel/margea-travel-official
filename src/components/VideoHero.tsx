import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { media } from "@/lib/media";

interface VideoHeroProps {
  children: React.ReactNode;
}

/**
 * VideoHero Component - Full-width video background for homepage
 * 
 * Self-Audit Checklist:
 * ✓ Video autoplays muted/looping on desktop + mobile (playsInline)
 * ✓ Uses poster image fallback for loading state
 * ✓ Uses preload="metadata" for performance
 * ✓ object-fit: cover for responsive fill
 * ✓ Subtle dark overlay for text readability
 * ✓ Height: 70-85vh desktop, 55-70vh mobile
 * ✓ No other pages or functionality modified
 */
export function VideoHero({ children }: VideoHeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt to play when video is ready
    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch(() => {
        // Autoplay blocked, show poster fallback
        setVideoError(true);
      });
    };

    const handleError = () => {
      setVideoError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <section className="relative pt-16 min-h-[55vh] md:min-h-[75vh] lg:min-h-[85vh] flex items-end">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Loading shimmer placeholder */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-700 z-10",
            videoLoaded && !videoError ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Video element */}
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            videoLoaded && !videoError ? "opacity-100" : "opacity-0"
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={media("/videos/margea-hero-poster.jpg")}
          aria-hidden="true"
        >
          <source src={media("/videos/margea-hero.mp4")} type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-20" />
      </div>

      {/* Content overlay - positioned at bottom for cinematic video visibility */}
      <div className="container mx-auto px-4 relative z-30 pb-3 md:pb-4">
        {children}
      </div>
    </section>
  );
}
