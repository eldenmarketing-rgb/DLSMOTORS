import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * POST /api/revalidate
 * Header : Authorization: Bearer <REVALIDATE_SECRET>
 * Body   : { tags: string[], paths?: string[] }
 *
 * Appelée par le SEO Dashboard à la publication (et à la dépublication) d'une
 * page : purge le cache des tags concernés pour que le contenu Supabase soit
 * servi immédiatement, sans rebuild ni déploiement. Les tags `catalog:<site>`
 * passent par la même route.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET non configuré" },
      { status: 500 },
    );
  }

  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let tags: unknown;
  let paths: unknown;
  try {
    ({ tags, paths } = await request.json());
  } catch {
    return NextResponse.json({ error: "JSON attendu" }, { status: 400 });
  }

  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    return NextResponse.json(
      { error: "tags: string[] requis" },
      { status: 400 },
    );
  }
  if (
    paths !== undefined &&
    (!Array.isArray(paths) || paths.some((p) => typeof p !== "string"))
  ) {
    return NextResponse.json(
      { error: "paths: string[] attendu" },
      { status: 400 },
    );
  }

  // `expire: 0` purge immédiatement ; un profil nommé ("max"…) ferait du
  // stale-while-revalidate et la visite suivante servirait encore l'ancienne version.
  for (const tag of tags as string[]) revalidateTag(tag, { expire: 0 });

  // Les pages sont prérendues avec `revalidate = 3600` : sans purge du cache de
  // route, le HTML du build serait encore servi pendant une heure.
  for (const path of (paths as string[] | undefined) ?? [])
    revalidatePath(path);

  // Les pages de liste dépendent de toutes les pages : une publication doit
  // les rafraîchir même si le dashboard ne les nomme pas.
  revalidatePath("/blog");
  revalidatePath(`/${siteConfig.sectionRoot}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    revalidated: tags,
    paths: (paths as string[] | undefined) ?? [],
    at: new Date().toISOString(),
  });
}
