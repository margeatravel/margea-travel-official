import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function PuertoMorelosByOwner() {
  return <CitySubpage cityName="Puerto Morelos" citySlug="puerto-morelos" subpageType="by-owner" heroImage={media("/property-images/puerto-morelos-1.jpg")} />;
}
