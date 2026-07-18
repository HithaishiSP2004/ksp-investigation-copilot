import { StorageProvider, StorageUploadResult } from "../providers/storage-provider";

export class StorageService {
  private static MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

  /**
   * Validates and registers file uploads with the StorageProvider
   */
  static async registerUpload(file: File): Promise<StorageUploadResult> {
    // 1. Enforce size limits
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File exceeds maximum size limits (50MB).`);
    }

    // 2. Delegate to the provider
    return StorageProvider.uploadFile(file);
  }
}
