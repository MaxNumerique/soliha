import { v2 as cloudinary } from 'cloudinary';
import { CldUploadWidget } from 'next-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File): Promise<{ url: string, publicId: string }> => {
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
    return {
      url: result.url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (file: File): Promise<{ url: string, publicId: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      cloudinary.uploader.upload(
        `data:${file.type};base64,${base64}`,
        {
          folder: 'soliha_articles',
          upload_preset: 'soliha_articles',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve({
              url: result?.secure_url || '',
              publicId: result?.public_id || ''
            });
          }
        }
      );
    };
    reader.readAsDataURL(file);
  });
};

export { CldUploadWidget, cloudinary };
