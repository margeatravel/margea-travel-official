// src/lib/media.ts — AGREGAR este archivo al repo (el padre lo crea con el
// codemod, o a mano). Centraliza la base de las imagenes del sitio.
//
// ANTES: las imagenes vivian en public/ y el codigo usaba rutas locales
// ("/property-images/x.jpg"). DESPUES: viven en Supabase Storage, bucket
// publico "site-images", y el codigo usa media("/property-images/x.jpg").
//
// media() es tolerante: si la ruta ya es una URL externa (Airbnb CDN,
// Postimages, viejo proyecto Supabase) la devuelve tal cual; si es una
// ruta local la convierte a URL de Storage. Asi los datos viejos no se
// rompen y el mismo helper sirve para las URLs que vienen de la DB.

export const STORAGE_URL =
  "https://qikiiopqmiwsedpvxjqx.supabase.co/storage/v1/object/public/site-images";

export function media(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${STORAGE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
