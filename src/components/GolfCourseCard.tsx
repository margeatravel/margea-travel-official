import { useNavigate } from "react-router-dom";
import { GolfCourse } from "@/data/golf-courses-data";
import { MapPin, Ruler, Flag, Trophy } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

interface GolfCourseCardProps {
  course: GolfCourse;
  index: number;
}

export function GolfCourseCard({ course, index }: GolfCourseCardProps) {
  const navigate = useNavigate();
  const lowestPrice = Math.min(...course.pricing.map((p) => p.price));

  return (
    <div
      className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
      style={{
        opacity: 0,
        animation: `hero-slide-up 0.5s ease-out ${0.1 + index * 0.08}s forwards`,
      }}
      onClick={() => navigate(`/activities/golf/${course.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/activities/golf/${course.id}`);
      }}
    >
      {/* Image */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <img
          src={course.image}
          alt={`${course.name} golf course`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={800}
          height={450}
        />

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-[12px] rounded-full text-white text-xs uppercase tracking-wider font-medium">
            <MapPin className="w-3 h-3" />
            {course.location}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/15 backdrop-blur-[12px] rounded-full text-white text-xs font-semibold">
            From ${lowestPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-xl md:text-2xl font-semibold text-foreground flex-1">
            {course.name}
          </h3>
          <ShareButton
            title={course.name}
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}/activities/golf/${course.id}`}
            size="sm"
          />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Designed by {course.designer}
        </p>

        {/* Stats */}
        <div className="flex gap-6 mb-5 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Flag className="w-4 h-4 text-primary" />
            <span>{course.holes} Holes</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Trophy className="w-4 h-4 text-primary" />
            <span>Par {course.par}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ruler className="w-4 h-4 text-primary" />
            <span>{course.yardage}</span>
          </div>
        </div>

        {/* Overview */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-5">
          {course.overview}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2">
          {course.highlights.map((h) => (
            <span
              key={h}
              className="px-3 py-1 bg-primary/8 text-primary text-xs rounded-full font-medium tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
