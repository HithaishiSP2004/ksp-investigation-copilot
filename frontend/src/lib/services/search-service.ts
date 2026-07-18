export interface SearchResult<T> {
  item: T;
  score: number; // For relevance ranking
}

export type SearchIndexType = "cases" | "evidence" | "person" | "vehicle" | "phone" | "location";

export class SearchService {
  /**
   * Performs a generic fuzzy text scan on an array of objects based on designated fields
   */
  static search<T>(
    items: T[],
    query: string,
    searchableFields: (keyof T)[],
    filters?: Partial<Record<keyof T, unknown>>
  ): T[] {
    const cleanQuery = query.trim().toLowerCase();
    
    // Apply filters first
    let result = [...items];
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== "" && val !== null) {
          result = result.filter(item => {
            const itemVal = item[key as keyof T];
            return String(itemVal).toLowerCase() === String(val).toLowerCase();
          });
        }
      });
    }

    if (!cleanQuery) return result;

    // Apply text search with simple score metrics
    const scored = result.map(item => {
      let score = 0;
      searchableFields.forEach(field => {
        const value = String(item[field]).toLowerCase();
        if (value === cleanQuery) {
          score += 10; // Exact match
        } else if (value.startsWith(cleanQuery)) {
          score += 5;  // Prefix match
        } else if (value.includes(cleanQuery)) {
          score += 2;  // Partial match
        }
      });
      return { item, score };
    });

    return scored
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.item);
  }
}
