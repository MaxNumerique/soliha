import { CldUploadWidget } from 'next-cloudinary';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export { CldUploadWidget };
