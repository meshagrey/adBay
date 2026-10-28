/**
 * Client-side image optimization utility using HTML5 Canvas.
 * Resizes and compresses user-uploaded product images before uploading to storage,
 * drastically reducing mobile data payload and improving loading times.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export async function optimizeImage(
  fileOrDataUrl: File | Blob | string,
  options: ImageOptimizationOptions = {}
): Promise<{ dataUrl: string; width: number; height: number; originalSize: number; compressedSize: number }> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  let originalSize = 0;
  if (fileOrDataUrl instanceof Blob) {
    originalSize = fileOrDataUrl.size;
  }

  // Convert File or Blob to Data URL if needed
  const src = await new Promise<string>((resolve, reject) => {
    if (typeof fileOrDataUrl === 'string') {
      originalSize = Math.round((fileOrDataUrl.length * 3) / 4);
      resolve(fileOrDataUrl);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(fileOrDataUrl);
  });

  // Load image into an HTMLImageElement
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = src;
  });

  // Calculate target dimensions maintaining aspect ratio
  let targetWidth = img.width;
  let targetHeight = img.height;

  if (targetWidth > maxWidth || targetHeight > maxHeight) {
    const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  // Draw to offscreen HTML5 canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // Enable high-quality bilinear image scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill white background for transparent PNGs converted to JPEG
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Compress using Canvas toDataURL
  const dataUrl = canvas.toDataURL(mimeType, quality);
  const compressedSize = Math.round((dataUrl.length * 3) / 4);

  return {
    dataUrl,
    width: targetWidth,
    height: targetHeight,
    originalSize,
    compressedSize,
  };
}

/**
 * Creates a fast square or 4:3 thumbnail for list views
 */
export async function generateThumbnail(
  fileOrDataUrl: File | Blob | string,
  maxDimension = 320,
  quality = 0.75
): Promise<string> {
  const result = await optimizeImage(fileOrDataUrl, {
    maxWidth: maxDimension,
    maxHeight: maxDimension,
    quality,
    mimeType: 'image/jpeg',
  });
  return result.dataUrl;
}
