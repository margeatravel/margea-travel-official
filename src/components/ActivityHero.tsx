import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ActivityHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  children?: ReactNode;
  className?: string;
}

export function ActivityHero({ 
  title, 
  subtitle, 
  backgroundImage,
  children,
  className 
}: ActivityHeroProps) {
  return (
    <section 
      className={cn(
        "relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16",
        className
      )}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-4 relative z-10 py-16 md:py-24 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="!text-white mb-4 md:mb-6 animate-[hero-fade-in_0.6s_ease-out_forwards]"
            style={{ opacity: 0, color: '#ffffff' }}
          >
            {title}
          </h1>
          
          <p 
            className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto font-inter animate-[hero-slide-up_0.5s_ease-out_0.15s_forwards]"
            style={{ opacity: 0 }}
          >
            {subtitle}
          </p>
          
          {children && (
            <div 
              className="mt-6 md:mt-8 animate-[hero-slide-up_0.5s_ease-out_0.3s_forwards]"
              style={{ opacity: 0 }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
