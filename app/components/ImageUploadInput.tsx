import React, { useState, ChangeEvent } from 'react';
import { MdDelete, MdCloudUpload } from 'react-icons/md';
import { toast } from 'react-hot-toast';

interface ImageUploadInputProps {
  images: string[];
  maxImages?: number;
  onChange: (images: string[]) => void;
}

export default function ImageUploadInput({
  images,
  maxImages = 5,
  onChange
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille du fichier ne doit pas dépasser 5 Mo');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Seuls les formats JPEG, PNG et WebP sont autorisés');
      return;
    }

    // Check max images
    if (images.length >= maxImages) {
      toast.error(`Vous ne pouvez pas téléverser plus de ${maxImages} images`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onChange([...images, result.url]);
      toast.success('Image téléversée avec succès');
    } catch (error) {
      console.error('Erreur de téléversement:', error);
      toast.error('Impossible de téléverser l\'image');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Images (max {maxImages})
      </label>

      {images.map((url, index) => (
        <div key={index} className="flex gap-2 mb-2 items-center">
          <img
            src={url}
            alt={`Uploaded image ${index + 1}`}
            className="w-20 h-20 object-cover rounded"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="btn btn-sm btn-ghost text-red-500"
          >
            <MdDelete />
          </button>
        </div>
      ))}

      {images.length < maxImages && (
        <div className="mt-2">
          <label className="btn btn-sm btn-outline">
            <MdCloudUpload className="mr-2" />
            {isUploading ? 'Téléversement...' : 'Téléverser une image'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
