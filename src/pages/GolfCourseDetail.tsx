import { useParams, useNavigate } from "react-router-dom";
import { ShareButton } from "@/components/ShareButton";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GolfCourseGallery } from "@/components/GolfCourseGallery";
import { GolfTeeTimeBooking } from "@/components/GolfTeeTimeBooking";
import { golfCourses } from "@/data/golf-courses-data";
import { MapPin, Flag, Trophy, Ruler, ArrowLeft, Star, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Language = "en" | "es";

const GolfCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");

  const course = golfCourses.find((c) => c.id === courseId);

  useEffect(() => {
    if (course) {
      document.title = `${course.name} | Margea Golf – Cancun & Riviera Maya`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", course.overview);
      }
    }
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/activities/golf")}>Back to Golf Courses</Button>
        </div>
      </div>
    );
  }

  const lowestPrice = Math.min(...course.pricing.map((p) => p.price));

  return (
    <div className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={course.image}
          alt={`${course.name} golf course`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <button
              onClick={() => navigate("/activities/golf")}
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Courses
            </button>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold text-white flex-1">
                {course.name}
              </h1>
              <ShareButton title={course.name} variant="light" stopPropagation={false} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {course.location}
              </span>
              <span>Designed by {course.designer}</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                From ${lowestPrice} USD
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-10">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Flag, label: "Holes", value: String(course.holes) },
                { icon: Trophy, label: "Par", value: String(course.par) },
                { icon: Ruler, label: "Yardage", value: course.yardage },
                { icon: BarChart3, label: "Difficulty", value: course.difficulty },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">About the Course</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2 mt-4">
                {course.highlights.map((h) => (
                  <span
                    key={h}
                    className="px-3 py-1 bg-primary/8 text-primary text-xs rounded-full font-medium"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Gallery</h2>
              <GolfCourseGallery images={course.galleryImages} courseName={course.name} />
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Player Reviews</h2>
              <div className="space-y-4">
                {course.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex gap-0.5 shrink-0 mt-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={cn(
                              "w-3.5 h-3.5",
                              s < 4 + (i % 2) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground mt-2 text-sm leading-relaxed italic">
                      "{review.text}"
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{review.author}</span>
                      {review.handicap && (
                        <span className="bg-muted px-2 py-0.5 rounded-full">HCP {review.handicap}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <GolfTeeTimeBooking course={course} />
            </div>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default GolfCourseDetail;
