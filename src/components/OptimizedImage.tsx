import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  onLoad?: () => void;
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  aspectRatio = "auto",
  onLoad,
  width,
  height,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Preload priority images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const aspectRatioClass = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatioClass[aspectRatio],
        containerClassName
      )}
    >
      {/* Blur placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-muted to-muted/80 transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Shimmer effect while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={handleLoad}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
    </div>
  );
}

// Preload multiple images for carousel/gallery
export function preloadImages(urls: string[], count = 2) {
  urls.slice(0, count).forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

// Hook for carousel image preloading
export function useCarouselPreload(
  images: string[],
  currentIndex: number
) {
  useEffect(() => {
    if (!images || images.length <= 1) return;

    // Preload next and previous images
    const preloadIndexes = [
      (currentIndex + 1) % images.length,
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    ];

    preloadIndexes.forEach((index) => {
      const img = new Image();
      img.src = images[index];
    });
  }, [images, currentIndex]);
}
