import { cityContentData } from "./cityContent";

interface CityContentProps {
  language: "en" | "es";
  citySlug: string;
  images: string[];
}

export function CityContent({ language, citySlug, images }: CityContentProps) {
  const cityData = cityContentData[citySlug];
  
  if (!cityData) {
    return null;
  }

  const content = cityData.content[language];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{content.discoverTitle}</h2>
          
          {content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xl font-semibold mt-8 mb-4">{section.title}</h3>
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-muted-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
              
              {/* Insert image after first section */}
              {sectionIndex === 0 && images[0] && (
                <img 
                  src={images[0]} 
                  alt={`${cityData.cityName} vacation rental view`}
                  className="w-full h-64 object-cover rounded-lg my-8"
                  loading="lazy"
                />
              )}
              
              {/* Insert image after second section */}
              {sectionIndex === 1 && images[1] && (
                <img 
                  src={images[1]} 
                  alt={`${cityData.cityName} property`}
                  className="w-full h-64 object-cover rounded-lg my-8"
                  loading="lazy"
                />
              )}
              
              {/* Insert image after third section */}
              {sectionIndex === 2 && images[2] && (
                <img 
                  src={images[2]} 
                  alt={`${cityData.cityName} vacation rental interior`}
                  className="w-full h-64 object-cover rounded-lg my-8"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
