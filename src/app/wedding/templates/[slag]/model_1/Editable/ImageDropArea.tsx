import React from 'react';

interface ImageDropAreaProps {
  setImage: (file: File | null) => void;
  className?: string;
}

const ImageDropArea: React.FC<ImageDropAreaProps> = ({ setImage, className = '' }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />
      <p className="text-sm text-gray-500 mt-2">Select an image file</p>
    </div>
  );
};

export default ImageDropArea; 