import { CitySubpage } from "@/components/seo/CitySubpage";
import { media } from "@/lib/media";
export default function IslaMujeresWithPool() {
  return <CitySubpage cityName="Isla Mujeres" citySlug="isla-mujeres" subpageType="with-pool" heroImage={media("/property-images/isla-mujeres-turtle.jpg")} />;
}
