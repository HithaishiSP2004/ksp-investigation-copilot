export interface StorageUploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export class StorageProvider {
  /**
   * Simulates uploading a file to a remote cloud host (like Zoho Catalyst File Store).
   * This implementation is provider-agnostic.
   */
  static async uploadFile(file: File): Promise<StorageUploadResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      fileUrl: `/api/evidence/preview/${file.name}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream"
    };
  }
}
