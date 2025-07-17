import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiImage, FiVideo } from 'react-icons/fi';

export interface MediaFile {
  file: File;
  url: string;
  type: 'image' | 'video';
  name: string;
}

interface MediaUploadProps {
  mediaFiles: MediaFile[];
  onMediaChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  mediaFiles,
  onMediaChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ''
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMediaFiles: MediaFile[] = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      name: file.name
    }));
    
    onMediaChange([...mediaFiles, ...newMediaFiles]);
  }, [mediaFiles, onMediaChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxSize,
    multiple: true,
    disabled: mediaFiles.length >= maxFiles
  });

  const removeMediaFile = (index: number) => {
    const newFiles = [...mediaFiles];
    URL.revokeObjectURL(newFiles[index].url);
    newFiles.splice(index, 1);
    onMediaChange(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : mediaFiles.length >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          {mediaFiles.length >= maxFiles
            ? `Maximum ${maxFiles} files reached`
            : isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop images or videos here, or click to select files'
          }
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Maximum {maxFiles} files, {formatFileSize(maxSize)} each. Supported: JPG, PNG, GIF, MP4, WebM
        </p>
      </div>

      {/* Media Files Preview */}
      {mediaFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Selected Media ({mediaFiles.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="relative">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  
                  {/* File Type Icon */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white rounded-full p-1">
                    {file.type === 'image' ? (
                      <FiImage className="w-4 h-4" />
                    ) : (
                      <FiVideo className="w-4 h-4" />
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeMediaFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-500 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload; 