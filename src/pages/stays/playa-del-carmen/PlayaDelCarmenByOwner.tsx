import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function PlayaDelCarmenByOwner() {
  return <CitySubpage cityName="Playa del Carmen" citySlug="playa-del-carmen" subpageType="by-owner" heroImage={media("/property-images/nickprice-1.jpg")} />;
}
