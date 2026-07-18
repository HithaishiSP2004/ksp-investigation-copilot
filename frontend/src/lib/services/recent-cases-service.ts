"use client";

const RECENT_CASES_KEY = "ksp_recent_cases";

export class RecentCasesService {
  /**
   * Retrieves the list of recently accessed case IDs
   */
  static getRecentCaseIds(): number[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(RECENT_CASES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Appends a case ID to the recently accessed files list, keeping only the top 5
   */
  static addRecentCaseId(id: number): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getRecentCaseIds();
      // Remove if already exists to push it to the top
      const filtered = current.filter(item => item !== id);
      filtered.unshift(id);
      // Keep only top 5 entries
      const sliced = filtered.slice(0, 5);
      localStorage.setItem(RECENT_CASES_KEY, JSON.stringify(sliced));
    } catch {
      // Fail-safe silently
    }
  }

  /**
   * Clears the history list
   */
  static clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(RECENT_CASES_KEY);
    } catch {}
  }
}
