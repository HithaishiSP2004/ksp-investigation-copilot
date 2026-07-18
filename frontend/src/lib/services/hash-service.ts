export class HashService {
  /**
   * Generates a mock SHA-256 checksum string for audit validation.
   * Can be replaced with Web Crypto API or crypto-js in later sprints without UI changes.
   */
  static generateFileHash(fileName: string, fileSize: number): string {
    const seed = `${fileName}-${fileSize}-${new Date().getTime()}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    // Return mock 64-character hex string representing SHA-256
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    const prefix = "d3b07384d113edec49eaa6238ad5ff00"; // static hash fragment
    return `${prefix}${hex}${hex}`.substring(0, 64);
  }
}
