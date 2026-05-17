import { z } from "zod";

// Схема заявки з квіз-форми. Поля — рівно за вимогою замовника.
export const leadSchema = z.object({
  projectDesc: z
    .string()
    .trim()
    .min(3, "errorRequired")
    .max(2000),
  projectLinks: z.string().trim().max(500).optional().or(z.literal("")),
  dailyBudget: z.enum(["20", "50", "100", "300"]),
  hasActiveTraffic: z.boolean(),
  contact: z.string().trim().min(2, "errorRequired").max(200),
  locale: z.enum(["uk", "ru"]),
  sourcePage: z.string().trim().max(40).default("home"),
  // Honeypot: реальні користувачі лишають порожнім.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const BUDGET_LABEL: Record<string, string> = {
  "20": "$20–$50 / день",
  "50": "$50–$100 / день",
  "100": "$100–$300 / день",
  "300": "> $300 / день",
};
