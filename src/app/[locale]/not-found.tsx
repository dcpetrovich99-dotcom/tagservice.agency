import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="container-x section flex flex-col items-center text-center">
      <div className="num-accent text-6xl" style={{ color: "var(--brand-strong)" }}>
        404
      </div>
      <h1 className="h-display mt-4 text-2xl">{t("title")}</h1>
      <Link href="/" className="btn btn-primary mt-6">
        {t("home")}
      </Link>
    </div>
  );
}
