import { getAllCategories } from "@/lib/regulations/engine";
import type { RegulationCategory } from "@/types";

export interface RegulatoryStats {
  frameworkCount: number;
  checkCount: number;
  categories: RegulationCategory[];
}

export function getRegulatoryStats(): RegulatoryStats {
  const categories = getAllCategories();
  const frameworkCount = categories.length;
  const checkCount = categories.reduce((sum, category) => sum + category.items.length, 0);

  return { frameworkCount, checkCount, categories };
}
