// Nomes dos buckets de Storage. Sem segredo aqui — é seguro importar tanto
// do servidor quanto do browser.

export const APARTMENT_PHOTOS_BUCKET = "apartment-photos";
export const AVATARS_BUCKET = "avatars";

/**
 * Monta a URL pública de um objeto. Os dois buckets do projeto são públicos
 * (o catálogo é público por definição), então o caminho `/object/public/`
 * dispensa assinatura e cai direto no CDN.
 */
export function buildPublicStorageUrl(supabaseUrl: string, bucket: string, path: string): string {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`;
}
