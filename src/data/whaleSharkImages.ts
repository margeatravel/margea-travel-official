// Whale Shark Snorkeling Adventure — CDN-hosted photo set (single source of truth)
import cover from "@/assets/whale-shark/whale-shark-cover.webp.asset.json";
import img1 from "@/assets/whale-shark/whale-shark-1.webp.asset.json";
import img2 from "@/assets/whale-shark/whale-shark-2.webp.asset.json";
import img3 from "@/assets/whale-shark/whale-shark-3.webp.asset.json";
import img4 from "@/assets/whale-shark/whale-shark-4.avif.asset.json";
import img5 from "@/assets/whale-shark/whale-shark-5.webp.asset.json";

export const whaleSharkCover: string = cover.url;

export const whaleSharkGallery: string[] = [
  cover.url,
  img1.url,
  img2.url,
  img3.url,
  img4.url,
  img5.url,
];
