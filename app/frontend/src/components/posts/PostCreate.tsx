<<<<<<< HEAD
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { postsApi } from './api';
import type { PostData } from './api';
import MediaUpload from './MediaUpload';
import type { MediaFile } from './MediaUpload';
import PostPreview from './PostPreview';

const PostCreate: React.FC = () => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const quillRef = useRef<ReactQuill>(null);

  // Rich text editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'align',
    'link', 'blockquote', 'code-block'
  ];

  const handleMediaChange = (files: MediaFile[]) => {
    setMediaFiles(files);
    setErrors(prev => prev.filter(error => !error.includes('media')));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    
    if (!content.trim()) {
      newErrors.push('Post content is required');
    }
    
    if (content.length > 5000) {
      newErrors.push('Post content cannot exceed 5000 characters');
    }
    
    if (mediaFiles.length > 5) {
      newErrors.push('Maximum 5 media files allowed');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Upload media files first
      let mediaUrl = '';
      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map(async (mediaFile) => {
          const result = await postsApi.uploadMedia(mediaFile.file);
          
          if (!result.success) {
            throw new Error(`Failed to upload ${mediaFile.name}: ${result.error}`);
          }
          
          return result.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        mediaUrl = uploadedUrls[0] || ''; // For now, use the first media file
      }

      // Create post
      const postData: PostData = {
        content: content.trim(),
        media_url: mediaUrl || undefined
      };

      const result = await postsApi.createPost(postData);

      if (result.success) {
        // Reset form
        setContent('');
        setMediaFiles([]);
        setIsPreviewMode(false);
        
        // Show success message (you can implement a toast notification here)
        alert('Post created successfully!');
      } else {
        setErrors([result.error || 'Failed to create post']);
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'An unexpected error occurred']);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Post</h2>
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isPreviewMode ? <FiEyeOff className="mr-2" /> : <FiEye className="mr-2" />}
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            {errors.map((error, index) => (
              <div key={index} className="text-red-600 text-sm">{error}</div>
            ))}
          </div>
        )}

        {isPreviewMode ? (
          <PostPreview 
            content={content}
            mediaFiles={mediaFiles}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  ref={quillRef}
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="What's on your mind?"
                  className="h-48"
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {content.length}/5000 characters
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Media (Optional)
              </label>
              <MediaUpload
                mediaFiles={mediaFiles}
                onMediaChange={handleMediaChange}
                maxFiles={5}
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  setMediaFiles([]);
                  setErrors([]);
                }}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Post'
                )}
              </button>
            </div>
          </form>
        )}
=======
import React, { useState } from 'react';
import ImageUpload from '../common/ImageUpload';
// You can use a simple textarea for rich text, or integrate a library like react-quill for full rich text support
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const PostCreate: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!userId.trim()) {
      setError('User ID is required.');
      return;
    }
    if (!content.trim()) {
      setError('Post content is required.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('content', content);
    if (media) formData.append('media', media);
    try {
      const res = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to submit post');
      setSuccess('Post submitted successfully!');
      setContent('');
      setMedia(null);
      setPreview(false);
    } catch (err) {
      setError('Failed to submit post.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Create Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded p-2"
            type="text"
            placeholder="Enter your User ID"
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
          {/* For rich text, replace textarea with ReactQuill if desired */}
          <textarea
            className="w-full border rounded p-2"
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your post..."
          />
          <ImageUpload label="Media (Image/Video)" onImageChange={setMedia} />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setPreview(!preview)} className="px-3 py-1 bg-gray-200 rounded">
              {preview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </form>
        {preview && (
          <div className="border rounded p-4 mt-4 bg-gray-50">
            <h4 className="font-bold mb-2">Preview</h4>
            <div className="mb-2 whitespace-pre-line">{content}</div>
            {media && (
              <div>
                {media.type.startsWith('image') ? (
                  <img src={URL.createObjectURL(media)} alt="preview" className="max-w-xs max-h-48" />
                ) : media.type.startsWith('video') ? (
                  <video controls className="max-w-xs max-h-48">
                    <source src={URL.createObjectURL(media)} type={media.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
            )}
          </div>
        )}
>>>>>>> day-5-post-creation
      </div>
    </div>
  );
};

export default PostCreate; 