import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function TulumLongTerm() {
  return <CitySubpage cityName="Tulum" citySlug="tulum" subpageType="long-term" heroImage={media("/property-images/tulum-1.jpg")} />;
}
