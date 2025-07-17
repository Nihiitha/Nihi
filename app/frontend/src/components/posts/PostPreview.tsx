import React from 'react';
import type { MediaFile } from './MediaUpload';

interface PostPreviewProps {
  content: string;
  mediaFiles: MediaFile[];
  authorName?: string;
  authorAvatar?: string;
  timestamp?: string;
}

const PostPreview: React.FC<PostPreviewProps> = ({
  content,
  mediaFiles,
  authorName = 'Your Name',
  authorAvatar,
  timestamp = 'Just now'
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      {/* Author Info */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-full h-full rounded-full object-cover" />
          ) : (
            authorName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="ml-3">
          <div className="font-semibold text-gray-900">{authorName}</div>
          <div className="text-sm text-gray-500">{timestamp}</div>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className="prose max-w-none text-gray-900"
        dangerouslySetInnerHTML={{ 
          __html: content || '<p class="text-gray-400 italic">No content</p>' 
        }}
      />
      
      {/* Media */}
      {mediaFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative">
              {file.type === 'image' ? (
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <video 
                  src={file.url} 
                  controls
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Post Actions Preview */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6 text-gray-500">
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <span>👍</span>
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <span>💬</span>
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <span>↗️</span>
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPreview; 