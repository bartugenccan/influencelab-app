import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const CLOTHING_DIR = `${FileSystem.documentDirectory}clothing/`;

/**
 * Initialize storage directory
 */
export const initStorage = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(CLOTHING_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CLOTHING_DIR, { intermediates: true });
  }
};

/**
 * Save image to local storage
 */
export const saveImage = async (uri: string, filename?: string): Promise<string> => {
  await initStorage();

  const timestamp = Date.now();
  const extension = uri.split('.').pop() || 'jpg';
  const name = filename || `clothing_${timestamp}.${extension}`;
  const destination = `${CLOTHING_DIR}${name}`;

  await FileSystem.copyAsync({
    from: uri,
    to: destination,
  });

  return destination;
};

/**
 * Get all saved clothing images
 */
export const getSavedImages = async (): Promise<string[]> => {
  await initStorage();

  const files = await FileSystem.readDirectoryAsync(CLOTHING_DIR);
  return files
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map((file) => `${CLOTHING_DIR}${file}`);
};

/**
 * Delete an image
 */
export const deleteImage = async (uri: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

/**
 * Get file URI for display (handles platform differences)
 */
export const getFileUri = (path: string): string => {
  if (Platform.OS === 'ios') {
    return path.replace('file://', '');
  }
  return path;
};

/**
 * Get MIME type from file URI
 * @param uri - File URI from image picker or file system
 * @returns MIME type string (e.g., 'image/jpeg', 'video/mp4')
 */
export const getMimeType = (uri: string): string => {
  // Clean URI (remove query strings and fragments)
  const cleanUri = uri.split('?')[0].split('#')[0];

  // Extract file extension
  const extension = cleanUri.split('.').pop()?.toLowerCase() || '';

  // Map extensions to MIME types
  const mimeTypes: Record<string, string> = {
    // Images (supported formats from mockup)
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',

    // Videos (supported formats from mockup)
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  };

  return mimeTypes[extension] || 'application/octet-stream';
};

export const createMediaFormData = (uri: string, fieldName: string = 'file'): FormData => {
  const formData = new FormData();
  const filename = uri.split('/').pop() || `upload_${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;
  formData.append(fieldName, { uri, name: filename, type } as any);
  return formData;
};

export const validateFileSize = async (
  uri: string,
  maxSizeMB: number,
  size: number
): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      return false;
    }
    const fileSizeMB = fileInfo.size ? fileInfo.size / (1024 * 1024) : 0;
    return fileSizeMB <= maxSizeMB;
  } catch (error) {
    console.error('Error validating file size:', error);
    return false;
  }
};

export const validateVideoDuration = async (
  uri: string,
  maxDurationSec: number,
  duration: number
): Promise<boolean> => {
  // Note: Expo FileSystem does not provide video duration.
  // This function would require a different approach, possibly using a video processing library.
  return true; // Placeholder implementation
};
