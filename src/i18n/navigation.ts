import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Локале-обізнані Link / useRouter / redirect / usePathname.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
