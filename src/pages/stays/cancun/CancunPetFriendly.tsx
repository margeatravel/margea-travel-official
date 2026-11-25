import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function CancunPetFriendly() {
  return <CitySubpage cityName="Cancun" citySlug="cancun" subpageType="pet-friendly" heroImage={media("/property-images/cancun-estate-1.jpg")} />;
}
