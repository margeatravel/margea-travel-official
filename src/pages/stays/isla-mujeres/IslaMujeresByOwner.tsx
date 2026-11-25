import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function IslaMujeresByOwner() {
  return <CitySubpage cityName="Isla Mujeres" citySlug="isla-mujeres" subpageType="by-owner" heroImage={media("/property-images/isla-mujeres-turtle.jpg")} />;
}
