import { requestJson } from './httpClient';

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(kind, file) {
  const dataUrl = await fileToDataUrl(file);
  return requestJson('/api/uploads/image', {
    method: 'POST',
    body: JSON.stringify({ kind, dataUrl }),
  });
}

