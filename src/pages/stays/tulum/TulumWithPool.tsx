import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function TulumWithPool() {
  return <CitySubpage cityName="Tulum" citySlug="tulum" subpageType="with-pool" heroImage={media("/property-images/tulum-2.jpg")} />;
}
