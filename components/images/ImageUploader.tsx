import { getRandomIntInRange } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Plus, Trash } from 'lucide-react';

// ImageUploader Component
const ImageUploader = ({ defaultValue, onChange }) => {
    const [image, setImage] = useState(defaultValue || null);
  
    useEffect(() => {
      // Simulate generating a random ID for the image when defaultValue changes
      if (defaultValue && !image) {
        const id = getRandomIntInRange(15, 50);
        const newImage = {
          id: `${id}`,
          url: `https://picsum.photos/id/${id}/400/400`, // Simulated URL
        };
        setImage(newImage);
        onChange(newImage);
      }
    }, [defaultValue, image, onChange]);
  
    const handleDelete = async () => {
      setImage(null);
      onChange(null);
    };
  
    return (
      <div className="w-48 h-48 border-2 rounded-lg border-gray-300 flex items-center justify-center">
        {image ? (
          <div className="relative w-full h-full">
            <Image width={300} height={300} src={image.url} alt="Uploaded" className="w-full h-full object-cover" />
            <Button type='button' onClick={handleDelete} className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1">
              <Trash/>
            </Button>
          </div>
        ) : (
          <span className="text-gray-500">No image uploaded</span>
        )}
      </div>
    );
  };
  
  // MultipleImageUploader Component
  const MultipleImageUploader = ({ defaultValue = [], onChange }) => {
    const [images, setImages] = useState(defaultValue);
  
    const handleImageChange = (newImage, index) => {
      const updatedImages = [...images];
  
      if (newImage) {
        updatedImages[index] = newImage;
      } else {
        updatedImages.splice(index, 1); // Remove image at specified index
      }
  
      setImages(updatedImages);
      onChange(updatedImages.filter(Boolean)); // Remove null values from the array
    };
  
    const addImageUploader = () => {
      // Check if there is already a null value in the array
      if (!images.includes(null)) {
        // Generate a new image
        const id = getRandomIntInRange(15, 50);
        const newImage = {
          id: `${id}`,
          url: `https://picsum.photos/id/${id}/600/600`, // Simulated URL
        };
  
        setImages([...images, newImage]);
        onChange([...images, newImage]);
      } else {
        console.log('There is already an empty slot for image upload.');
      }
    };
  
    return (
      <div>
        <div className="flex items-center flex-wrap gap-4">
          {images.map((image, index) => (
            <ImageUploader
              key={index}
              defaultValue={image}
              onChange={(newImage) => handleImageChange(newImage, index)}
            />
          ))}
          <Button
            type='button'
            onClick={addImageUploader}
            className="w-48 h-48 border-2 rounded-lg gap-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500"
          >
            Add Image <ImagePlus/>
          </Button>
        </div>
      </div>
    );
  };
  
  export { ImageUploader, MultipleImageUploader };