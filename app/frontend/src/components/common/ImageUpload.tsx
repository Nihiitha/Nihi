import React, { useState, useRef, useCallback } from 'react';
import { FaCloudUploadAlt, FaTimes, FaSpinner } from 'react-icons/fa';

interface ImageUploadProps {
  label: string;
  currentImage?: string;
  onImageChange: (file: File | null) => void;
  onImageRemove?: () => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  currentImage,
  onImageChange,
  onImageRemove,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload ${acceptedTypes.map(type => type.split('/')[1]).join(', ')} files.`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB.`;
    }

    return null;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        setUploadProgress(100);
        setIsUploading(false);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [maxSize, acceptedTypes, onImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    setUploadProgress(0);
    onImageChange(null);
    if (onImageRemove) {
      onImageRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        data-testid="file-input"
      />

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-48 rounded-lg shadow-sm"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {isUploading ? (
              <div className="space-y-2">
                <FaSpinner className="mx-auto h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-600">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} up to {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <FaTimes className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload; 