const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_DIMENSION = 1200;

export async function processVisionImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("Selecciona un archivo de imagen.");
  if (file.size > MAX_IMAGE_SIZE) throw new Error("La imagen no puede superar 10 MB.");

  const canvas = document.createElement("canvas");
  let width: number;
  let height: number;
  let bitmap: ImageBitmap | undefined;
  let objectUrl = "";
  let source: CanvasImageSource;

  try {
    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;
      source = bitmap;
    } else {
      objectUrl = URL.createObjectURL(file);
      const image = await loadImage(objectUrl);
      width = image.naturalWidth;
      height = image.naturalHeight;
      source = image;
    }

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo procesar la imagen.");
    context.drawImage(source, 0, 0, canvas.width, canvas.height);

    try {
      return await canvasToBlob(canvas, "image/webp", "image/webp");
    } catch {
      return await canvasToBlob(canvas, "image/jpeg", "image/jpeg");
    }
  } finally {
    bitmap?.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo leer la imagen."));
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, expectedType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || blob.type !== expectedType) {
        reject(new Error("No se pudo convertir la imagen."));
      } else {
        resolve(blob);
      }
    }, type, 0.75);
  });
}
