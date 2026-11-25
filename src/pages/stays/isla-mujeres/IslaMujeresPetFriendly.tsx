import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function IslaMujeresPetFriendly() {
  return <CitySubpage cityName="Isla Mujeres" citySlug="isla-mujeres" subpageType="pet-friendly" heroImage={media("/property-images/isla-mujeres-turtle.jpg")} />;
}
