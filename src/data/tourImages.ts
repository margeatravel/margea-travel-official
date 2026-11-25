// Tour ID → thumbnail image map (single source of truth for cart/upsell thumbnails)
import { whaleSharkCover } from "./whaleSharkImages";
import { media } from "@/lib/media";

export const tourImageMap: Record<string, string> = {
  "extreme-adventuring": media("/tour-images/extreme-adventuring-cover.jpg"),
  "extreme-horseback-riding": media("/tour-images/horseback-cover.jpg"),
  "private-snorkeling": media("/tour-images/snorkeling-2.png"),
  "snorkeling-adventure": media("/tour-images/snorkeling-adventure-cover.jpg"),
  "cenote-adventuring": media("/tour-images/cenote-1.png"),
  "city-taco-tour": media("/tour-images/taco-tour-cover.jpg"),
  "chichen-itza": media("/tour-images/chichen-itza-pyramid.jpg"),
  "akumal-sea-turtle": media("/tour-images/akumal-turtle-2.jpg"),
  "dolphin-swim-experience": media("/tour-images/dolphin-tulum-5.jpg"),
  "isla-mujeres": media("/tour-images/snorkeling-adventure-cover.jpg"),
  "wave-runner": media("/tour-images/wave-runner-1.jpeg"),
  "mayan-jungle-tour": media("/tour-images/mayan-jungle-tour-1.jpeg"),
  "extreme-snorkeling-package": media("/tour-images/extreme-combo-1.png"),
  "full-experience-two-days": media("/tour-images/extreme-adventuring-1.png"),
  "snorkeling-cenote-package": media("/tour-images/snorkeling-2.png"),
  "whale-shark-snorkeling": whaleSharkCover,
};

export function getTourImage(tourId: string): string | null {
  return tourImageMap[tourId] ?? null;
}
