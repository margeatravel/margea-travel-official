import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function TulumOceanfront() {
  return <CitySubpage cityName="Tulum" citySlug="tulum" subpageType="oceanfront" heroImage={media("/property-images/tulum-1.jpg")} />;
}
