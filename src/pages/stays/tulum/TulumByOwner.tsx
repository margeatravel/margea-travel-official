import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function TulumByOwner() {
  return <CitySubpage cityName="Tulum" citySlug="tulum" subpageType="by-owner" heroImage={media("/property-images/tulum-1.jpg")} />;
}
