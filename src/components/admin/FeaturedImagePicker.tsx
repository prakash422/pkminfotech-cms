'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImagePicker from './ImagePicker';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface FeaturedImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function FeaturedImagePicker({
  value,
  onChange,
  label = "Featured Image",
  placeholder = "Enter image URL or select from media..."
}: FeaturedImagePickerProps) {
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    onChange(imageUrl);
    setShowImagePicker(false);
  };

  const clearImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="featuredImage">{label}</Label>
      
      {/* Image Preview */}
      {value && (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={value}
              alt="Featured image preview"
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all">
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            📸 Featured image selected • Perfect for social sharing (1200×630px)
          </p>
        </div>
      )}

      {/* Input Field */}
      <div className="flex gap-2">
        <Input
          id="featuredImage"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowImagePicker(true)}
          className="whitespace-nowrap"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Browse Media
        </Button>
      </div>

      {!value && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm mb-2">No featured image selected</p>
          <p className="text-gray-500 text-xs">
            Choose an image that represents your blog post. Optimal size: 1200×630px
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowImagePicker(true)}
            className="mt-3"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Featured Image
          </Button>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          onImageSelect={handleImageSelect}
          onClose={() => setShowImagePicker(false)}
          title="Select Featured Image"
          sizeRecommendation="Recommended: 1200×630px (Featured size) for optimal social sharing"
        />
      )}
    </div>
  );
}
