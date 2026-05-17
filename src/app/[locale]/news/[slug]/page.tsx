import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { isLocale } from "@/i18n/routing";
import { getNewsBySlug, pickL } from "@/lib/content";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const L = locale as "uk" | "ru";

  const t = await getTranslations("news");
  const post = await getNewsBySlug(slug);
  if (!post || !post.isPublished) notFound();

  return (
    <article className="container-x section max-w-3xl">
      <Link
        href="/news"
        className="text-sm font-semibold"
        style={{ color: "var(--brand-strong)" }}
      >
        ← {t("title")}
      </Link>

      <div className="text-muted mt-6 text-sm">
        {new Date(post.publishedAt).toLocaleDateString(L)}
      </div>
      <h1 className="h-display mt-2 text-3xl sm:text-4xl">
        {pickL(post, "title", L)}
      </h1>

      {post.coverUrl && (
        <div className="card mt-6 overflow-hidden">
          <Image
            src={post.coverUrl}
            alt={pickL(post, "title", L)}
            width={900}
            height={500}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed">
        {pickL(post, "body", L)}
      </div>
    </article>
  );
}
