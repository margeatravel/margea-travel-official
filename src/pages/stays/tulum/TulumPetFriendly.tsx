import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function TulumPetFriendly() {
  return <CitySubpage cityName="Tulum" citySlug="tulum" subpageType="pet-friendly" heroImage={media("/property-images/tulum-2.jpg")} />;
}
