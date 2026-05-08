export function dataUrlToBase64(dataUrl: string): string {
  const matches = dataUrl.match(/^data:image\/([a-z]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid data URL format');
  }
  return matches[2];
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(dataUrlToBase64(result));
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

export function getMimeType(dataUrl: string): string {
  const matches = dataUrl.match(/^data:([a-z]+\/[a-z]+);base64,/);
  if (!matches) {
    return 'image/jpeg';
  }
  return matches[1];
}

export async function resizeImageIfNeeded(
  base64: string,
  maxWidth: number = 1024
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = base64;
  });
}

export async function processImageFile(file: File): Promise<{
  base64: string;
  mimeType: string;
  dataUrl: string;
}> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  const mimeType = getMimeType(dataUrl);
  const base64 = dataUrlToBase64(dataUrl);

  return {
    base64,
    mimeType,
    dataUrl,
  };
}