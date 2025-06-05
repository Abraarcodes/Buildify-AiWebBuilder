import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<{ file: File; description: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({ file, description: '' }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDescriptionChange = (index: number, desc: string) => {
    const updated = [...images];
    updated[index].description = desc;
    setImages(updated);
  };

  const handleUploadAllImages = async () => {
    const uploaded: { url: string; description: string }[] = [];

    for (const img of images) {
      const formData = new FormData();
      formData.append('file', img.file);
      formData.append('upload_preset', 'mern-chat-app'); // 🔁 Replace with your actual preset
      formData.append('cloud_name', 'did9ru4ij'); // 🔁 Replace with your actual cloud name

      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/did9ru4ij/image/upload',
          formData
        );
        uploaded.push({
          url: res.data.secure_url,
          description: img.description
        });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    return uploaded;
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!prompt.trim()) return;

//     setUploading(true);
//     const uploadedImages = await handleUploadAllImages();
//     setUploading(false);


//     console.log("Navigating to /builder with:");
// console.log("Prompt:", prompt);
// console.log("Images:", uploadedImages);

//     navigate('/builder', {
//       state: {
//         prompt,
//         images: uploadedImages
//       }
//     });
//   };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!prompt.trim()) return;

  setUploading(true);
  const uploadedImages = await handleUploadAllImages();
  setUploading(false);

  // Build formatted image instructions
  let imageInstructions = '\n\nUse the following image URLs for website generation. Each image is associated with a specific section:\n';
  uploadedImages.forEach((img, index) => {
    imageInstructions += `Image ${index + 1}: ${img.description}\nURL: ${img.url}\n`;
  });

  const finalPrompt = `${prompt.trim()}\n\n${imageInstructions}\nPlease make sure the AI uses these images according to their descriptions in the website layout.Also in the image tag add this crossOrigin="anonymous"`;

  console.log("Navigating to /builder with final prompt:", finalPrompt);

  navigate('/builder', {
    state: {
      prompt: finalPrompt
    }
  });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Wand2 className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Buildify
          </h1>
          <p className="text-lg text-gray-300">
            Describe your dream website, and we'll help you build it step by step
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-32 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
            />

            {/* Image Upload */}
            <div className="mt-4">
              <label className="block text-gray-300 mb-1">
                Upload Custom Images (you can upload multiple):
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full bg-gray-900 text-gray-100 p-2 border border-gray-700 rounded"
              />
            </div>

            {/* Descriptions for each image */}
            {images.map((img, index) => (
              <div key={index} className="mt-4 space-y-2">
                <div className="text-gray-400 text-sm">Image {index + 1}: {img.file.name}</div>
                <input
                  type="text"
                  placeholder="Enter description (e.g., Hero Section)"
                  value={img.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="w-full bg-gray-900 text-gray-100 p-2 border border-gray-700 rounded"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={uploading}
              className="w-full mt-6 bg-blue-600 text-gray-100 py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading Images...' : 'Generate Website Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
