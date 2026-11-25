import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function CancunWithPool() {
  return <CitySubpage cityName="Cancun" citySlug="cancun" subpageType="with-pool" heroImage={media("/property-images/cancun-estate-1.jpg")} />;
}
