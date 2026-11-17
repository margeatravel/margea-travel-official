// Tour ID → thumbnail image map (single source of truth for cart/upsell thumbnails)
import { whaleSharkCover } from "./whaleSharkImages";

export const tourImageMap: Record<string, string> = {
  "extreme-adventuring": "/tour-images/extreme-adventuring-cover.jpg",
  "extreme-horseback-riding": "/tour-images/horseback-cover.jpg",
  "private-snorkeling": "/tour-images/snorkeling-2.png",
  "snorkeling-adventure": "/tour-images/snorkeling-adventure-cover.jpg",
  "cenote-adventuring": "/tour-images/cenote-1.png",
  "city-taco-tour": "/tour-images/taco-tour-cover.jpg",
  "chichen-itza": "/tour-images/chichen-itza-pyramid.jpg",
  "akumal-sea-turtle": "/tour-images/akumal-turtle-2.jpg",
  "dolphin-swim-experience": "/tour-images/dolphin-tulum-5.jpg",
  "isla-mujeres": "/tour-images/snorkeling-adventure-cover.jpg",
  "wave-runner": "/tour-images/wave-runner-1.jpeg",
  "mayan-jungle-tour": "/tour-images/mayan-jungle-tour-1.jpeg",
  "extreme-snorkeling-package": "/tour-images/extreme-combo-1.png",
  "full-experience-two-days": "/tour-images/extreme-adventuring-1.png",
  "snorkeling-cenote-package": "/tour-images/snorkeling-2.png",
  "whale-shark-snorkeling": whaleSharkCover,
};

export function getTourImage(tourId: string): string | null {
  return tourImageMap[tourId] ?? null;
}
