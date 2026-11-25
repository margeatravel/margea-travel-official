import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function PlayaDelCarmenWithPool() {
  return <CitySubpage cityName="Playa del Carmen" citySlug="playa-del-carmen" subpageType="with-pool" heroImage={media("/property-images/mayakoba-1.jpg")} />;
}
