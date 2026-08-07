// Uploads para o Storage. A política de escrita exige que o primeiro nível
// do caminho seja o id do profile — por isso todo path começa com
// `${profileId}/`; qualquer outro prefixo é recusado pela RLS.
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { APARTMENT_PHOTOS_BUCKET, AVATARS_BUCKET } from "@/lib/supabase/buckets";

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const ACCEPTED_IMAGE_TYPES = Object.keys(EXTENSION_BY_TYPE);

function extensionFor(file: File): string {
  return EXTENSION_BY_TYPE[file.type] ?? "jpg";
}

function randomName(file: File): string {
  return `${crypto.randomUUID()}.${extensionFor(file)}`;
}

export function isAcceptedImage(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
}

/** Sobe o avatar e devolve a URL pública já pronta para gravar no perfil. */
export async function uploadAvatar(profileId: string, file: File): Promise<string> {
  const supabase = getBrowserSupabase();
  const path = `${profileId}/${randomName(file)}`;

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) throw new Error("Não foi possível enviar sua foto de perfil.");

  return supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export type UploadedPhoto = { path: string; position: number };

/**
 * Sobe as fotos do anúncio. Uma falha isolada não derruba o anúncio inteiro:
 * devolve o que subiu e quantas ficaram para trás, e quem chama decide o
 * que dizer ao usuário.
 */
export async function uploadApartmentPhotos(
  profileId: string,
  apartmentId: string,
  files: File[],
): Promise<{ uploaded: UploadedPhoto[]; failed: number }> {
  const supabase = getBrowserSupabase();
  const uploaded: UploadedPhoto[] = [];
  let failed = 0;

  for (const [index, file] of files.entries()) {
    const path = `${profileId}/${apartmentId}/${randomName(file)}`;
    const { error } = await supabase.storage
      .from(APARTMENT_PHOTOS_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      failed += 1;
      continue;
    }
    uploaded.push({ path, position: index });
  }

  return { uploaded, failed };
}
